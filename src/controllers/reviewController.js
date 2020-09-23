const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.hotelId) filter = { hotel: req.params.hotelId };
  /**
     * @todo to check how to restructed this pre query
     * to aviod double query when called in Hotel and User model
     * @source from reviewModel.js
     * @method .populate
     */
  const reviews = await Review.find(filter).populate({
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

exports.setHotelUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
