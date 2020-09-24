const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const apiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
  const reqBody = Object.keys(req.body).length;

  if (reqBody === 0) throw new Error('update body is empty');

  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates,Please use /updateMyPassword.', 400));
  }

  // eslint-disable-next-line no-extra-boolean-cast
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      data: doc,
    },
  });
});

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (populateOptions) query = query.populate(populateOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No doc found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
  let filter = {};
  // TO GET ALLREVIEWS FOR A HOTEL BY hotelId
  if (req.params.hotelId) filter = { hotel: req.params.hotelId };

  // BUILD QUERY
  const modelQuery = Model.find(filter);

  // 1a. FILTERING
  let query = apiFeatures.filter(modelQuery, req.query);

  // 2.SORTING
  query = apiFeatures.sort(modelQuery, req.query);

  // 3.LIMITING FIELD QUERY
  query = apiFeatures.limitFields(modelQuery, req.query);

  // 4. PAGINATION
  /**
     * use for pagination when specified.
     * @param {modelQuery} modelQuery first Arg - query returned on Find().
     * @param {req.query} req.query Second Arg - request query.
     * @param {Model} Model Third Arg- Model model.
     * @returns {query} paginated query.
     */
  query = apiFeatures.pagination(modelQuery, req.query, Model);

  // // if (selectOptions) query = query.select(selectOptions);

  // EXECUTE QUERY
  // query.sort().select().skip().limit()
  const doc = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
