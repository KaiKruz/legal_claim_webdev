const { sequelize } = require('../config/database');
const constants = require('../config/constants');
const { successResponse, errorResponse, asyncHandler } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Basic health check
 * @route   GET /health
 * @access  Public
 */
const healthCheck = asyncHandler(async (req, res) => {
  const healthData = {
    status: 'OK',
    service: constants.APP.NAME,
    version: constants.APP.VERSION,
    environment: constants.SERVER.ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'Not checked'
  };

  const { response, statusCode } = successResponse(
    'Service is healthy',
    healthData
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Detailed health check with database connection
 * @route   GET /health/detailed
 * @access  Public
 */
const detailedHealthCheck = asyncHandler(async (req, res) => {
  let dbStatus = 'OK';
  let dbLatency = null;
  
  try {
    const startTime = Date.now();
    await sequelize.authenticate();
    dbLatency = Date.now() - startTime;
    logger.info(`Database health check passed in ${dbLatency}ms`);
  } catch (error) {
    dbStatus = 'ERROR';
    logger.error('Database health check failed:', error.message);
  }

  const healthData = {
    status: dbStatus === 'OK' ? 'OK' : 'DEGRADED',
    service: constants.APP.NAME,
    version: constants.APP.VERSION,
    environment: constants.SERVER.ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: dbStatus,
      latency: dbLatency,
      dialect: 'mysql',
      host: constants.DB_CONFIG.HOST,
      port: constants.DB_CONFIG.PORT,
      name: constants.DB_CONFIG.NAME
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  if (dbStatus === 'OK') {
    const { response, statusCode } = successResponse(
      'Service and database are healthy',
      healthData
    );
    res.status(statusCode).json(response);
  } else {
    const { response, statusCode } = errorResponse(
      'Service is degraded - database connection failed',
      null,
      constants.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    res.status(statusCode).json({ ...response, data: healthData });
  }
});

/**
 * @desc    Readiness probe for container orchestration
 * @route   GET /ready
 * @access  Public
 */
const readinessCheck = asyncHandler(async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    const { response, statusCode } = successResponse(
      'Service is ready',
      {
        status: 'READY',
        timestamp: new Date().toISOString()
      }
    );
    
    res.status(statusCode).json(response);
  } catch (error) {
    const { response, statusCode } = errorResponse(
      'Service is not ready',
      null,
      constants.HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
    
    res.status(statusCode).json(response);
  }
});

/**
 * @desc    Liveness probe for container orchestration
 * @route   GET /live
 * @access  Public
 */
const livenessCheck = asyncHandler(async (req, res) => {
  const { response, statusCode } = successResponse(
    'Service is alive',
    {
      status: 'ALIVE',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  );
  
  res.status(statusCode).json(response);
});

module.exports = {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck
};