require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

app.use(cors());
app.use(bodyParser.json());

// Ensure public comics directory exists
const comicsDir = path.join(__dirname, 'public', 'comics');
fs.mkdirSync(comicsDir, { recursive: true });

// Serve public static files (including /upload)
app.use(express.static(path.join(__dirname, 'public')));

// Also serve comics at /comics
app.use('/comics', express.static(comicsDir));

// Initialize DB
(async () => {
  await db.init();
})();

// Admin middleware (simple header-based)
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-password'] || req.body.adminPassword || req.query.adminPassword || '';
  if (!ADMIN_PASSWORD || pass !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Video & categories API (existing)
app.get('/api/videos', async (req, res) => {
  try { const videos = await db.getAllVideos(); res.json(videos) } catch (e) { console.error(e); res.status(500).json({ error:'server error' }) }
});
app.get('/api/videos/:id', async (req, res) => { try { const v = await db.getVideo(req.params.id); if(!v) return res.status(404).json({error:'Not found'}); res.json(v) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });
app.get('/api/categories', async (req, res) => { try { const cats = await db.getAllCategories(); res.json(cats) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });

app.post('/api/videos', requireAdmin, async (req, res) => { try{ const video = await db.createVideo(req.body); res.json(video) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });
app.put('/api/videos/:id', requireAdmin, async (req, res) => { try{ const updated = await db.updateVideo(req.params.id, req.body); if(!updated) return res.status(404).json({error:'Not found'}); res.json(updated) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });
app.delete('/api/videos/:id', requireAdmin, async (req, res) => { try{ await db.deleteVideo(req.params.id); res.json({success:true}) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });
app.post('/api/categories', requireAdmin, async (req, res) => { try{ const c = await db.createCategory(req.body); res.json(c) } catch(e){console.error(e);res.status(500).json({error:'server error'})} });

// Comics API
app.get('/api/comics', async (req, res) => {
  try {
    const comics = await db.getAllComics()
    res.json(comics)
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }) }
})

// File upload handling with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, comicsDir)
  },
  filename: function (req, file, cb) {
    // prefix with timestamp to avoid collisions
    const ext = path.extname(file.originalname)
    const name = Date.now() + '-' + Math.random().toString(36).slice(2,8) + ext
    cb(null, name)
  }
})
const upload = multer({ storage })

app.post('/api/comics', upload.single('file'), requireAdmin, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const title = req.body.title || ''
    const filename = '/comics/' + req.file.filename
    const comic = await db.createComic({ title, filename })
    res.json(comic)
  } catch (e) { console.error(e); res.status(500).json({ error: 'server error' }) }
})

// Simple route to serve upload UI (upload.html is in server/public)
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'))
})

// Serve client in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
