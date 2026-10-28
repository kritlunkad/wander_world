# Wander World 

Wander World is a full-stack tourism package booking web application built across a collaborative 6-day sprint.

---

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend** *(Day 2)*: Vite React (React 19), React Router DOM (v7), Axios, Lucide React
- **Styling**: Vanilla CSS Design System (Glassmorphism, dark aesthetic, responsive design)

---

## Project Structure
```
wander_world/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.jsx # Route protection (user & adminOnly)
│   │   │   │   └── StatusStates.jsx  # Loading & error status components
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx        # App footer
│   │   │   │   ├── Layout.jsx        # Root layout with header/outlet/footer
│   │   │   │   └── Navbar.jsx        # Navigation bar with role-based links
│   │   │   └── packages/
│   │   │       └── PackageCard.jsx   # Tour package card item
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication & user state context
│   │   ├── pages/
│   │   │   ├── AdminPackages.jsx     # Admin package management (Add, Edit, Delete)
│   │   │   ├── Home.jsx              # Landing page with hero & featured packages
│   │   │   ├── Login.jsx             # User login
│   │   │   ├── MyBookings.jsx        # User booked tours
│   │   │   ├── NotFound.jsx          # 404 page
│   │   │   ├── PackageDetail.jsx     # Full itinerary & detail view with booking sidebar
│   │   │   ├── Packages.jsx          # Catalog with destination & maxPrice search/filter
│   │   │   └── Register.jsx          # User registration
│   │   ├── services/
│   │   │   ├── api.js                # Configured Axios instance (VITE_API_URL + Auth interceptors)
│   │   │   ├── authService.js        # Auth API endpoints (login, register, me)
│   │   │   ├── bookingService.js     # Booking API endpoints
│   │   │   └── packageService.js     # API handlers for packages (List, Detail, Create, Update, Delete)
│   │   ├── App.jsx                   # Route declarations & ProtectedRoute wrappers
│   │   ├── index.css                 # Global styles & design system tokens
│   │   └── main.jsx                  # React entry point with BrowserRouter
│   ├── .env.example                  # Frontend env template
│   ├── index.html                    # HTML document entrypoint
│   ├── package.json                  # Client dependencies & scripts
│   └── vite.config.js                # Vite configuration
├── server/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # User registration, login, profile logic
│   │   ├── bookingController.js      # Booking creation & retrieval logic
│   │   └── packageController.js       # Package CRUD & query logic
│   ├── middleware/
│   │   ├── auth.js                   # protect & isAdmin middlewares
│   │   └── errorHandler.js           # Centralized error & 404 handler
│   ├── models/
│   │   ├── Booking.js                # Mongoose Booking schema & model
│   │   ├── Package.js                # Mongoose Package schema & model
│   │   └── User.js                   # Mongoose User schema with bcrypt & roles
│   ├── routes/
│   │   ├── authRoutes.js             # Express auth routes
│   │   ├── bookingRoutes.js          # Express booking routes
│   │   └── packageRoutes.js          # Express package routes (public & admin CRUD)
│   ├── .env.example                  # Backend env template
│   ├── package.json                  # Server dependencies & scripts
│   ├── seed.js                       # Database seeding script (8 packages)
│   └── server.js                     # Server entrypoint
├── .env.example                      # Root environment template
├── .gitignore                        # Git ignore rules (.env, node_modules, etc.)
├── HANDOFF.md                        # Team progress log & handoff notes
└── README.md                         # Project documentation
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Environment Setup

#### Server Environment
Create a `.env` file inside the `server/` directory:
```bash
cp server/.env.example server/.env
```
Default server configuration:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/wander_world
CLIENT_URL=http://localhost:5173
JWT_SECRET=wander_world_jwt_secret_dev_key
```
*(Note: Port 5001 is used by default because macOS reserves port 5000 for AirPlay Receiver).*

#### Client Environment
Create a `.env` file inside the `client/` directory:
```bash
cp client/.env.example client/.env
```
Default client configuration:
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Seed the Database
Populate the database with 8 tourism packages:
```bash
cd server
npm run seed
```

### 5. Run the Application

#### Start the Server (Terminal 1)
```bash
cd server
npm run dev
```

#### Start the Client (Terminal 2)
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

### Packages
| Method | Endpoint | Description | Auth / Role | Query Params |
|--------|----------|-------------|-------------|--------------|
| `GET`  | `/api/packages` | Fetch all packages | Public | `?destination=`, `?maxPrice=` |
| `GET`  | `/api/packages/:id` | Fetch single package details | Public | None |
| `POST` | `/api/packages` | Create a new package | `Private / Admin` (`isAdmin`) | None |
| `PUT`  | `/api/packages/:id` | Update an existing package | `Private / Admin` (`isAdmin`) | None |
| `DELETE` | `/api/packages/:id` | Delete a package | `Private / Admin` (`isAdmin`) | None |

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET`  | `/api/auth/me` | Get current authenticated user | `Private` |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/bookings` | Create a new booking for a package | `Private` |
| `GET`  | `/api/bookings/my` | Retrieve bookings for logged-in user | `Private` |

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
- [x] **Day 1 (K)**: Base server, Mongo connection, Package model, seed script, package endpoints.
- [x] **Day 2 (H)**: Vite React app, router, Navbar/Footer, Package list & detail pages (real API integration, loading & error states).
- [x] **Day 3 (A)**: Auth (User, JWT, bcrypt), booking model & endpoints.
- [x] **Day 4 (K)**: Auth UI, ProtectedRoute, Booking form & My Bookings.
- [x] **Day 5 (H)**: Admin package management (CRUD: POST/PUT/DELETE, modal form, table), search and filter by destination and maxPrice (`?destination=&maxPrice=`).
- [x] **Day 6 (A)**: Responsive UI (mobile hamburger nav), 404 page, UI polish (hero badge, footer cleanup), deployment-ready.
