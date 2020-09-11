const Hotel = require('../models/hotelModel');
const apiFeatures = require('../utils/apiFeatures');

// const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/hotel-simple.json`));

// ALIASING AN ENDPOINT(PREFILLED)
exports.alaisTopHotels = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-price';
  req.query.fields = 'name,price,ratingsAverage,summary,city';
  next();
};

exports.getAllHotels = async (req, res) => {
  try {
    // BUILD QUERY
    const hotelData = Hotel.find();
    // 1a. FILTERING
    let query = apiFeatures.filter(hotelData, req.query);

    // 2.SORTING
    query = apiFeatures.sort(hotelData, req.query);

    // 3.LIMITING FIELD QUERY
    query = apiFeatures.limitFields(hotelData, req.query);

    // 4. PAGINATION
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        hotel,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.createHotel = async (req, res) => {
  try {
    const newHotel = await Hotel.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        hotel: newHotel,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'Success',
      data: {
        hotel,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getHotelStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
