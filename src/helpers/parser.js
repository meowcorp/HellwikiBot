const {
  MessageMentions: { USERS_PATTERN },
} = require('discord.js');

module.exports = {
  getUserFromMention(mention) {
    const matches = mention.matchAll(USERS_PATTERN).next().value;
    if (!matches) return;
    return matches[1];
  },
};
