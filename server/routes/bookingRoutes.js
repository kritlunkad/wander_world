const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').post(createBooking);
router.route('/my').get(getMyBookings);
router.route('/:id').get(getBookingById);

module.exports = router;
