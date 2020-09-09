const express = require('express');
const morgan = require('morgan');

const hotelRouter = require('./routes/hotelRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
}
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2) ROUTES
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
