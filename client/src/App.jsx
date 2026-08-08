import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import HeaderSearch from './components/HeaderSearch'

export default function App() {
  return (
    <div className="app">
      <header className="hero-header" role="banner" aria-label="Site header">
        <div className="hero-top">
          <Link to="/" className="hero-brand-link" aria-label="Home">
            <span className="hero-brand">Chadaver TV</span>
          </Link>
          <AdminPanel />
        </div>

        <div className="hero-content">
          <h2 className="hero-eyebrow">Weekly WoW Content</h2>
          <h1 className="hero-title">PvP + PvE Uploads</h1>
          <p className="hero-sub">New Videos Every Week</p>
        </div>
      </header>

      {/* Search bar that appears on all pages, centered below header */}
      <HeaderSearch />

      <main className="container">
        <Outlet />
      </main>
      <footer className="site-footer">© Chadaver Wow Guides</footer>
    </div>
  )
}
