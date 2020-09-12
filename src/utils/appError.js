/**
 * Adds two numbers together.
 * @param {message} message The first number.
 * @param {statusCode} statusCode The second number.
 * @returns {int} The sum of the two numbers.
 */
class AppError extends Error {
  // eslint-disable-next-line require-jsdoc
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
