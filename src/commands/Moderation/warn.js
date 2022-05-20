const { inlineCode } = require('@discordjs/builders');

const parser = require('../../helpers/parser');
const Command = require('../../base/Command');

class Warn extends Command {
  constructor(props) {
    super(props);
    this.name = 'warn';
    this.deleteAfterExec = false;
    this.accessByRole = true;
    this.permissions = ['BAN_MEMBERS', 'SEND_MESSAGES', 'ADD_REACTIONS'];
  }

  dropIncorrectUseWarning(message) {
    const prefix = this.client.config.botPrefix;

    return message.dropWarning(
      'Некорректные аргументы',
      `Использование команды: ${inlineCode(`${prefix}warn <userId> <comment>`)}`
    );
  }

  async exec(message, args) {
    const [member, ...commentArgs] = args;
    if (!member || !commentArgs || commentArgs.length === 0) {
      return this.dropIncorrectUseWarning(message);
    }

    const comment = commentArgs.join(' ').trim();

    const { guild } = message;

    const memberId = parser.getUserFromMention(member);
    if (!memberId) {
      return this.dropIncorrectUseWarning(message);
    }

    const guildMember = message.guild.members.cache.get(memberId);

    if (memberId === message.author.id) {
      return message.dropWarning(
        'Упс...',
        'Я запрещаю выдавать варны самому себе'
      );
    }

    const memberPosition = guildMember.roles.highest.position;
    const moderationPosition = message.member.roles.highest.position;
    if (
      message.member.ownerId !== message.author.id &&
      !(moderationPosition > memberPosition)
    ) {
      return message.dropWarning(
        'Упс...',
        'Похоже у вас недостаточно прав, чтобы выдать варн этому человеку'
      );
    }

    const membersDb = this.client.database.members;
    const guildsDb = this.client.database.guilds;

    const guildModel = guildsDb.getGuildOrCreate({ guildId: message.guildId });

    const memberModel = membersDb.getMemberOrCreate({
      memberId,
      guildId: message.guildId,
    });

    memberModel.warns.push({
      modId: message.member.id,
      modNickname: message.member.displayName,
      date: +new Date(),
      comment,
    });

    const strikeSize = this.client.config.moderation.warnPerStrike;
    const maxWarns = this.client.config.moderation.warnsForBan;

    membersDb.updateMemberModel({
      memberId,
      guildId: message.guildId,
      model: memberModel,
    });

    const banChannelId = guildModel.channels.banChannel;
    let banChannel;
    if (banChannelId) {
      banChannel = guild.channels.cache.get(banChannelId);
    }

    if (
      memberModel.warns.length + memberModel.strikes.length * strikeSize >=
      maxWarns
    ) {
      await guild.members.ban(memberId, {
        reason: 'Достижение лимита варнингов/страйков',
      });

      if (banChannel) {
        return message.dropBanMessage(
          banChannel,
          `<@${memberId}> Получил заслуженный бан по достижению лимита`
        );
      }
    } else if (banChannel) {
      return message.dropWarnMessage(
        banChannel,
        `<@${memberId}> Получил варн по причине: ${comment}`
      );
    }
  }
}

module.exports = Warn;
