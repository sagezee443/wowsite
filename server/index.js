// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

app.use(cors());
app.use(bodyParser.json());

// Helper functions
function run(stmt, params=[]) {
  return db.prepare(stmt).run(...params);
}
function get(stmt, params=[]) {
  return db.prepare(stmt).get(...params);
}
function all(stmt, params=[]) {
  return db.prepare(stmt).all(...params);
}

// Public API
app.get('/api/videos', (req, res) => {
  const rows = all('SELECT * FROM videos ORDER BY createdAt DESC');
  const videos = rows.map(r => ({ ...r, categories: r.categories ? JSON.parse(r.categories) : [] }));
  res.json(videos);
});

app.get('/api/videos/:id', (req, res) => {
  const row = get('SELECT * FROM videos WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ error: 'Not found' });
  row.categories = row.categories ? JSON.parse(row.categories) : [];
  res.json(row);
});

app.get('/api/categories', (req, res) => {
  const rows = all('SELECT * FROM categories ORDER BY name');
  res.json(rows);
});

// Admin middleware (simple header-based)
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-password'] || '';
  if (!ADMIN_PASSWORD || pass !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Admin endpoints
app.post('/api/videos', requireAdmin, (req, res) => {
  const { title, description, youtubeUrl, thumbnailUrl, wowheadId, categories } = req.body;
  const id = shortid.generate();
  const createdAt = new Date().toISOString();
  const cats = Array.isArray(categories) ? JSON.stringify(categories) : JSON.stringify([]);
  run('INSERT INTO videos (id,title,description,youtubeUrl,thumbnailUrl,wowheadId,categories,createdAt) VALUES (?,?,?,?,?,?,?,?)',
    [id, title, description||'', youtubeUrl, thumbnailUrl||'', wowheadId||'', cats, createdAt]);
  const video = get('SELECT * FROM videos WHERE id = ?', [id]);
  video.categories = JSON.parse(video.categories);
  res.json(video);
});

app.put('/api/videos/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const { title, description, youtubeUrl, thumbnailUrl, wowheadId, categories } = req.body;
  const cats = Array.isArray(categories) ? JSON.stringify(categories) : JSON.stringify([]);
  run('UPDATE videos SET title=?,description=?,youtubeUrl=?,thumbnailUrl=?,wowheadId=?,categories=? WHERE id=?',
    [title, description||'', youtubeUrl, thumbnailUrl||'', wowheadId||'', cats, id]);
  const video = get('SELECT * FROM videos WHERE id = ?', [id]);
  if (!video) return res.status(404).json({ error: 'Not found' });
  video.categories = JSON.parse(video.categories);
  res.json(video);
});

app.delete('/api/videos/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  run('DELETE FROM videos WHERE id = ?', [id]);
  res.json({ success: true });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { name, slug, description } = req.body;
  const id = shortid.generate();
  run('INSERT INTO categories (id,name,slug,description) VALUES (?,?,?,?)', [id, name, slug, description||'']);
  const c = get('SELECT * FROM categories WHERE id = ?', [id]);
  res.json(c);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
