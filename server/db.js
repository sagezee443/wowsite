// server/db.js
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'db.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtubeUrl TEXT NOT NULL,
  thumbnailUrl TEXT,
  wowheadId TEXT,
  categories TEXT, -- JSON array of category ids
  createdAt TEXT
);
`);

module.exports = db;
