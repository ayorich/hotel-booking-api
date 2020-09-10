const Hotel = require('../models/hotelModel');

// const hotels = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/hotel-simple.json`));

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
      message: 'Invalid data sent!',
    });
  }
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
