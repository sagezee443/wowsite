# wowsite

React (Vite) frontend + Node/Express backend for a responsive video card inventory with YouTube embedding and Wowhead links.

Quick start (local):

1. Clone the repo:
   git clone https://github.com/sagezee443/wowsite.git
   cd wowsite

2. Server:
   cd server
   cp .env.example .env
   # edit .env to set ADMIN_PASSWORD (and optional PORT)
   npm install
   npm run start
   # server runs at http://localhost:4000 by default

3. Client (in new terminal):
   cd client
   npm install
   npm run dev
   # Vite dev server runs at http://localhost:5173 by default and proxies API to server

4. Use the Admin panel (top-right) to add videos (YouTube URLs). Videos are embedded, categories editable, and each video page includes a Wowhead link if provided.

Deployment notes:
- You can host the frontend (build output) to GitHub Pages or any static host.
- Host the server on Render/Heroku/Railway and set environment variable ADMIN_PASSWORD and allow DB persistence.
- If you prefer a combined deploy, tweak as needed.
