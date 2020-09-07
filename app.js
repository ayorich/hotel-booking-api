const express = require('express');
const morgan = require('morgan');

const hotelRouter = require('./routes/hotelRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

//1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2.ROUTE HANDLER

//3) ROUTES
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
