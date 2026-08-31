const { resolve } = require('node:path');

const emojiIds = {
  modmail: process.env.EMOJI_MODMAIL_ID,
  reply: process.env.EMOJI_REPLY_ID,
  claim: process.env.EMOJI_CLAIM_ID,
  close: process.env.EMOJI_CLOSE_ID,
  reopen: process.env.EMOJI_REOPEN_ID
};

function applicationEmoji(name) {
  const id = emojiIds[name];
  if (!id) return null;
  return { id, name };
}

function assetPath(name) {
  return resolve(`assets/emojis/${name}.png`);
}

module.exports = { applicationEmoji, assetPath };
