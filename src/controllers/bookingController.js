/* eslint-disable indent */
const PayStack = require('paystack-node');
const Hotel = require('../models/hotelModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
// const factory = require('./handlerFactory');
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
    // console.log(roomDetails[0]);
    // 2.create checkout session
    const { body } = await paystack.initializeTransaction({
        amount: roomDetails[0].price * 100, // 5,000 Naira (remember you have to pass amount in kobo)
        email: req.user.email,
        callback_url: `${req.protocol}://${req.get('host')}/?hotel=${hotelId}&user=${req.user.id}&price=${roomDetails[0].price}&roomType=${roomDetails[0].name}`,
        // reference: req.params.hotelId,
        metadata: JSON.stringify({
            hotel_id: hotelId,
            custom_fields: [
                {
                    name: hotel.name,
                    roomType: roomDetails.name,
                    description: hotel.summary,
                    images: [`https://hotel-booking-apps.herokuapp.com/img/hotels/${hotel.imageCover}`],
                    quantity: 1
                }
            ]
        }),
    });
    console.log(body);
    // console.log(request.body);
    // 3.create session as response
    res.status(200).json({
        ...body
        // null: null
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // temporary because its unsecured , due to callback url if know
    const {
        hotel, user, price, roomType
    } = req.query;

    if (!hotel && !user && !price && !roomType) return next();
    await Booking.create({
        hotel, user, price, roomType
    });
    res.redirect(req.originalUrl.split('?')[0]);
});
