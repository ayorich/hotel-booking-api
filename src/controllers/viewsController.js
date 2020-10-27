const Hotel = require('../models/hotelModel');
const USER = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1.get hotel data from collection
    const hotels = await Hotel.find();
    // 2.build template

    // 3.render the template using data from 1.

    res.status(200).render('overview', {
        title: 'Book exceptional comfort',
        hotels
    });
});

exports.getHotel = catchAsync(async (req, res, next) => {
    // 1. get data from collection
    const hotel = await Hotel.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!hotel) {
        return next(new AppError('There is no hotel with that name', 404));
    }
    // render template
    res.status(200).render('hotel', {
        title: 'Hotel',
        hotel
    });
});

exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};

exports.getAccount = (req, res, next) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await USER.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
        {
            new: true,
            runValidators: true
        });
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});
