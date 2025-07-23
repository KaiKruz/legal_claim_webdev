const constants = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${error.statusCode || 500}: ${error.message}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: constants.HTTP_STATUS.NOT_FOUND };
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = 'Validation Error';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    error = { 
      message, 
      errors, 
      statusCode: constants.HTTP_STATUS.BAD_REQUEST 
    };
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: constants.HTTP_STATUS.BAD_REQUEST };
  }

  // Sequelize connection error
  if (err.name === 'SequelizeConnectionError') {
    const message = 'Database connection failed';
    error = { message, statusCode: constants.HTTP_STATUS.INTERNAL_SERVER_ERROR };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: constants.HTTP_STATUS.UNAUTHORIZED };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: constants.HTTP_STATUS.UNAUTHORIZED };
  }

  res.status(error.statusCode || constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Server Error',
    ...(error.errors && { errors: error.errors }),
    timestamp: new Date().toISOString(),
    ...(constants.SERVER.ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
