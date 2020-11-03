/* eslint-disable func-names */
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: [true, 'Booking must belong to a hotel']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user!']
    },
    price: {
        type: Number,
        required: [true, 'Booking must belong to a price']
    },
    roomType: {
        type: String,
        required: [true, 'Booking must have a roomType']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    },
});

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'hotel',
        select: 'name summary location ratingsQuantity ratingsAverage slug imageCover'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
