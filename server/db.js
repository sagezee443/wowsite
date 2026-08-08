const path = require('path')
const shortid = require('shortid')

let dbInstance = null
let Low, JSONFile

async function ensure() {
  if (dbInstance) return
  // dynamic import to support ESM-only versions of lowdb
  const lowdbMod = await import('lowdb')
  const lowdbNode = await import('lowdb/node')
  Low = lowdbMod.Low
  JSONFile = lowdbNode.JSONFile

  const file = path.join(__dirname, 'db.json')
  const adapter = new JSONFile(file)
  const db = new Low(adapter)
  await db.read()
  db.data = db.data || { videos: [], categories: [] }
  await db.write()
  dbInstance = db
}

async function getAllVideos() {
  await ensure()
  return (dbInstance.data.videos || []).slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
}
async function getVideo(id) {
  await ensure()
  return (dbInstance.data.videos || []).find(v => v.id === id) || null
}
async function createVideo({ title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }){
  await ensure()
  const id = shortid.generate()
  const createdAt = new Date().toISOString()
  const video = { id, title, description: description||'', youtubeUrl, thumbnailUrl: thumbnailUrl||'', wowheadId: wowheadId||'', categories: Array.isArray(categories)?categories:[], createdAt }
  dbInstance.data.videos.push(video)
  await dbInstance.write()
  return video
}
async function updateVideo(id, { title, description, youtubeUrl, thumbnailUrl, wowheadId, categories }){
  await ensure()
  const idx = (dbInstance.data.videos || []).findIndex(v => v.id === id)
  if (idx === -1) return null
  const existing = dbInstance.data.videos[idx]
  const updated = { ...existing,
    title: title ?? existing.title,
    description: description ?? existing.description,
    youtubeUrl: youtubeUrl ?? existing.youtubeUrl,
    thumbnailUrl: thumbnailUrl ?? existing.thumbnailUrl,
    wowheadId: wowheadId ?? existing.wowheadId,
    categories: Array.isArray(categories) ? categories : existing.categories
  }
  dbInstance.data.videos[idx] = updated
  await dbInstance.write()
  return updated
}
async function deleteVideo(id){
  await ensure()
  const before = dbInstance.data.videos.length
  dbInstance.data.videos = (dbInstance.data.videos || []).filter(v => v.id !== id)
  const changed = dbInstance.data.videos.length !== before
  if (changed) await dbInstance.write()
  return changed
}

async function getAllCategories(){
  await ensure()
  return dbInstance.data.categories || []
}
async function createCategory({ name, slug, description }){
  await ensure()
  const id = shortid.generate()
  const c = { id, name, slug, description: description||'' }
  dbInstance.data.categories.push(c)
  await dbInstance.write()
  return c
}

module.exports = {
  init: ensure,
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getAllCategories,
  createCategory
}
