import React, { useState, useRef, useEffect } from 'react'

const EXAMPLE_CATEGORIES = [
  'Dungeons',
  'Raids',
  'PvP',
  'Professions',
  'Goldmaking',
  'Transmog'
]

export default function HeaderSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const containerRef = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  function handleSelect(cat) {
    setSelectedCategory(cat)
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // currently just logs — replace with actual search/navigation as needed
    console.log('Search:', { query, selectedCategory })
    // Example: navigate to search page or filter results
  }

  return (
    <div className="global-search-container" ref={containerRef}>
      <form className="search-form" onSubmit={handleSubmit} role="search" aria-label="Search videos">
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a video, or select a category"
          aria-label="Search videos"
        />
        <div className="category-wrapper">
          <button
            type="button"
            className="category-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {selectedCategory} ▾
          </button>
          {open && (
            <ul className="dropdown-list" role="listbox" aria-label="Example categories">
              <li key="all" className="dropdown-item" onClick={() => handleSelect('All Categories')}>All Categories</li>
              {EXAMPLE_CATEGORIES.map((c) => (
                <li key={c} className="dropdown-item" onClick={() => handleSelect(c)}>{c}</li>
              ))}
            </ul>
          )}
        </div>
        <button className="search-submit" type="submit">Search</button>
      </form>
    </div>
  )
}
