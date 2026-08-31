const path = require('node:path');

const required = [
  'DISCORD_TOKEN',
  'CLIENT_ID',
  'GUILD_ID',
  'MODMAIL_CATEGORY_ID',
  'STAFF_ROLE_ID'
];

for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
}

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  modmailCategoryId: process.env.MODMAIL_CATEGORY_ID,
  logChannelId: process.env.LOG_CHANNEL_ID || null,
  staffRoleId: process.env.STAFF_ROLE_ID,
  databasePath: path.resolve(process.env.DATABASE_PATH || './data/modmail.db')
};
