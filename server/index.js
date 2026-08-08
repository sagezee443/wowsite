// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';

app.use(cors());
app.use(bodyParser.json());

// Initialize DB
(async ()=>{
  await db.init();
})();

// Public API
app.get('/api/videos', async (req, res) => {
  try{
    const videos = await db.getAllVideos();
    res.json(videos);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.get('/api/videos/:id', async (req, res) => {
  try{
    const row = await db.getVideo(req.params.id);
    if(!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.get('/api/categories', async (req, res) => {
  try{
    const cats = await db.getAllCategories();
    res.json(cats);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

// Admin middleware (simple header-based)
function requireAdmin(req, res, next) {
  const pass = req.headers['x-admin-password'] || '';
  if (!ADMIN_PASSWORD || pass !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// Admin endpoints
app.post('/api/videos', requireAdmin, async (req, res) => {
  try{
    const video = await db.createVideo(req.body);
    res.json(video);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.put('/api/videos/:id', requireAdmin, async (req, res) => {
  try{
    const updated = await db.updateVideo(req.params.id, req.body);
    if(!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.delete('/api/videos/:id', requireAdmin, async (req, res) => {
  try{
    await db.deleteVideo(req.params.id);
    res.json({ success: true });
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.post('/api/categories', requireAdmin, async (req, res) => {
  try{
    const c = await db.createCategory(req.body);
    res.json(c);
  }catch(e){ console.error(e); res.status(500).json({error:'server error'}) }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
