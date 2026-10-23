const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env, fallback to root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // Fallback if launched from root

// Ensure JWT_SECRET fallback in local development
process.env.JWT_SECRET = process.env.JWT_SECRET || 'wander_world_jwt_secret_dev_key';

const connectDB = require('./config/db');
const packageRoutes = require('./routes/packageRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'wander-world-api',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Mount Resource Routes
app.use('/api/packages', packageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
