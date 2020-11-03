/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log(con.connections);
//     console.log('DB connections successful');
//   });
// console.log(process);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app runing on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!  Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

// HANDLED SIGTERM EMMITTED BY HEROKU EVERY 24 HRS
process.on('SIGTERM', () => {
  console.log('SIGTERM RECIEVED , Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
