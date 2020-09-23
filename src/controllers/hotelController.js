const Hotel = require('../models/hotelModel');
const apiFeatures = require('../utils/apiFeatures');
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

exports.getAllHotels = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  const hotelData = Hotel.find().select('-hotelAdmins');
  // 1a. FILTERING
  let query = apiFeatures.filter(hotelData, req.query);

  // 2.SORTING
  query = apiFeatures.sort(hotelData, req.query);

  // 3.LIMITING FIELD QUERY
  query = apiFeatures.limitFields(hotelData, req.query);

  // 4. PAGINATION
  /**
     * use for pagination when specified.
     * @param {hotelData} hotelData first Arg - query returned on Find().
     * @param {req.query} req.query Second Arg - request query.
     * @param {Hotel} Hotel Third Arg- hotel model.
     * @returns {query} paginated query.
     */
  query = apiFeatures.pagination(hotelData, req.query, Hotel);

  // EXECUTE QUERY
  // query.sort().select().skip().limit()
  const hotels = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels,
    },
  });
});

exports.getHotel = catchAsync(async (req, res, next) => {
  let hotel;

  if (req.user.role === 'user') {
    hotel = await Hotel.findById(req.params.id).select('-hotelAdmins').populate('reviews');
  } else {
    hotel = await Hotel.findById(req.params.id).populate({
      path: 'hotelAdmins',
      select: '-__v -passwordChangedAt'
    }).populate('reviews');
  }

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      hotel,
    },
  });
});

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
