const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const { SUPER_ADMIN, ADMIN, HOTEL_ADMIN } = require('../constants/roles');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1.create error POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates,Please use /updateMyPassword.', 400));
  }
  // 2. filtered out unwanted fieldNames not allowed to update
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');

  // 3.Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res, next) => {
  res.status(505).json({
    status: 'error',
    message: 'this route is not defined. Please use /signup instead',
  });
};

exports.activateUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email ', 400));
  }

  const doc = await User.findOneAndUpdate({ email }, { active: true, updatedByAdmin: req.user._id });

  if (!doc) return next(new AppError('User does not exist'));

  res.status(200).json({
    status: 'success',
    message: 'Account successfully activated'
  });
});

exports.updateUserRestrictions = catchAsync(async (req, res, next) => {
  if (req.body.role === HOTEL_ADMIN && !req.body.hotel) {
    return next(new AppError('hotel admin must be associated with a hotel', 400));
  }
  // 1. if user from req.params.id is superAdmin throw error
  const isSuperAdmin = (await User.findById(req.params.id)).role;
  const isNotAllowed = [SUPER_ADMIN, ADMIN].includes(req.body.role);

  // 2. stops superadmin from updating self
  if (isSuperAdmin === SUPER_ADMIN && req.user.role === SUPER_ADMIN) {
    return next(new AppError('Route not defined. make use of /updateMe ', 400));
  }
  if (req.user.role === SUPER_ADMIN && req.body.role === SUPER_ADMIN) {
    return next(new AppError('Only one Super Admin is allowed', 403));
  }

  // 3.if not super admin throw errors
  if (isSuperAdmin === SUPER_ADMIN || (isNotAllowed && req.user.role !== SUPER_ADMIN)) {
    return next(new AppError('You do not have permission. Please contact the administrator', 401));
  }

  // 4.filter body to allow only role and active status
  const filteredBody = filterObj(req.body, 'role', 'active');

  // 5. as filteredbody to req.body
  req.body = filteredBody;
  req.body.updatedByAdmin = req.user._id;

  next();
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, { path: 'updatedByAdmin' });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
