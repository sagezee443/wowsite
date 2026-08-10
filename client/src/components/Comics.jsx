import React, { useEffect, useState } from 'react'

export default function Comics() {
  const [comics, setComics] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      try{
        const res = await fetch('/api/comics')
        const json = await res.json()
        if (!mounted) return
        setComics(json)
        setIndex(0) // most recent first
      }catch(e){
        console.error(e)
      }finally{ if(mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])

  function prev(){
    setIndex(i => Math.min(comics.length-1, i+1))
  }
  function next(){
    setIndex(i => Math.max(0, i-1))
  }

  const current = comics[index]

  return (
    <div className="comic-page-root">
      <div className="comic-frame">
        {loading && <div className="loading">Loading…</div>}
        {!loading && !current && (
          <div className="placeholder">Coming soon!</div>
        )}
        {!loading && current && (
          <img className="comic-image" src={current.filename} alt={current.title || 'Comic page'} />
        )}

        <button className="nav prev" onClick={prev} aria-label="Previous page">◀</button>
        <button className="nav next" onClick={next} aria-label="Next page">▶</button>
      </div>
    </div>
  )
}
