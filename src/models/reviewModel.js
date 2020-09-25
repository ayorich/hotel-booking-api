/* eslint-disable func-names */
const mongoose = require('mongoose');
const Hotel = require('./hotelModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
      required: [true, 'Review must belong to a hotel'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ hotel: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  /**
   * @todo add the hotel field by populate
   */
  this
    .populate({
      path: 'user',
      select: 'name photo'
    });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (hotelId) {
  const stats = await this.aggregate([

    {
      $match: { hotel: hotelId }
    },
    {
      $group: {
        _id: '$hotel',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }

  ]);

  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Hotel.findByIdAndUpdate(hotelId, {
      ratingsQuantity: 0,
      ratingsAverage: 3
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.hotel);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (!this.r) return;
  await this.r.constructor.calcAverageRatings(this.r.hotel);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
