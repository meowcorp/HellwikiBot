const { black, green } = require('chalk');
const moment = require('moment');

class Logger {
  _getFormattedTime() {
    return moment().format('LTS');
  }

  error(message) {
    return console.log(
      `[${this._getFormattedTime()}] ${black.bgRed('ERROR')} ${message}`
    );
  }

  warn(message) {
    return console.log(
      `[${this._getFormattedTime()}] ${black.bgYellow('WARN')} ${message}`
    );
  }

  debug(message) {
    return console.log(
      `[${this._getFormattedTime()}] ${green('DEBUG')} ${message}`
    );
  }
}

module.exports = Logger;
