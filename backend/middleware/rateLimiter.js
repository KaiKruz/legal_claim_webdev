const rateLimit = require('express-rate-limit');
const constants = require('../config/constants');
const logger = require('../utils/logger');

// Rate limiter for form submissions
const formSubmissionLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW, // 15 minutes
  max: 5, // Limit each IP to 5 form submissions per windowMs
  message: {
    success: false,
    message: 'Too many form submissions. Please try again in 15 minutes.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for form submission from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many form submissions. Please try again in 15 minutes.',
      timestamp: new Date().toISOString()
    });
  }
});

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW, // 15 minutes
  max: constants.RATE_LIMIT.MAX, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for general API from IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = {
  formSubmissionLimiter,
  generalLimiter
};