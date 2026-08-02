# Full-Stack-Estate-App

A simple full-stack real-estate demo app with separate Buyer and Seller clients and a Node.js/Express backend.

## Contents

- Server: backend API and database integration
- Client: static frontend (Buyer and Seller sections)

## Features

- Buyer and Seller signup / signin flows
- Add, search, list, and delete properties
- Messaging/chat utility between users
- Cloudinary image uploads

## Tech

- Backend: Node.js, Express
- Database: PostgreSQL (or configured DB in `Server/database`)
- Frontend: static HTML, CSS, and vanilla JS
- Image uploads: Cloudinary

## Quickstart

Prerequisites: Node.js, npm, a MongoDB database, and a PostgreSQL instance.

1. Install server deps

```bash
cd Server
npm install
```

2. Environment

Copy `Server/.env.example` to `Server/.env` and fill in real values. Required keys:

- `MONGO_URI` — MongoDB connection string (users + properties)
- `DATABASE_URL` — PostgreSQL connection string (chat messages)
- `JWT_SECRET_BUYER`, `JWT_SECRET_SELLER` — session signing secrets
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Optional: `PORT`, `NODE_ENV`, `SESSION_MAX_AGE_MS`, `CORS_ORIGINS`

`.env` is git-ignored — never commit it.

3. Start the backend

```bash
cd Server
npm start
# or: node app.js
```

4. Serve or open the client

- Open `Client/index.html` in the browser, or serve the `Client` folder with a static server.

## Project structure

```
Client/                      static frontend (buyer/ and seller/ views)
Server/
  app.js                     express app + startup
  config/                    env (validated), cloudinary, cookie helpers
  db/                        mongo + postgres connections
  models/                    mongoose models (buyer, seller, property)
  controllers/               request handlers per domain
  routes/                    buyer.routes.js, seller.routes.js
  middleware/                auth, upload, validation, error handler
  socket/                    Socket.IO chat handling
  utils/                     asyncHandler
```

## API overview

Public: `POST /{buyer,seller}/Login`, `/signup`, `/logout`.
Authenticated (cookie session required — returns `401` if missing/expired):
`/{buyer,seller}/dashboard/property/*` and `/buyer/dashboard/message/get`.

## Notes

- Users and properties live in MongoDB; chat messages live in PostgreSQL.
- See `Server/.env.example` for all environment keys.

---
Generated/updated by development helper.