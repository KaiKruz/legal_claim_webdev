const express = require('express');
const {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck
} = require('../controllers/healthController');

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Basic health check
 * @access  Public
 */
router.get('/', healthCheck);

/**
 * @route   GET /health/detailed
 * @desc    Detailed health check with database
 * @access  Public
 */
router.get('/detailed', detailedHealthCheck);

/**
 * @route   GET /ready
 * @desc    Readiness probe
 * @access  Public
 */
router.get('/ready', readinessCheck);

/**
 * @route   GET /live
 * @desc    Liveness probe
 * @access  Public
 */
router.get('/live', livenessCheck);

module.exports = router;