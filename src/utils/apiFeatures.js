exports.filter = (query, queryString) => {
  const queryObj = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const queryValue = query.find(JSON.parse(queryStr));
  return queryValue;
};

exports.sort = (query, queryString) => {
  let queryValue;
  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    queryValue = query.sort(sortBy);
  } else {
    queryValue = query.sort('-createdAt');
  }
  return queryValue;
};

exports.limitFields = (query, queryString) => {
  let queryValue;

  if (queryString.fields) {
    const fields = queryString.fields.split(',').join(' ');
    // console.log(fields);
    queryValue = query.select(fields);
  } else {
    queryValue = query.select('-__v ');
  }
  return queryValue;
};

/**
 * use for pagination.
 * @param {query} query first Arg - query to be passed.
 * @param {req.query} req.query Second Arg - request query-string object.
 * @param {Model} Model Third Arg- hotel Model.
 * @returns {queryValue} paginated query.
 */

exports.pagination = async (query, queryString, Model) => {
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 100;
  const skip = (page - 1) * limit;

  if (queryString.page) {
    const numHotel = await Model.countDocuments();

    if (skip >= numHotel) throw new Error('This page does not exist');
  }

  const queryValue = query.skip(skip).limit(limit);

  return queryValue;
};
