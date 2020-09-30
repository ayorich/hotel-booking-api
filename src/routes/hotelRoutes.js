const express = require('express');
const hotelController = require('../controllers/hotelController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const { SUPER_ADMIN, ADMIN, HOTEL_ADMIN } = require('../constants/roles');

const router = express.Router();

// router.param('id', hotelController.checkgID);

router.use('/:hotelId/reviews', reviewRouter);
// router.use('/:hotelId/admins', userRouter);

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

router.patch('/hoteladmin-update-hotel',
  authController.protect,
  authController.restrictTo(HOTEL_ADMIN),
  hotelController.hotelAdmin,
  hotelController.updateHotel);

router
  .route('/')
  .get(hotelController.getAllHotels)
  .post(authController.protect,
    authController.restrictTo(ADMIN, SUPER_ADMIN),
    hotelController.createHotel);

router
  .route('/:id')
  .get(authController.protect, hotelController.getHotel)
  .patch(authController.protect,
    authController.restrictTo(ADMIN, SUPER_ADMIN),
    hotelController.updateHotel)
  .delete(authController.protect,
    authController.restrictTo(ADMIN, SUPER_ADMIN),
    hotelController.deleteHotel);

module.exports = router;
