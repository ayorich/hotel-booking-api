const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello fro the server side', app: 'booking app' });
// });
// app.post('/', (req, res) => {
//   res.status(200).json({ message: 'you can post here', app: 'booking app' });
// });
const hotels = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/hotel-simple.json`)
);
app.get('/api/v1/hotels', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: {
      hotels,
    },
  });
});

app.get('/api/v1/hotels/:id/', (req, res) => {
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
});

app.post('/api/v1/hotels', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});
