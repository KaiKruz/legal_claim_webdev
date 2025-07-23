const app = require('./app');
const constants = require('./config/constants');
const logger = require('./utils/logger');
const { closeConnection } = require('./config/database');

const PORT = constants.SERVER.PORT;

// Start server
const server = app.listen(PORT, () => {
  logger.info('🚀 ================================');
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🚀 Environment: ${constants.SERVER.ENV}`);
  logger.info(`🚀 Database: MySQL (${constants.DB_CONFIG.HOST}:${constants.DB_CONFIG.PORT})`);
  logger.info(`🚀 API URL: http://localhost:${PORT}/api`);
  logger.info(`🚀 Health Check: http://localhost:${PORT}/health`);
  logger.info('🚀 ================================');
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`📴 Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('📴 HTTP server closed');
    
    try {
      await closeConnection();
      logger.info('📴 Database connection closed');
      logger.info('📴 Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during shutdown:', error.message);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('📴 Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err.message);
  gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
  gracefulShutdown('uncaughtException');
});

module.exports = server;
