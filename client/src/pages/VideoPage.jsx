import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchVideo } from '../api'

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

export default function VideoPage(){
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  useEffect(()=>{ fetchVideo(id).then(setVideo) },[id]);
  if(!video) return <div>Loading…</div>;
  const ytId = extractYoutubeId(video.youtubeUrl);
  const wowheadLink = video.wowheadId ? `https://www.wowhead.com/item=${video.wowheadId}` : null;
  return (
    <div>
      <div className="video-layout">
        <div className="player">
          {ytId ? (
            <iframe
              title={video.title}
              width="100%"
              height="480"
              src={`https://www.youtube.com/embed/${ytId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : <p>Invalid YouTube URL</p>}
        </div>
        <aside className="info">
          <h2>{video.title}</h2>
          <div className="meta">{new Date(video.createdAt).toLocaleString()}</div>
          <p>{video.description}</p>
          {wowheadLink && <p><a href={wowheadLink} target="_blank" rel="noreferrer">Open on Wowhead</a></p>}
          {video.categories?.length > 0 && <p>Categories: {video.categories.join(', ')}</p>}
        </aside>
      </div>
    </div>
  )
}
