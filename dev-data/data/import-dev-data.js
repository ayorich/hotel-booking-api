const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hotel = require('../../models/hotelModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// READING JSON FILE

const hotels = JSON.parse(fs.readFileSync(`${__dirname}/hotel-simple.json`, 'utf-8'));

// IMPORT DATA TO DATABASE

const importData = async () => {
  try {
    await Hotel.create(hotels);
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
