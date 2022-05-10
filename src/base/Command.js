class Command {
  constructor(client) {
    this.client = client;
    this.name = '';
    this.deleteAfterExec = false;
    this.accessByRole = false;
    this.bindedGuild = null;
    this.permissions = [];
  }
}

module.exports = Command;
