# Oru Aka \u2014 Web Client

React (Vite) frontend for Oru Aka.

## Setup

```bash
cd client
npm install
cp .env.example .env
```

By default `.env` points at `http://localhost:5000/api`, which matches the
backend's default port. Change `VITE_API_URL` if your backend runs elsewhere
(e.g. once deployed).

## Run

```bash
npm run dev      # starts on http://localhost:5173
```

Make sure the backend (`server/`) is running first \u2014 see `server/README.md`.

## Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally to sanity-check it
```

## What's where

| Path | Purpose |
|---|---|
| `src/pages` | Top-level routed pages (Home, Browse, Worker Profile, Auth, Messages, Profile) |
| `src/components/home` | Home page sections (Hero, Categories, Featured Workers, CTA) |
| `src/components/workers` | Worker card, filters sidebar, reviews |
| `src/components/dashboard` | Worker dashboard (edit listing, photos, verification, boost) |
| `src/components/admin` | Admin verification queue and stats |
| `src/components/layout` | Navbar, Footer, route guards, dashboard/admin shells |
| `src/components/ui` | Shared primitives (Button, Fields, Badges, AdireDivider) |
| `src/context` | Auth and Socket.io React contexts |
| `src/api` | All backend API calls, grouped by domain |
| `src/utils` | Formatting helpers, trade-to-icon mapping |

## Design system

- **Colors**: indigo (primary/brand), brass (accent/CTA/boost), rust (alerts),
  bone/linen (backgrounds), verified-green (trust signals only).
- **Type**: Fraunces (display/headings), Work Sans (body), IBM Plex Mono
  (prices, stats, any numeric data).
- **Signature element**: `AdireDivider` \u2014 a thin repeating diamond pattern
  referencing Nigerian adire/aso-oke textiles, used sparingly as a section
  divider (see `src/components/ui/AdireDivider.jsx` and the `.adire-divider`
  class in `index.css`).

All tokens live in `tailwind.config.js`.
