const express = require('express');
const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', hotelController.checkgID);

router.use('/:hotelId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(hotelController.alaisTopHotels, hotelController.getAllHotels);

router
  .route('/hotel-stats')
  .get(hotelController.getHotelStats);

router
  .route('/hotels-nearby/:distance/center/:latlng/unit/:unit')
  .get(hotelController.getHotelsNearby);
router
  .route('/distances/:latlng/unit/:unit')
  .get(hotelController.getDistances);

router
  .route('/')
  .get(hotelController.getAllHotels)
  .post(authController.protect,
    authController.restrictTo('admin', 'superAdmin'),
    hotelController.createHotel);

router
  .route('/:id')
  .get(authController.protect, hotelController.getHotel)
  .patch(authController.protect,
    authController.restrictTo('admin', 'superAdmin'),
    hotelController.updateHotel)
  .delete(authController.protect,
    authController.restrictTo('admin', 'superAdmin'),
    hotelController.deleteHotel);

module.exports = router;
