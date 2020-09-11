const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel must have a name'],
    unique: true,
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 3.0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A hotel must have an average price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A hotel must have a description'],
  },
  description: {
    type: String,
  },
  imageCover: {
    type: String,
    require: [true, 'A hotel must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // NOT TO SHOW BY DEFAULT WHEN REQUESTED
  },
  roomsQuantity: {
    type: Number,
    required: [true, 'A hotel must have a total number of rooms'],
  },
  roomsAvailable: {
    type: Number,
    required: [true, 'A hotel must have numbers of available rooms'],
  },
  address: {
    type: String,
    required: [true, 'A hotel must have an address'],
  },
  city: {
    type: String,
    required: [true, 'A hotel must have an city'],
  },
  state: {
    type: String,
    required: [true, 'A hotel must have an state'],
  },

  hotelType: {
    type: String,
    default: 'Hotel',
  },
  allowPets: {
    type: Boolean,
    trim: true,
    default: false,
  },
  amenities: [String],
});
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;