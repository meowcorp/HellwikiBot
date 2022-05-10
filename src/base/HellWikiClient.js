const { Client, Collection, Intents } = require('discord.js');
const Members = require('../models/Members');
const Guilds = require('../models/Guilds');
const Logger = require('../helpers/logger');

class HellWikiClient extends Client {
  constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
      ],
      allowedMentions: {
        parse: ['users'],
      },
    });

    this.config = require('../../config');
    this.commands = new Collection();
    this.logger = new Logger();

    this.database = {};
    this.database.members = new Members(this);
    this.database.guilds = new Guilds(this);
  }

  addCommand(Command) {
    try {
      if (Command) {
        const cmd = new Command(this);
        this.commands.set(cmd.name, cmd);
      }
    } catch (e) {
      this.logger.warn(e);
    }
  }
}

module.exports = HellWikiClient;
