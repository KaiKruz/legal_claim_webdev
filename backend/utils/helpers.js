const logger = require('./logger');

/**
 * Format phone number to standard format
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};

/**
 * Sanitize email address
 */
const sanitizeEmail = (email) => {
  if (!email) return null;
  return email.trim().toLowerCase();
};

/**
 * Sanitize name (remove extra spaces, capitalize)
 */
const sanitizeName = (name) => {
  if (!name) return null;
  
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generate unique case ID
 */
const generateCaseId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `CASE-${timestamp}-${random}`;
};

/**
 * Validate date format
 */
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Get client IP address
 */
const getClientIP = (req) => {
  return req.ip ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'unknown';
};

/**
 * Success response helper
 */
const successResponse = (message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return { response, statusCode };
};

/**
 * Error response helper
 */
const errorResponse = (message, errors = null, statusCode = 500) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return { response, statusCode };
};

/**
 * Log request details
 */
const logRequest = (req, message = 'API Request') => {
  logger.info(`${message}: ${req.method} ${req.originalUrl} from ${getClientIP(req)}`);
};

/**
 * Async handler wrapper for error handling
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  formatPhoneNumber,
  sanitizeEmail,
  sanitizeName,
  generateCaseId,
  isValidDate,
  getClientIP,
  successResponse,
  errorResponse,
  logRequest,
  asyncHandler
};