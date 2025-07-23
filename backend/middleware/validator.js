const Joi = require('joi');
const constants = require('../config/constants');
const { errorResponse } = require('../utils/helpers');

// Form submission validation schema
const formSubmissionSchema = Joi.object({
  fullName: Joi.string()
    .min(constants.FORM_LIMITS.NAME_MIN_LENGTH)
    .max(constants.FORM_LIMITS.NAME_MAX_LENGTH)
    .pattern(/^[a-zA-Z\s\-'\.]+$/)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': `Name must be at least ${constants.FORM_LIMITS.NAME_MIN_LENGTH} characters`,
      'string.max': `Name must not exceed ${constants.FORM_LIMITS.NAME_MAX_LENGTH} characters`,
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
    }),

  email: Joi.string()
    .email()
    .max(constants.FORM_LIMITS.EMAIL_MAX_LENGTH)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'string.max': `Email must not exceed ${constants.FORM_LIMITS.EMAIL_MAX_LENGTH} characters`
    }),

  phoneNumber: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .max(constants.FORM_LIMITS.PHONE_MAX_LENGTH)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
      'string.max': `Phone number must not exceed ${constants.FORM_LIMITS.PHONE_MAX_LENGTH} characters`
    }),

  dateOfBirth: Joi.date()
    .max('now')
    .min('1900-01-01')
    .allow('', null)
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'date.min': 'Please provide a valid date of birth'
    }),

  jobTitle: Joi.string()
    .max(constants.FORM_LIMITS.JOB_TITLE_MAX_LENGTH)
    .allow('', null)
    .messages({
      'string.max': `Job title must not exceed ${constants.FORM_LIMITS.JOB_TITLE_MAX_LENGTH} characters`
    }),

  dateOfDiagnosis: Joi.date()
    .max('now')
    .min('1950-01-01')
    .allow('', null)
    .messages({
      'date.max': 'Diagnosis date cannot be in the future',
      'date.min': 'Please provide a valid diagnosis date'
    }),

  typeOfDiagnosis: Joi.string()
    .valid(...constants.DIAGNOSIS_TYPES)
    .allow('', null)
    .messages({
      'any.only': `Diagnosis type must be one of: ${constants.DIAGNOSIS_TYPES.join(', ')}`
    }),

  message: Joi.string()
    .max(constants.FORM_LIMITS.MESSAGE_MAX_LENGTH)
    .allow('', null)
    .messages({
      'string.max': `Message must not exceed ${constants.FORM_LIMITS.MESSAGE_MAX_LENGTH} characters`
    })
});

/**
 * Validate form submission data
 */
const validateFormSubmission = (req, res, next) => {
  const { error } = formSubmissionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    const { response, statusCode } = errorResponse(
      'Validation failed',
      errors,
      constants.HTTP_STATUS.BAD_REQUEST
    );

    return res.status(statusCode).json(response);
  }

  next();
};

/**
 * Validate query parameters for getting entries
 */
const validateGetEntries = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).allow(''),
    sortBy: Joi.string().valid('createdAt', 'fullName', 'email').default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    const { response, statusCode } = errorResponse(
      'Invalid query parameters',
      errors,
      constants.HTTP_STATUS.BAD_REQUEST
    );

    return res.status(statusCode).json(response);
  }

  req.query = value;
  next();
};

module.exports = {
  validateFormSubmission,
  validateGetEntries
};