# Wander World 🌍✈️

Wander World is a full-stack tourism package booking web application built across a collaborative 6-day sprint.

---

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend** *(Day 2)*: Vite React, Axios
- **Styling**: *(To be decided by H on Day 2)*

---

## Project Structure
```
wander_world/
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   └── packageController.js # Route handler logic
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error & 404 handler
│   ├── models/
│   │   └── Package.js          # Mongoose Package schema & model
│   ├── routes/
│   │   └── packageRoutes.js    # Express route definitions
│   ├── .env.example            # Backend env template
│   ├── package.json            # Server dependencies & scripts
│   ├── seed.js                 # Database seeding script (8 packages)
│   └── server.js               # Server entrypoint
├── .env.example                # Root environment template
├── .gitignore                  # Git ignore rules (.env, node_modules, .rtf)
├── HANDOFF.md                  # Team progress log & handoff notes
└── README.md                   # Project documentation
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Environment Setup
Create a `.env` file inside the `server/` directory:
```bash
cp server/.env.example server/.env
```
Default configuration:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/wander_world
CLIENT_URL=http://localhost:5173
```
*(Note: Port 5001 is used by default because macOS reserves port 5000 for AirPlay Receiver).*

### 3. Install Server Dependencies
```bash
cd server
npm install
```

### 4. Seed the Database
Populate the database with 8 tourism packages:
```bash
npm run seed
```

### 5. Start the Server
- Development mode (with auto-restart via nodemon):
  ```bash
  npm run dev
  ```
- Production mode:
  ```bash
  npm start
  ```

---

## API Endpoints (Day 1)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| `GET`  | `/api/health` | Health check & server status | None |
| `GET`  | `/api/packages` | Fetch all packages | `?destination=`, `?maxPrice=` |
| `GET`  | `/api/packages/:id` | Fetch single package details | None |

### Standard Response Format
- **Success**:
  ```json
  {
    "success": true,
    "count": 8,
    "data": [ ... ]
  }
  ```
- **Error**:
  ```json
  {
    "success": false,
    "message": "Resource not found with the specified ID"
  }
  ```

---

## Sprint Roadmap (6-Day Plan)
- **Day 1 (K)**: Base server, Mongo connection, Package model, seed script, package endpoints.
- **Day 2 (H)**: Vite React app, router, Navbar/Footer, Package list & detail pages.
- **Day 3 (A)**: Auth (User, JWT, bcrypt), booking model & endpoints.
- **Day 4 (K)**: Auth UI, ProtectedRoute, Booking form & My Bookings.
- **Day 5 (H)**: Admin package management (CRUD), search and filter.
- **Day 6 (A)**: Responsive UI, 404 page, polish, deployment (Atlas, Render/Railway, Vercel/Netlify).
