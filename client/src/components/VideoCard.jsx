import React from 'react'
import { Link } from 'react-router-dom'

function extractYoutubeId(url){
  try {
    const u = new URL(url);
    if(u.hostname.includes('youtube')) {
      if(u.searchParams.get('v')) return u.searchParams.get('v');
      const parts = u.pathname.split('/');
      return parts[parts.length-1];
    }
  } catch(e){}
  return null;
}

export default function VideoCard({video}){
  const ytId = extractYoutubeId(video.youtubeUrl);
  const thumb = video.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
  return (
    <div className="card">
      <Link to={`/video/${video.id}`}>
        <img src={thumb} alt={video.title} style={{width:'100%',borderRadius:6}} />
        <h3>{video.title}</h3>
      </Link>
      <p className="muted">{video.description?.slice(0,100)}</p>
    </div>
  )
}
