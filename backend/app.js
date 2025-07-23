const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const constants = require('./config/constants');
const { testConnection, syncDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const apiRoutes = require('./routes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express application
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Mount routes
app.use('/api', apiRoutes);
app.use('/', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mesothelioma Case Evaluation API is running!',
    service: constants.APP.NAME,
    version: constants.APP.VERSION,
    environment: constants.SERVER.ENV,
    database: 'MySQL (Local)',
    endpoints: {
      health: '/health',
      api: '/api',
      form: '/api/form'
    },
    timestamp: new Date().toISOString()
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database connection
const initializeDatabase = async () => {
  try {
    logger.info('🔌 Connecting to MySQL database...');
    const connected = await testConnection();
    
    if (!connected) {
      logger.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    logger.info('📊 Synchronizing database models...');
    const synced = await syncDatabase();
    
    if (!synced) {
      logger.error('❌ Failed to sync database models. Exiting...');
      process.exit(1);
    }
    
    logger.info('✅ Database initialized successfully');
  } catch (error) {
    logger.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Initialize database on startup
initializeDatabase();

module.exports = app;