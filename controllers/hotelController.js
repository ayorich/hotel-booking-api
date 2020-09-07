const fs = require('fs');

const hotels = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/hotel-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  // console.log(`hotel is is:${val}`);

  if (req.params.id * 1 > hotels.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log(`hotel checkbody`);
  console.log(req.body.location);
  if (!req.body.name || !req.body.location) {
    return res.status(404).json({
      status: 'Fail',
      message: 'MISSING NAME OR LOCATION',
    });
  }
  next();
};

exports.getAllHotels = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: hotels.length,
    data: {
      hotels,
    },
  });
};
exports.getHotel = (req, res) => {
  console.log('req.params');
  const id = req.params.id * 1;
  const hotel = hotels.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      hotel,
    },
  });
};
exports.createHotel = (req, res) => {
  // console.log(req.body.location);
  const newId = hotels[hotels.length - 1].id + 1;
  const newHotel = Object.assign({ id: newId }, req.body);
  hotels.push(newHotel);
  fs.writeFile(
    `${__dirname}/dev-data/data/hotel-simple.json`,
    JSON.stringify(hotels),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          hotel: newHotel,
        },
      });
    }
  );
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
