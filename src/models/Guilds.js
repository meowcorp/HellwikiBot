const Enmap = require('enmap');

class Guilds extends Enmap {
  constructor(client) {
    super({
      name: 'guilds',
    });

    this.client = client;
    this.initFields = {
      wikiId: null,
      accessRole: '973532816879005696',
      welcomeMessage: 'Добро пожаловать',
      channels: {
        welcomeChannel: null,
        moderateChannel: null,
        banChannel: '973621947445415986',
        reportsChannel: null,
      },
    };
  }

  getGuildOrCreate({ guildId }) {
    return this.ensure(guildId, this.initFields);
  }
}

module.exports = Guilds;
