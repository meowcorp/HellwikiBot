const { Message, MessageEmbed } = require('discord.js');

Message.prototype.dropError = function (message) {
  const embed = new MessageEmbed();
  embed.setColor(this.client.config.colors.error);
  embed.setTitle('Произошла ошибка');
  embed.setDescription(message);

  this.channel.send({ embeds: [embed] });
};

Message.prototype.dropWarning = function (title, message) {
  const embed = new MessageEmbed();
  embed.setColor(this.client.config.colors.warning);
  embed.setTitle(title);
  embed.setDescription(message);

  this.channel.send({ embeds: [embed] });
};

Message.prototype.dropBanMessage = function (channel, message) {
  const embed = new MessageEmbed();
  embed.setColor(this.client.config.colors.error);
  embed.setTitle('Пользователь забанен');
  embed.setDescription(message);

  channel.send({ embeds: [embed] });
};

Message.prototype.dropWarnMessage = function (channel, message) {
  const embed = new MessageEmbed();
  embed.setColor(this.client.config.colors.warning);
  embed.setTitle('Пользователь получил варн');
  embed.setDescription(message);

  channel.send({ embeds: [embed] });
};
