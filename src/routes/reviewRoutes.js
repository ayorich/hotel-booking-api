const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const { SUPER_ADMIN, USER } = require('../constants/roles');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
/**
 * @description use of middleware here to protect all routes below
 */

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo(USER),
    reviewController.setHotelUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo(USER, SUPER_ADMIN), reviewController.updateReview)
  .delete(authController.restrictTo(USER, SUPER_ADMIN), reviewController.deleteReview);

module.exports = router;
