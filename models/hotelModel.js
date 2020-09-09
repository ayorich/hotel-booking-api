const mongoose = require('mongoose');

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

module.exports = Hotel;
