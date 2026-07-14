# Oru Aka

**Oru Aka** (meaning **"Hand Work"** in Igbo) is a full-stack marketplace that connects customers with trusted local skilled professionals. Whether you're looking for an electrician, plumber, carpenter, tailor, painter, welder, AC technician, or other artisans, Oru Aka makes it easy to discover, connect with, and hire verified service providers.

Built with the **MERN** stack (MongoDB, Express.js, React, and Node.js), the project is organized into two independent applications:

- `server/` – REST API
- `client/` – React web application

This architecture allows both applications to be developed and deployed independently.

---

## 🚀 Quick Start

Open **two terminal windows**.

### Terminal 1 – Backend

```bash
cd server
npm install
cp .env.example .env

# Configure your environment variables
# (See server/README.md for setup instructions)

npm run seed
npm run dev
```

The API will be available at:

```
http://localhost:5000
```

### Terminal 2 – Frontend

```bash
cd client
npm install
cp .env.example .env

npm run dev
```

The web application will be available at:

```
http://localhost:5173
```

Once both servers are running, open the application in your browser to explore the seeded sample data.

---

## ✨ Features

- User registration and secure authentication
- Browse and search skilled professionals
- Filter workers by trade, location, experience, price, and availability
- Worker profiles with ratings, reviews, and portfolio images
- Worker dashboard for managing services and profile
- Admin dashboard for artisan verification
- Secure JWT authentication with refresh tokens
- Real-time messaging using Socket.io
- Direct contact through phone and WhatsApp
- Responsive design for desktop and mobile devices

---

## 🔑 Optional Integrations

The application works out of the box for local development. The following services can be added to unlock additional functionality.

| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database |
| Cloudinary | Image and portfolio uploads |
| Termii | SMS OTP verification |

Configuration details are provided in **`server/.env.example`**.

---

## 📁 Project Structure

```text
oru-aka/
├── client/      React (Vite)
└── server/      Express API
```

---

## 🚀 Deployment

Recommended deployment stack:

- **Frontend:** Vercel
- **Backend:** Render or Railway
- **Database:** MongoDB Atlas
- **Image Storage:** Cloudinary

Simply update your environment variables with production values before deploying.

---

## 🛣️ Roadmap

Future improvements include:

- Payment integration (Paystack/Flutterwave)
- Featured artisan listings
- React Native mobile application
- Job posting and bidding
- Expansion to more cities across Nigeria

---

## 👨‍💻 Author

**Toby Ishiwu**

- Portfolio: https://tobyishiwu.tech
- GitHub: https://github.com/Tobyishiwu

If you found this project interesting, consider giving it a ⭐.
