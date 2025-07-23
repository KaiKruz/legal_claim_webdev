const { Sequelize } = require('sequelize');
const constants = require('./constants');
const logger = require('../utils/logger');

// Database configuration
const sequelize = new Sequelize(
  constants.DB_CONFIG.NAME,
  constants.DB_CONFIG.USER,
  constants.DB_CONFIG.PASSWORD,
  {
    host: constants.DB_CONFIG.HOST,
    port: constants.DB_CONFIG.PORT,
    dialect: 'mysql',
    
    // Connection pool configuration
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    
    // Logging configuration
    logging: constants.SERVER.ENV === 'development' 
      ? (msg) => logger.debug(msg)
      : false,
    
    // Timezone configuration
    timezone: '+00:00',
    
    // Define configuration
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false,
      paranoid: false
    },

    // Retry configuration
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ MySQL database connection established successfully');
    return true;
  } catch (error) {
    logger.error('❌ Unable to connect to MySQL database:', error.message);
    return false;
  }
};

// Sync database models
const syncDatabase = async (options = {}) => {
  try {
    const defaultOptions = {
      alter: constants.SERVER.ENV === 'development',
      force: false
    };
    
    const syncOptions = { ...defaultOptions, ...options };
    
    await sequelize.sync(syncOptions);
    logger.info('📊 Database models synchronized successfully');
    return true;
  } catch (error) {
    logger.error('❌ Database sync failed:', error.message);
    return false;
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    await sequelize.close();
    logger.info('🔒 Database connection closed successfully');
  } catch (error) {
    logger.error('❌ Error closing database connection:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection
};