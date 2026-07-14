# Oru Aka

**"Oru Aka"** \u2014 hand work. Nigeria's marketplace for skilled trades:
electricians, plumbers, tailors, carpenters, AC technicians, painters,
welders, tilers, and more across Enugu, Lagos, and Abuja.

MERN stack (MongoDB, Express, React, Node). Built as two independent
projects \u2014 `server/` (API) and `client/` (web app) \u2014 so they can be deployed
separately.

## Quick start

You need two terminal windows.

**Terminal 1 \u2014 backend**
```bash
cd server
npm install
cp .env.example .env
# Open .env and set at minimum: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET
# (see server/README.md for exactly how to get each value)
npm run seed     # populates 12 sample workers + 3 clients + 1 admin
npm run dev      # http://localhost:5000
```

**Terminal 2 \u2014 frontend**
```bash
cd client
npm install
cp .env.example .env
npm run dev      # http://localhost:5173
```

Open `http://localhost:5173`. You should see the home page with sample
workers from the seed script.

**Try it out:**
- Browse workers without logging in: `/workers`
- Log in as a seeded worker: phone `+2348031234501`, password `password123`
  (Chidi Okeke, Electrician, Enugu) \u2014 see `server/src/scripts/seed.js` for
  the full list of 12 seeded accounts
- Log in as admin: phone `+2348000000000`, password `ChangeThisPassword123!`
  (or whatever you set in `ADMIN_PASSWORD`) \u2014 visit `/admin` to see the
  verification queue

## What's fully working out of the box

- Browsing, searching, and filtering workers (trade, location, price,
  experience, availability, verified-only)
- Worker profiles with photos, skills, reviews, ratings
- Signup/login, JWT auth with automatic token refresh
- Worker dashboard: create/edit listing, upload portfolio photos, submit ID
  for verification
- Admin verification queue: approve/reject worker IDs
- Real-time in-app chat (Socket.io) between clients and workers
- Reviews and ratings
- Direct contact via phone link and WhatsApp link on every profile

## What needs your API keys to fully activate

The app **runs completely without these** \u2014 it falls back to dev-friendly
behavior so you can build and test everything locally first.

| Feature | Without a key | With a key |
|---|---|---|
| Phone OTP verification | Code is printed to the **server console** instead of sent by SMS | Real SMS via Termii (`TERMII_API_KEY` in `server/.env`) |
| Photo / ID uploads | Returns a placeholder image | Real image hosting via Cloudinary (`CLOUDINARY_*` in `server/.env`) |
| MongoDB | Won't start without a real connection string | Free tier at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

Exact signup steps for each are documented inline in `server/.env.example`.

## What's intentionally not live yet (by design, not by accident)

**Boost payments.** Per the project scope, Oru Aka is free for workers to
list; boosting a listing to the top of search is the paid feature, planned
for v1.1. The schema (`Boost` model), pricing endpoint, dashboard UI, and
request flow are all built and working \u2014 a worker can "reserve" a boost
today \u2014 but no card is charged because Paystack/Flutterwave checkout isn't
wired in yet. When you're ready to turn this on, the integration point is
`server/src/controllers/boostController.js`.

## Project structure

```
oru-aka/
├── server/      Express API \u2014 see server/README.md
└── client/      React (Vite) web app \u2014 see client/README.md
```

## Deployment (when you're ready to go live)

Recommended free-tier-friendly stack for launch:
- **Database**: MongoDB Atlas (M0 free cluster)
- **Backend**: Render or Railway (both have free tiers suitable for launch
  traffic; deploy the `server/` folder, set the same env vars from
  `.env.example` in their dashboard)
- **Frontend**: Vercel or Netlify (deploy the `client/` folder, set
  `VITE_API_URL` to your deployed backend's URL)

None of these require code changes \u2014 just environment variables pointing
at production values instead of `localhost`.

## Roadmap after this v1

- Boost payment integration (Paystack/Flutterwave)
- Mobile app (React Native), reusing the same backend API
- Job-posting/bidding as an additional discovery mode alongside browse-and-contact
- Nationwide coverage beyond Enugu, Lagos, Abuja
