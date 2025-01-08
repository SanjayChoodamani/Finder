// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protectUser, protectProvider } = require('../middleware/authMiddleware');

router.post('/create', protectUser, bookingController.createBooking);
router.get('/', protectProvider, bookingController.getAllBookings);
router.get('/:id', protectUser, bookingController.getBookingById);
router.put('/:id/status', protectProvider, bookingController.updateBookingStatus);
router.delete('/:id', protectUser, bookingController.deleteBooking);

module.exports = router;