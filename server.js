const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log(con.connections);
//     console.log('DB connections successful');
//   });

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A hotel must have a price'],
  },
});
const Hotel = mongoose.model('Hotel', hotelSchema);
const testHotel = new Hotel({
  name: 'hotel de smartees',
  price: 997,
});

testHotel
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('error:', err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});
