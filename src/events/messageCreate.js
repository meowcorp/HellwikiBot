const { inlineCode } = require('@discordjs/builders');

class MessageCreate {
  constructor(client) {
    this.client = client;
  }

  async exec(message) {
    if (message.author.bot) return;

    if (
      !message.content.match(new RegExp(`^${this.client.config.botPrefix}`))
    ) {
      return;
    }

    if (message.guild && !message.member) {
      await message.guild.members.fetch(message.author.id);
    }

    const args = message.content
      .slice(this.client.config.botPrefix)
      .trim()
      .split(/ +/g);
    const cmdName = args
      .shift()
      .toLowerCase()
      .replace(this.client.config.botPrefix, '');

    const cmd = this.client.commands.get(cmdName);
    if (!cmd) return;

    const commandPermissions = cmd.permissions;
    let missingPermissions = [];

    if (message.guild) {
      commandPermissions.forEach((perm) => {
        if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
          missingPermissions.push(perm);
        }
      });
    }

    if (missingPermissions.length > 0) {
      return message.dropError(
        `У бота нет разрешений: ${inlineCode(missingPermissions.join(', '))}`
      );
    }

    missingPermissions = [];
    commandPermissions.forEach((perm) => {
      if (!message.channel.permissionsFor(message.author).has(perm)) {
        missingPermissions.push(perm);
      }
    });

    if (missingPermissions.length > 0) {
      return message.dropError(
        `У вас нет разрешений: ${inlineCode(missingPermissions.join(', '))}`
      );
    }

    if (cmd.accessByRole) {
      const guild = this.client.database.guilds.getGuildOrCreate({
        guildId: message.guildId,
      });

      const roleId = guild.accessRole;
      const guildRole = message.member.roles.cache.get(roleId);
      if (!guildRole) return;
    }

    try {
      cmd.exec(message, args);
      if (cmd.deleteAfterExec) {
        message.delete();
      }
    } catch (e) {
      this.client.logger.error(e.message);
      return message.dropError(`Ошибка: ${inlineCode(e.message)}`);
    }
  }
}

module.exports = MessageCreate;
