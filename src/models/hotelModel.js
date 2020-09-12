const mongoose = require('mongoose');
const slugify = require('slugify');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A room must have a name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A room must have a price'],
  },
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hotel must have a name'],
    unique: true,
    trim: true,
  },
  slug: String,
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
    trim: true,
  },
  allowPets: {
    type: Boolean,
    trim: true,
    default: false,
  },
  amenities: [String],
  roomsType: [roomSchema],
  listingStatus: {
    type: Boolean,
    default: true,
  },
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() is called
// eslint-disable-next-line func-names
hotelSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// hotelSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// eslint-disable-next-line func-names
hotelSchema.pre(/^find/, function (next) {
  // hotelSchema.pre('find', function (next) {
  this.find({ listingStatus: { $ne: false } });

  this.start = Date.now();
  next();
});

// eslint-disable-next-line func-names
// hotelSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milleseconds`);
//   console.log(docs);
//   next();
// });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
