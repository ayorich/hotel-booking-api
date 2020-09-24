const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
/**
 * @description use of middleware here to protect all routes below
 */

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setHotelUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user', ' superAdmin'), reviewController.updateReview)
  .delete(authController.restrictTo('user', ' superAdmin'), reviewController.deleteReview);

module.exports = router;
