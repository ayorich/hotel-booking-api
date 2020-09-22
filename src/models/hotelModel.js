/* eslint-disable func-names */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A hotel name must have equal or less than 40 characters'],
    minlength: [10, 'A hotel name must have equal or more than 10 characters'],
  },
  slug: String,
  ratingsAverage: {
    type: Number,
    default: 3.0,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A hotel must have an average price'],
  },
  priceDiscount: {
    type: Number,
    // DOESNOT WORK FOR UPDATE QUERY
    // validate: {
    //   validator(val) {
    //     return val < this.price;
    //   },
    //   message: 'Discount price({VALUE}) should be below regular price',
    // },
  },
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
    trim: true,
  },
  allowPets: {
    type: Boolean,
    default: false,
  },
  listingStatus: {
    type: Boolean,
    default: true,
  },
  amenities: [String],
  roomTypes: [{
    name: {
      type: String,
      required: [true, 'A room type must have a name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'A room type must have a price'],
    },
    roomsQuantity: {
      type: Number,
      required: [true, 'A room type must have a total number of rooms'],
    },
    roomsAvailable: {
      type: Number,
    },
  
  }],
  hotelAdmins: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    
  ]

});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() is called
hotelSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE: for any route that calls find**
hotelSchema.pre(/^find/, function (next) {
  // hotelSchema.pre('find', function (next) {
  if (this._update) {
    this.find();
  } else {
    this.find({ listingStatus: { $ne: false } });
  }
  next();
});

// AGGREGATION MIDDLEWARE : for route /hotel-stats
hotelSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { listingStatus: { $ne: false } } });
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
