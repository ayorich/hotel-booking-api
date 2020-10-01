const Hotel = require('../models/hotelModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    // 1.get hotel data from collection
    const hotels = await Hotel.find();
    // 2.build template

    // 3.render the template using data from 1.

    res.status(200).render('overview', {
        title: 'Book exceptional comfort',
        hotels
    });
});

exports.getHotel = catchAsync(async (req, res) => {
    // 1. get data from collection
    const hotel = await Hotel.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });
    // render template
    res.status(200).render('hotel', {
        title: 'Hotel de Smart',
        hotel
    });
});