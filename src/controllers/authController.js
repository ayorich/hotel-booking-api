const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email.js');

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
// 1.GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }
  // 2. GENERATE THE RANDOM RESET TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3.SEND IT TO USER'S EMAIL
  const resetURL = `${req.protocol}://${req.get('host')}/api/vi/users/resetPassword/${resetToken}`;
  
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token is only valid for 10mins',
      message
    });
  
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later', 500));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
// 1.GET USER BASED ON THE TOKEN
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() }
  });
  // 2.IF TOKEN HAS NOT EXPIRED, AND THERE IS USER, SET THE PASSWORD
  if (!user) return next(new AppError('Token is invalid or has expired', 400));
 
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3.UPDATE CHANGEDPASSWORDAT PROPERTY FOR USER

  // 4.LOG THE USER IN , SEND JWT
  // eslint-disable-next-line no-underscore-dangle
  const token = signToken(user._id);

  res.status(200).json({
    status: 'sucess',
    token
  });
});
