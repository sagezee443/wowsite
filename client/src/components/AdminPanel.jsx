import React, { useState, useEffect } from 'react'
import { fetchVideos, fetchCategories, adminCreateVideo, adminCreateCategory, adminUpdateVideo, adminDeleteVideo } from '../api'

export default function AdminPanel(){
  const [open, setOpen] = useState(false)
  const [adminPass, setAdminPass] = useState(localStorage.getItem('adminPass')||'')
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({title:'',youtubeUrl:'',description:'',wowheadId:'',categories:[]})

  useEffect(()=>{ load() },[])
  function load(){ fetchVideos().then(setVideos); fetchCategories().then(setCategories) }

  async function handleCreate(){
    try {
      await adminCreateVideo(form, adminPass)
      setForm({title:'',youtubeUrl:'',description:'',wowheadId:'',categories:[]})
      load()
      alert('Created')
    } catch(e){ alert('Failed') }
  }
  function rememberPass(p){
    localStorage.setItem('adminPass', p)
    setAdminPass(p)
  }

  return (
    <>
      <button className="admin-toggle" onClick={()=>setOpen(v=>!v)}>{open ? 'Close Admin' : 'Admin'}</button>
      {open && (
        <div className="admin-panel">
          <h3>Admin</h3>
          <div className="form-row">
            <label>Admin Password</label>
            <input value={adminPass} onChange={e=>rememberPass(e.target.value)} placeholder="set ADMIN password"/>
          </div>

          <h4>Add video</h4>
          <div className="form-row"><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="form-row"><label>YouTube URL</label><input value={form.youtubeUrl} onChange={e=>setForm({...form,youtubeUrl:e.target.value})}/></div>
          <div className="form-row"><label>Description</label><textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea></div>
          <div className="form-row"><label>Wowhead ID (optional)</label><input value={form.wowheadId} onChange={e=>setForm({...form,wowheadId:e.target.value})}/></div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={handleCreate}>Create</button>
            <button onClick={()=>{setForm({title:'',youtubeUrl:'',description:'',wowheadId:'',categories:[]})}}>Reset</button>
          </div>

          <hr/>
          <h4>Existing Videos</h4>
          {videos.map(v=>(
            <div key={v.id} style={{padding:'8px 0',borderBottom:'1px solid #eee'}}>
              <strong>{v.title}</strong><br/>
              <small>{v.youtubeUrl}</small><br/>
              <button onClick={async ()=>{ if(confirm('Delete?')){ await adminDeleteVideo(v.id, adminPass); load() } }}>Delete</button>
            </div>
          ))}

        </div>
      )}
    </>
  )
}
