// const Hotel = require('../models/hotelModel');

// const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/hotel-simple.json`));

exports.checkBody = (req, res, next) => {
  //   console.log('hotel checkbody');
  //   console.log(req.body.location);
  if (!req.body.name || !req.body.location) {
    return res.status(404).json({
      status: 'Fail',
      message: 'MISSING NAME OR LOCATION',
    });
  }
  next();
};

exports.getAllHotels = (req, res) => {
  //   console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: hotels.length,
    // data: {
    //   hotels,
    // },
  });
};
exports.getHotel = (req, res) => {
  //   console.log('req.params');
  // const id = req.params.id * 1;
  // const hotel = hotels.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     hotel,
  //   },
  // });
};
exports.createHotel = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   hotel: newHotel,
    // },
  });
};

exports.updateHotel = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      hotel: '<updated hotel here.../>',
    },
  });
};

exports.deleteHotel = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
