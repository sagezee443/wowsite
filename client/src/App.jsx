import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import HeaderSearch from './components/HeaderSearch'
import Comics from './components/Comics'

export default function App() {
  return (
    <div className="app">
      <header className="hero-header" role="banner" aria-label="Site header">
        <div className="hero-top">
          <Link to="/" className="hero-brand-link" aria-label="Home">
            <span className="hero-brand">The Adventures of:</span>
          </Link>
          <AdminPanel />
        </div>

        <div className="hero-content" style={{textAlign:'center',width:'100%'}}>
          <div className="hero-eyebrow">The Adventures of:</div>
          <div className="hero-title">CHAD</div>
        </div>
      </header>

      {/* Search bar that appears on all pages, centered below header */}
      <HeaderSearch />

      <main className="container">
        <Comics />
      </main>
      <footer className="site-footer" style={{textAlign:'center',padding:'18px 0'}}>© Chadaver Webcomics</footer>
    </div>
  )
}
