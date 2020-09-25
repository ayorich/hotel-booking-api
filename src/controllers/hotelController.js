const Hotel = require('../models/hotelModel');
const AppError = require('../utils/appError');
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

exports.getHotelsNearby = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
  }
  const hotels = await Hotel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      data: hotels
    }
  });
});
