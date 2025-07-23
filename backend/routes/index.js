const express = require('express');
const formRoutes = require('./formRoutes');
const healthRoutes = require('./healthRoutes');
const { generalLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// Mount routes
router.use('/form', formRoutes);
router.use('/health', healthRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mesothelioma Case Evaluation API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      form_submit: 'POST /api/form',
      form_list: 'GET /api/form',
      form_stats: 'GET /api/form/stats'
    },
    documentation: 'https://your-api-docs-url.com',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;