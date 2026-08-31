const fs = require('node:fs');
const path = require('node:path');

const logDir = path.resolve('./logs');
fs.mkdirSync(logDir, { recursive: true });

function write(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const suffix = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const line = `[${timestamp}] [${level}] ${message}${suffix}`;
  console.log(line);
  fs.appendFileSync(path.join(logDir, 'bot.log'), `${line}\n`);
}

module.exports = {
  info: (message, meta) => write('INFO', message, meta),
  warn: (message, meta) => write('WARN', message, meta),
  error: (message, meta) => write('ERROR', message, meta),
  debug: (message, meta) => write('DEBUG', message, meta)
};
