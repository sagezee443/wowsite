import React, { useState, useEffect } from 'react'

export default function AdminPanel() {
  const [open, setOpen] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [title, setTitle] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [description, setDescription] = useState('')
  const [wowheadId, setWowheadId] = useState('')
  const [categories, setCategories] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('adminPass') || ''
    setAdminPass(saved)
  }, [])

  function savePass(p) {
    setAdminPass(p)
    localStorage.setItem('adminPass', p)
  }

  async function createVideo(e) {
    e.preventDefault()
    setMessage('Saving...')
    try {
      const body = {
        title,
        description,
        youtubeUrl,
        wowheadId,
        categories: categories ? categories.split(',').map(s => s.trim()).filter(Boolean) : []
      }
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPass || ''
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || res.statusText)
      }
      const json = await res.json()
      setMessage('Video created: ' + (json.title || json.id))
      // clear form
      setTitle('')
      setYoutubeUrl('')
      setDescription('')
      setWowheadId('')
      setCategories('')
    } catch (err) {
      console.error(err)
      setMessage('Error: ' + (err.message || 'failed'))
    } finally {
      setTimeout(() => setMessage(''), 3500)
    }
  }

  return (
    <>
      <button
        className="admin-toggle"
        aria-expanded={open}
        aria-controls="admin-panel"
        onClick={() => setOpen(!open)}
      >
        Admin
      </button>

      {open && (
        <div id="admin-panel" className="admin-panel" role="region" aria-label="Admin panel">
          <form onSubmit={createVideo}>
            <div className="form-row">
              <label htmlFor="admin-password">Admin password</label>
              <input
                id="admin-password"
                type="password"
                value={adminPass}
                onChange={(e) => savePass(e.target.value)}
                placeholder="Enter admin password"
                aria-required="true"
              />
            </div>

            <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
              <legend style={{ fontWeight: 600, marginBottom: 8 }}>Create video</legend>

              <div className="form-row">
                <label htmlFor="video-title">Title</label>
                <input
                  id="video-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Video title"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="video-youtube">YouTube URL</label>
                <input
                  id="video-youtube"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="video-description">Description</label>
                <textarea
                  id="video-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description (optional)"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <label htmlFor="video-wowhead">Wowhead ID</label>
                <input
                  id="video-wowhead"
                  value={wowheadId}
                  onChange={(e) => setWowheadId(e.target.value)}
                  placeholder="Numeric wowhead ID (optional)"
                />
              </div>

              <div className="form-row">
                <label htmlFor="video-categories">Categories (comma separated)</label>
                <input
                  id="video-categories"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Dungeons, Raids, PvP"
                />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <button type="submit" className="search-submit">Create video</button>
                <button type="button" onClick={() => { setTitle(''); setYoutubeUrl(''); setDescription(''); setWowheadId(''); setCategories(''); }} style={{ padding: '8px 10px' }}>Clear</button>
                {message && <div style={{ marginLeft: 8 }}>{message}</div>}
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </>
  )
}
