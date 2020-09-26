const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log(err);

  const message = `Duplicate field value: "${err.keyValue.name}". Please use another value`;
  return new AppError(message, 400);
};

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data. ${errors.join('. ')} `;
//   return new AppError(message, 400);
// };

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired!. Please log in again', 401);

const sendErrorDev = (err, res) => {
  // console.error('ERROR', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // console.log(err);
  if (err.isOperational) {
    // OPERATIONAL, TRUSTED ERROR: SEND MESSAGE TO CLIENT
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // PROGRAMMING OR OTHER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS
    // 1.LOG ERROR
    console.error('ERROR', err);
    // 2.SEND GENERIC MESSAGE
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // console.error('all', err);

  if (process.env.NODE_ENV === 'development') {
    // console.error('dev', err);

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // console.error('prod', error);

    // ERROR FOR UNKOWN ID
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);

    // ERROR FOR DUPLICATE FIELDS
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    // ERROR FOR BAD TOKEN
    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    // ERROR FOR EXPIRED TOKEN
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    // ERROR FOR MONGOOSE VALIDATION
    /**
     * @todo to find a more reliable way to check for mongoose validation error in the future
      */
    // let errorCheck;
    // if (error) {
    //   // eslint-disable-next-line no-underscore-dangle
    //   errorCheck = error._message.split(' ').includes('validation');
    // }
    // if (errorCheck) error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
