const Hotel = require('../models/hotelModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/hotel-simple.json`));

// ALIASING AN ENDPOINT(PREFILLED)
exports.alaisTopHotels = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,city';
  next();
};

exports.getHotel = factory.getOne(Hotel, { path: 'reviews' });
exports.getAllHotels = factory.getAll(Hotel);
exports.createHotel = factory.createOne(Hotel);
exports.updateHotel = factory.updateOne(Hotel);
exports.deleteHotel = factory.deleteOne(Hotel);

exports.getHotelStats = catchAsync(async (req, res, next) => {
  const stats = await Hotel.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 1 },
      },
    },

    {
      $group: {
        // _id: { $toUpper: '$hotelType' },
        _id: { $trim: { input: { $toUpper: '$hotelType' } } },
        numHotel: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $addFields: {
        hotelType: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'HOTEL' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});
