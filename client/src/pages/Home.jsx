import React, { useEffect, useState } from 'react'
import { fetchVideos } from '../api'
import VideoCard from '../components/VideoCard'

export default function Home(){
  const [videos, setVideos] = useState([])
  useEffect(()=>{ fetchVideos().then(setVideos) },[])
  return (
    <div>
      <h2>All Videos</h2>
      <div className="card-grid">
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  )
}
