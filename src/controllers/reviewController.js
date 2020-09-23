const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  /**
   * @todo to check how to restructed this pre query
   * to aviod double query when called in Hotel and User model
   * @source from reviewModel.js
   * @method .populate
   */
  const reviews = await Review.find().populate({
    path: 'hotel',
    select: 'name'
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }

  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }

  });
});
