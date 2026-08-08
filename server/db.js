// server/db.js
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')
const shortid = require('shortid')

const file = path.join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

async function init() {
  await db.read()
  db.data = db.data || { videos: [], categories: [] }
  await db.write()
}

async function getAllVideos() {
  await db.read()
  // return newest first
  return (db.data.videos || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
}
async function getVideo(id) {
  await db.read()
  return (db.data.videos || []).find(v => v.id === id) || null
}
async function createVideo({ title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }){
  await db.read()
  const id = shortid.generate()
  const createdAt = new Date().toISOString()
  const video = { id, title, description: description||'', youtubeUrl, thumbnailUrl: thumbnailUrl||'', wowheadId: wowheadId||'', categories: Array.isArray(categories)?categories:[], createdAt }
  db.data.videos.push(video)
  await db.write()
  return video
}
async function updateVideo(id, { title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }){
  await db.read()
  const idx = (db.data.videos || []).findIndex(v => v.id === id)
  if (idx === -1) return null
  const existing = db.data.videos[idx]
  const updated = { ...existing,
    title: title ?? existing.title,
    description: description ?? existing.description,
    youtubeUrl: youtubeUrl ?? existing.youtubeUrl,
    thumbnailUrl: thumbnailUrl ?? existing.thumbnailUrl,
    wowheadId: wowheadId ?? existing.wowheadId,
    categories: Array.isArray(categories) ? categories : existing.categories
  }
  db.data.videos[idx] = updated
  await db.write()
  return updated
}
async function deleteVideo(id){
  await db.read()
  const before = db.data.videos.length
  db.data.videos = (db.data.videos || []).filter(v => v.id !== id)
  const changed = db.data.videos.length !== before
  if (changed) await db.write()
  return changed
}

async function getAllCategories(){
  await db.read()
  return db.data.categories || []
}
async function createCategory({ name, slug, description }){
  await db.read()
  const id = shortid.generate()
  const c = { id, name, slug, description: description||'' }
  db.data.categories.push(c)
  await db.write()
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
