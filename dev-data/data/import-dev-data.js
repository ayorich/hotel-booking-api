const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('../../src/models/hotelModel');
const Review = require('../../src/models/reviewModel');
const User = require('../../src/models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// READING JSON FILE

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/hotels.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA TO DATABASE

const importData = async () => {
  try {
    await Hotel.create(hotels);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE

const deleteData = async () => {
  try {
    await Hotel.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);

// COMMAND CODE LINE EXECUTION
// node dev-data/data/import-dev-data.js --delete/--import
