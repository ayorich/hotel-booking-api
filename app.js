const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const hotels = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/hotel-simple.json`)
);
const getAllHotels = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels,
    },
  });
};
const getHotel = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const hotel = hotels.find((el) => el.id === id);
  // if (id > hotels.length) {
  if (!hotel) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      hotel,
    },
  });
};
const createHotel = (req, res) => {
  // console.log(req.body);
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

const updateHotel = (req, res) => {
  if (req.params.id * 1 > hotels.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      hotel: '<updated hotel here.../>',
    },
  });
};

const deleteHotel = (req, res) => {
  if (req.params.id * 1 > hotels.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
// app.get('/api/v1/hotels', getAllHotels);

// app.get('/api/v1/hotels/:id/', getHotel);

// app.post('/api/v1/hotels', createHotel);

// app.patch('/api/v1/hotels/:id', updateHotel);

// app.delete('/api/v1/hotels/:id', deleteHotel);

app.route('/api/v1/hotels').get(getAllHotels).post(createHotel);
app
  .route('/api/v1/hotels/:id/')
  .get(getHotel)
  .patch(updateHotel)
  .delete(deleteHotel);

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});
