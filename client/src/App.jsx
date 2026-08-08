import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import HeaderSearch from './components/HeaderSearch'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <h1 className="site-title">Chadaver Wow Guides</h1>
        </Link>
        <AdminPanel />
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
