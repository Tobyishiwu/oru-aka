# Oru Aka API

Express + MongoDB backend for Oru Aka \u2014 Nigeria's marketplace for skilled trades.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in at minimum:

- `MONGO_URI` \u2014 a MongoDB connection string. Easiest path: create a free account at
  https://www.mongodb.com/cloud/atlas, create an M0 cluster, add a database user,
  allow access from your IP (or `0.0.0.0/0` for local dev), then copy the connection
  string from the "Connect" button.
- `JWT_SECRET` and `JWT_REFRESH_SECRET` \u2014 any long random strings. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

Everything else (`TERMII_API_KEY`, `CLOUDINARY_*`) can be left blank for local
development \u2014 the app falls back to a dev mode that logs OTP codes to the
console and uses placeholder images instead of failing.

## Run

```bash
npm run dev      # starts on http://localhost:5000 with auto-reload
```

## Seed sample data

Populates 12 realistic worker profiles across Enugu, Lagos, and Abuja, 3 client
accounts, and 1 admin account.

```bash
npm run seed
```

After seeding:
- Admin login: phone `+2348000000000`, password from `ADMIN_PASSWORD` in `.env`
  (defaults to `ChangeThisPassword123!`)
- All seeded worker/client accounts use password `password123`

## API overview

| Area | Base path |
|---|---|
| Auth (signup, OTP, login) | `/api/auth` |
| User profile/avatar | `/api/users` |
| Worker profiles & search | `/api/workers` |
| Reviews | `/api/workers/:workerId/reviews` |
| Chat (REST + Socket.io) | `/api/chat` |
| Admin verification queue | `/api/admin` |
| Boost (schema-ready, payment in v1.1) | `/api/boosts` |
| Reference data (trades, states) | `/api/meta` |

Health check: `GET /api/health`

## Real-time chat

Socket.io is mounted on the same HTTP server. Clients connect with:

```js
const socket = io("http://localhost:5000", { auth: { token: accessToken } });
```

See `src/sockets/chatSocket.js` for the full event contract.
