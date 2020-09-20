const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  
  // eslint-disable-next-line no-underscore-dangle
  const token = signToken(newUser._id);
  
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. CHECK IF EMAIL AND PASSWORD EXIST
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2. IF USER EXIST & PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password');

  if (user) {
    const correct = user.correctPassword(password, user.password);

    if (!correct) return next(new AppError('Incorrect email or password', 401));
  } else {
    return next(new AppError('Incorrect email or password', 401));
  }
 
  // 3. IF EVERYTHING OK, SEND TOKEN TO CLIENT
  // eslint-disable-next-line no-underscore-dangle
  const token = signToken(user._id);

  res.status(200).json({
    status: 'sucess',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1.GET TOKEN AND CHECK IF IT EXIST
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! please log in to get access', 401));
  }

  // 2.VALIDATE TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
 
  // 3. CHECK IF USER STILL EXISTS
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('The user belonging to this token no longer exist', 401));
  
  // 4.CHECK IF USER CHANGED PASSWORD AFTER THE TOKEN WAS ISSUED
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
