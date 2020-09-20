const express = require('express');
const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', hotelController.checkgID);

router
  .route('/top-5-cheap')
  .get(hotelController.alaisTopHotels, hotelController.getAllHotels);

router.route('/hotel-stats').get(hotelController.getHotelStats);

router
  .route('/')
  .get(authController.protect, hotelController.getAllHotels)
  .post(hotelController.createHotel);

router
  .route('/:id')
  .get(hotelController.getHotel)
  .patch(hotelController.updateHotel)
  .delete(authController.protect, authController.restrictTo('admin', 'sub-admin'), hotelController.deleteHotel);
module.exports = router;
