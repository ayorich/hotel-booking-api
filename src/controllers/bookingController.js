/* eslint-disable indent */
const PayStack = require('paystack-node');
const Hotel = require('../models/hotelModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');

const {
    NODE_ENV,
    PAYSTACK_SECRET_KEY

} = process.env;

const paystack = new PayStack(PAYSTACK_SECRET_KEY, NODE_ENV);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. get currently booked hotel
    const { hotelId, roomId } = req.params;
    const hotel = await Hotel.findById(hotelId);
    let roomDetails;
    if (hotel) {
        roomDetails = hotel.roomTypes.filter((ob) => ob.id.toString() === roomId);
    }
    // 2.create checkout session
    const { body } = await paystack.initializeTransaction({
        amount: roomDetails[0].price * 100, // 5,000 Naira (remember you have to pass amount in kobo)
        email: req.user.email,
        callback_url: `${req.protocol}://${req.get('host')}/verify-payment`,
        metadata: JSON.stringify({
            hotel_id: hotelId,
            user_id: req.user._id,
            name: hotel.name,
            roomType: roomDetails[0].name,
            price: roomDetails[0].price,
            images: [`https://hotel-booking-apps.herokuapp.com/img/hotels/${hotel.imageCover}`],
            quantity: 1
        }),
    });
    // 3.create session as response
    res.status(200).json({
        ...body
    });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
    const { reference } = req.query;
    const { body } = await paystack.verifyTransaction({
        reference
    });
    const {
        hotel_id: hotel,
        user_id: user,
        price,
        roomType

    } = body.data.metadata;
    await Booking.create({
        hotel, user, price, roomType
    });
    res.locals.data = body.data.metadata;
    next();
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
