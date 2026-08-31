const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

function createDatabase(databasePath) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      user_id TEXT PRIMARY KEY,
      channel_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'open',
      claimed_by TEXT,
      created_at INTEGER NOT NULL,
      closed_at INTEGER
    );
  `);

  return {
    getByUser: db.prepare('SELECT * FROM tickets WHERE user_id = ?'),
    getByChannel: db.prepare('SELECT * FROM tickets WHERE channel_id = ?'),
    create: db.prepare('INSERT INTO tickets (user_id, channel_id, status, created_at) VALUES (?, ?, \'open\', ?)'),
    claim: db.prepare('UPDATE tickets SET claimed_by = ? WHERE user_id = ?'),
    close: db.prepare('UPDATE tickets SET status = \'closed\', closed_at = ? WHERE user_id = ?'),
    reopen: db.prepare('UPDATE tickets SET status = \'open\', closed_at = NULL WHERE user_id = ?'),
    remove: db.prepare('DELETE FROM tickets WHERE user_id = ?')
  };
}

module.exports = { createDatabase };
