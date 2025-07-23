const express = require('express');
const {
  submitForm,
  getFormEntries,
  getFormEntry,
  getFormEntryByCaseId,
  updateFormEntryStatus,
  getFormStats,
  deleteFormEntry
} = require('../controllers/formController');
const { validateFormSubmission, validateGetEntries } = require('../middleware/validator');
const { formSubmissionLimiter } = require('../middleware/rateLimiter');
const { logRequest } = require('../utils/helpers');

const router = express.Router();

// Middleware to log all form route requests
router.use((req, res, next) => {
  logRequest(req, 'Form API Request');
  next();
});

/**
 * @route   POST /api/form
 * @desc    Submit a new form entry
 * @access  Public
 */
router.post('/', 
  formSubmissionLimiter,
  validateFormSubmission,
  submitForm
);

/**
 * @route   GET /api/form
 * @desc    Get all form entries with filtering and pagination
 * @access  Public (In production, add authentication)
 */
router.get('/',
  validateGetEntries,
  getFormEntries
);

/**
 * @route   GET /api/form/stats
 * @desc    Get form submission statistics
 * @access  Public (In production, add authentication)
 */
router.get('/stats', getFormStats);

/**
 * @route   GET /api/form/case/:caseId
 * @desc    Get form entry by case ID
 * @access  Public
 */
router.get('/case/:caseId', getFormEntryByCaseId);

/**
 * @route   GET /api/form/:id
 * @desc    Get a single form entry by ID
 * @access  Public (In production, add authentication)
 */
router.get('/:id', getFormEntry);

/**
 * @route   PATCH /api/form/:id/status
 * @desc    Update form entry status
 * @access  Protected (In production, add authentication)
 */
router.patch('/:id/status', updateFormEntryStatus);

/**
 * @route   DELETE /api/form/:id
 * @desc    Delete form entry (soft delete)
 * @access  Protected (In production, add authentication)
 */
router.delete('/:id', deleteFormEntry);

module.exports = router;