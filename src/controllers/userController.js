const User = require('../models/userModel');
// const apiFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.getUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(505).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};
