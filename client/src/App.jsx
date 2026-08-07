import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <Link to="/"><h1>wowsite</h1></Link>
        <AdminPanel />
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="site-footer">© wowsite</footer>
    </div>
  )
}
