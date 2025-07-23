const constants = {
  // Database
  DB_CONFIG: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT) || 3306,
    NAME: process.env.DB_NAME || 'mesothelioma_forms',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || 'admin123'
  },

  // Server
  SERVER: {
    PORT: parseInt(process.env.PORT) || 5000,
    ENV: process.env.NODE_ENV || 'development'
  },

  // Rate limiting
  RATE_LIMIT: {
    MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000 // 15 minutes
  },

  // Application
  APP: {
    NAME: process.env.APP_NAME || 'Mesothelioma Case Evaluation API',
    VERSION: process.env.APP_VERSION || '1.0.0'
  },

  // Form validation
  FORM_LIMITS: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PHONE_MAX_LENGTH: 20,
    MESSAGE_MAX_LENGTH: 2000,
    JOB_TITLE_MAX_LENGTH: 100
  },

  // Diagnosis types
  DIAGNOSIS_TYPES: [
    'mesothelioma',
    'lung_cancer',
    'asbestosis',
    'pleural_disease',
    'other'
  ],

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  }
};

module.exports = constants;