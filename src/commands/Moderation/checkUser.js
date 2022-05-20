const { inlineCode, bold } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const parser = require('../../helpers/parser');
const Command = require('../../base/Command');

class CheckUser extends Command {
  constructor(props) {
    super(props);
    this.name = 'check_user';
    this.deleteAfterExec = false;
    this.accessByRole = true;
  }

  dropIncorrectUseWarning(message) {
    const prefix = this.client.config.botPrefix;

    return message.dropWarning(
      'Некорректные аргументы',
      `Использование команды: ${inlineCode(`${prefix}checkUser <userId>`)}`
    );
  }

  async exec(message, args) {
    const [member] = args;
    if (!member) {
      return this.dropIncorrectUseWarning(message);
    }

    const memberId = parser.getUserFromMention(member);
    if (!memberId) {
      return this.dropIncorrectUseWarning(message);
    }

    const guildMember = message.guild.members.cache.get(memberId);

    const membersDb = this.client.database.members;
    const memberModel = membersDb.getMemberOrCreate({
      memberId,
      guildId: message.guildId,
    });

    const embed = new MessageEmbed()
      .setThumbnail(guildMember.displayAvatarURL())
      .setTitle(`Карточка пользователя: ${guildMember.displayName}`);

    if (memberModel.warns.length === 0 && memberModel.strikes.length === 0) {
      embed.setDescription(
        'У данного пользователя отсутствуют варны и страйки'
      );
    } else {
      const warnsDescription = memberModel.warns.reduce(
        (acc, warn, index) =>
          `${acc}${index + 1}) ${bold(warn.comment)} (<@${warn.modId}>)\n`,
        ''
      );

      embed.addField('Варны:', warnsDescription);
    }

    message.channel.send({ embeds: [embed], allowedMentions: { parse: [] } });
  }
}

module.exports = CheckUser;
