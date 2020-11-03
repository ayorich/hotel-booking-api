const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const { SUPER_ADMIN, ADMIN } = require('../constants/roles');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:hotelId/room/:roomId',
    bookingController.getCheckoutSession);

router.use(authController.restrictTo(ADMIN, SUPER_ADMIN));

router
    .route('/')
    .get(bookingController.getAllBooking)
    .post(bookingController.createBooking);

router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
