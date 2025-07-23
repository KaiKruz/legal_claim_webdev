const FormEntry = require('../models/FormEntry');
const { 
  successResponse, 
  errorResponse, 
  sanitizeName, 
  sanitizeEmail, 
  formatPhoneNumber, 
  generateCaseId, 
  getClientIP,
  asyncHandler 
} = require('../utils/helpers');
const constants = require('../config/constants');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * @desc    Submit a new form entry
 * @route   POST /api/form
 * @access  Public
 */
const submitForm = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    dateOfBirth,
    jobTitle,
    dateOfDiagnosis,
    typeOfDiagnosis,
    message
  } = req.body;

  // Sanitize input data
  const sanitizedData = {
    fullName: sanitizeName(fullName),
    email: sanitizeEmail(email),
    phoneNumber: formatPhoneNumber(phoneNumber),
    dateOfBirth: dateOfBirth || null,
    jobTitle: jobTitle?.trim() || null,
    dateOfDiagnosis: dateOfDiagnosis || null,
    typeOfDiagnosis: typeOfDiagnosis || null,
    message: message?.trim() || null,
    caseId: generateCaseId(),
    ipAddress: getClientIP(req),
    userAgent: req.get('User-Agent'),
    submittedAt: new Date()
  };

  // Create form entry
  const formEntry = await FormEntry.create(sanitizedData);
  
  // Log successful submission
  logger.info(`📝 New form submission: ${formEntry.caseId} from ${formEntry.email}`);

  // Prepare response data
  const responseData = {
    id: formEntry.id,
    caseId: formEntry.caseId,
    fullName: formEntry.fullName,
    email: formEntry.email,
    status: formEntry.status,
    submittedAt: formEntry.submittedAt
  };

  const { response, statusCode } = successResponse(
    `Form submitted successfully! Your case ID is: ${formEntry.caseId}`,
    responseData,
    constants.HTTP_STATUS.CREATED
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Get all form entries with filtering and pagination
 * @route   GET /api/form
 * @access  Public (In production, this should be protected)
 */
const getFormEntries = asyncHandler(async (req, res) => {
  const { page, limit, search, sortBy, sortOrder } = req.query;
  const offset = (page - 1) * limit;

  // Build where clause for search
  const whereClause = search ? {
    [Op.or]: [
      { fullName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { caseId: { [Op.like]: `%${search}%` } },
      { jobTitle: { [Op.like]: `%${search}%` } }
    ]
  } : {};

  // Get entries with pagination
  const { count, rows } = await FormEntry.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [[sortBy, sortOrder]],
    attributes: [
      'id', 'caseId', 'fullName', 'email', 'phoneNumber', 
      'jobTitle', 'typeOfDiagnosis', 'status', 'priority', 
      'submittedAt', 'createdAt'
    ]
  });

  // Prepare pagination info
  const pagination = {
    currentPage: parseInt(page),
    totalPages: Math.ceil(count / limit),
    totalEntries: count,
    entriesPerPage: parseInt(limit),
    hasNext: offset + limit < count,
    hasPrev: page > 1,
    nextPage: offset + limit < count ? parseInt(page) + 1 : null,
    prevPage: page > 1 ? parseInt(page) - 1 : null
  };

  const responseData = {
    entries: rows,
    pagination,
    filters: {
      search: search || null,
      sortBy,
      sortOrder
    }
  };

  const { response, statusCode } = successResponse(
    `Retrieved ${rows.length} of ${count} form entries`,
    responseData
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Get a single form entry by ID
 * @route   GET /api/form/:id
 * @access  Public (In production, this should be protected)
 */
const getFormEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const formEntry = await FormEntry.findByPk(id, {
    attributes: { exclude: ['ipAddress', 'userAgent'] }
  });

  if (!formEntry) {
    const { response, statusCode } = errorResponse(
      'Form entry not found',
      null,
      constants.HTTP_STATUS.NOT_FOUND
    );
    return res.status(statusCode).json(response);
  }

  const { response, statusCode } = successResponse(
    'Form entry retrieved successfully',
    formEntry
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Get form entry by case ID
 * @route   GET /api/form/case/:caseId
 * @access  Public
 */
const getFormEntryByCaseId = asyncHandler(async (req, res) => {
  const { caseId } = req.params;

  const formEntry = await FormEntry.findByCaseId(caseId);

  if (!formEntry) {
    const { response, statusCode } = errorResponse(
      'Case not found',
      null,
      constants.HTTP_STATUS.NOT_FOUND
    );
    return res.status(statusCode).json(response);
  }

  const responseData = formEntry.getPublicData();

  const { response, statusCode } = successResponse(
    'Case retrieved successfully',
    responseData
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Update form entry status
 * @route   PATCH /api/form/:id/status
 * @access  Protected (In production, add authentication)
 */
const updateFormEntryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const formEntry = await FormEntry.findByPk(id);

  if (!formEntry) {
    const { response, statusCode } = errorResponse(
      'Form entry not found',
      null,
      constants.HTTP_STATUS.NOT_FOUND
    );
    return res.status(statusCode).json(response);
  }

  // Update status and notes
  await formEntry.update({
    status: status || formEntry.status,
    notes: notes || formEntry.notes,
    contactedAt: status === 'contacted' && !formEntry.contactedAt ? new Date() : formEntry.contactedAt
  });

  logger.info(`📊 Status updated for case ${formEntry.caseId}: ${formEntry.status} -> ${status}`);

  const { response, statusCode } = successResponse(
    'Form entry status updated successfully',
    formEntry.getPublicData()
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Get form submission statistics
 * @route   GET /api/form/stats
 * @access  Public (In production, this should be protected)
 */
const getFormStats = asyncHandler(async (req, res) => {
  const stats = await FormEntry.getStatistics();
  
  const responseData = {
    ...stats,
    database: 'MySQL (Local)',
    lastUpdated: new Date().toISOString()
  };

  const { response, statusCode } = successResponse(
    'Statistics retrieved successfully',
    responseData
  );

  res.status(statusCode).json(response);
});

/**
 * @desc    Delete form entry (soft delete by updating status)
 * @route   DELETE /api/form/:id
 * @access  Protected (In production, add authentication)
 */
const deleteFormEntry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const formEntry = await FormEntry.findByPk(id);

  if (!formEntry) {
    const { response, statusCode } = errorResponse(
      'Form entry not found',
      null,
      constants.HTTP_STATUS.NOT_FOUND
    );
    return res.status(statusCode).json(response);
  }

  // Soft delete by updating status
  await formEntry.update({ status: 'closed' });

  logger.info(`🗑️ Form entry soft deleted: ${formEntry.caseId}`);

  const { response, statusCode } = successResponse(
    'Form entry deleted successfully'
  );

  res.status(statusCode).json(response);
});

module.exports = {
  submitForm,
  getFormEntries,
  getFormEntry,
  getFormEntryByCaseId,
  updateFormEntryStatus,
  getFormStats,
  deleteFormEntry
};