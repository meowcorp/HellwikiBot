require('dotenv').config();
require('./src/helpers/extenders');

const Sentry = require('@sentry/node');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const chalk = require('chalk');
const config = require('./config');

if (config.isSentryEnabled) {
  try {
    Sentry.init({
      dsn: process.env.DSN,
    });
  } catch (e) {
    console.log(e);
    console.log(
      chalk.yellow('Failed to connect to Sentry. Check if the DSN is correct')
    );
  }
}

const HellWikiClient = require('./src/base/HellWikiClient');

const client = new HellWikiClient();

const init = async () => {
  const directories = await readdir('./src/commands/');

  for (const dir of directories) {
    const commands = await readdir(`./src/commands/${dir}/`);
    commands
      .filter((cmd) => cmd.split('.').pop() === 'js')
      .forEach((cmdName) => {
        const command = require(`./src/commands/${dir}/${cmdName}`);
        client.addCommand(command);
      });
  }

  const evtFiles = await readdir('./src/events/');

  for (const file of evtFiles) {
    const eventName = file.split('.')[0];
    const event = new (require(`./src/events/${file}`))(client);
    client.on(eventName, (...args) => event.exec(...args));
    delete require.cache[require.resolve(`./src/events/${file}`)];
  }

  await client.login(process.env.ACCESS_TOKEN);
};

init().catch((error) => client.logger.error(error.message));

client
  .on('disconnect', () => client.logger.warn('Bot is disconnecting'))
  .on('reconnecting', () => client.logger.warn('Bot reconnecting'))
  .on('error', (e) => client.logger.error(e))
  .on('warn', (info) => client.logger.warn(info));

process.on('unhandledRejection', (err) => {
  console.error(err);
});
