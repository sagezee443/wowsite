const fs = require('fs').promises
const path = require('path')
const shortid = require('shortid')

const DB_FILE = path.join(__dirname, 'db.json')

async function readData() {
  try {
    const txt = await fs.readFile(DB_FILE, 'utf8')
    return JSON.parse(txt)
  } catch (err) {
    if (err.code === 'ENOENT') return { videos: [], categories: [] }
    throw err
  }
}

async function writeData(data) {
  const tmp = DB_FILE + '.tmp'
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, DB_FILE)
}

async function init() {
  const data = await readData()
  if (!data.videos) data.videos = []
  if (!data.categories) data.categories = []
  await writeData(data)
}

async function getAllVideos() {
  const data = await readData()
  return (data.videos || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

async function getVideo(id) {
  const data = await readData()
  return (data.videos || []).find(v => v.id === id) || null
}

async function createVideo({ title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }) {
  const data = await readData()
  const id = shortid.generate()
  const createdAt = new Date().toISOString()
  const video = {
    id,
    title,
    description: description || '',
    youtubeUrl,
    thumbnailUrl: thumbnailUrl || '',
    wowheadId: wowheadId || '',
    categories: Array.isArray(categories) ? categories : [],
    createdAt
  }
  data.videos.push(video)
  await writeData(data)
  return video
}

async function updateVideo(id, { title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }) {
  const data = await readData()
  const idx = (data.videos || []).findIndex(v => v.id === id)
  if (idx === -1) return null
  const existing = data.videos[idx]
  const updated = {
    ...existing,
    title: title ?? existing.title,
    description: description ?? existing.description,
    youtubeUrl: youtubeUrl ?? existing.youtubeUrl,
    thumbnailUrl: thumbnailUrl ?? existing.thumbnailUrl,
    wowheadId: wowheadId ?? existing.wowheadId,
    categories: Array.isArray(categories) ? categories : existing.categories
  }
  data.videos[idx] = updated
  await writeData(data)
  return updated
}

async function deleteVideo(id) {
  const data = await readData()
  const before = data.videos.length
  data.videos = (data.videos || []).filter(v => v.id !== id)
  const changed = data.videos.length !== before
  if (changed) await writeData(data)
  return changed
}

async function getAllCategories() {
  const data = await readData()
  return data.categories || []
}

async function createCategory({ name, slug, description }) {
  const data = await readData()
  const id = shortid.generate()
  const c = { id, name, slug, description: description || '' }
  data.categories.push(c)
  await writeData(data)
  return c
}

module.exports = {
  init,
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getAllCategories,
  createCategory
}