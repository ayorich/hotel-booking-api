const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errrorController');
const hotelRouter = require('./routes/hotelRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// implement CORS
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Set Security HTTP Headers
// app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter);

// BOdy parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // for form submit parser using action('/submit-user-data) in form
app.use(cookieParser());
// data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// // prevent parameter pollution and use whitelist to add double query params
app.use(hpp({
  whitelist: [
    'hotelType', 'ratingsAverage', 'ratingsQuantity', 'price'
  ]
}));

app.use(compression());
// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  // console.log(req.body);
  // console.log(req.cookies);

  next();
});

// 2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
