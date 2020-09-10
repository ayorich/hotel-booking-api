const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel must have a name'],
    unique: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  roomsAvailable: {
    type: Number,
    required: [true, 'A hotel must have numbers of available rooms'],
  },
});
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
