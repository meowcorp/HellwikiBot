const Enmap = require('enmap');

class Members extends Enmap {
  constructor(client) {
    super({
      name: 'members',
    });

    this.client = client;
    this.initFields = {
      warns: [],
      strikes: [],
      fandomUsername: null,
      authMethod: null,
      banned: false,
    };
  }

  getMemberOrCreate({ guildId, memberId }) {
    return this.ensure(`${guildId}-${memberId}`, this.initFields);
  }

  updateMemberModel({ guildId, memberId, model }) {
    return this.set(`${guildId}-${memberId}`, model);
  }
}

module.exports = Members;
