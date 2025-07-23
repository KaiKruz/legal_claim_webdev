const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const constants = require('../config/constants');

const FormEntry = sequelize.define('FormEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Primary key for form entries'
  },

  caseId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: 'Unique case identifier'
  },

  fullName: {
    type: DataTypes.STRING(constants.FORM_LIMITS.NAME_MAX_LENGTH),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Full name cannot be empty'
      },
      len: {
        args: [constants.FORM_LIMITS.NAME_MIN_LENGTH, constants.FORM_LIMITS.NAME_MAX_LENGTH],
        msg: `Name must be between ${constants.FORM_LIMITS.NAME_MIN_LENGTH} and ${constants.FORM_LIMITS.NAME_MAX_LENGTH} characters`
      }
    },
    comment: 'Full name of the form submitter'
  },

  email: {
    type: DataTypes.STRING(constants.FORM_LIMITS.EMAIL_MAX_LENGTH),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      },
      notEmpty: {
        msg: 'Email cannot be empty'
      }
    },
    comment: 'Email address of the form submitter'
  },

  phoneNumber: {
    type: DataTypes.STRING(constants.FORM_LIMITS.PHONE_MAX_LENGTH),
    allowNull: true,
    validate: {
      isNumeric: false // Allow formatting characters
    },
    comment: 'Phone number of the form submitter'
  },

  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Must be a valid date'
      },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Date of birth cannot be in the future'
      }
    },
    comment: 'Date of birth of the form submitter'
  },

  jobTitle: {
    type: DataTypes.STRING(constants.FORM_LIMITS.JOB_TITLE_MAX_LENGTH),
    allowNull: true,
    comment: 'Job title or occupation'
  },

  dateOfDiagnosis: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Must be a valid date'
      },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Diagnosis date cannot be in the future'
      }
    },
    comment: 'Date when diagnosis was made'
  },

  typeOfDiagnosis: {
    type: DataTypes.ENUM(...constants.DIAGNOSIS_TYPES),
    allowNull: true,
    comment: 'Type of diagnosis received'
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, constants.FORM_LIMITS.MESSAGE_MAX_LENGTH],
        msg: `Message cannot exceed ${constants.FORM_LIMITS.MESSAGE_MAX_LENGTH} characters`
      }
    },
    comment: 'Additional message or story from submitter'
  },

  ipAddress: {
    type: DataTypes.STRING(45), // Supports IPv4 and IPv6
    allowNull: true,
    comment: 'IP address of the form submitter'
  },

  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User agent string from browser'
  },

  status: {
    type: DataTypes.ENUM('new', 'contacted', 'in_progress', 'closed'),
    defaultValue: 'new',
    allowNull: false,
    comment: 'Current status of the case'
  },

  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
    allowNull: false,
    comment: 'Priority level of the case'
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about the case'
  },

  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    comment: 'Timestamp when form was submitted'
  },

  contactedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp when client was contacted'
  }
}, {
  tableName: 'form_entries',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['caseId']
    },
    {
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['submittedAt']
    },
    {
      fields: ['createdAt']
    }
  ],
  comment: 'Table storing mesothelioma case evaluation form submissions'
});

// Instance methods
FormEntry.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Remove sensitive data from JSON output
  delete values.ipAddress;
  delete values.userAgent;
  delete values.notes;
  
  return values;
};

FormEntry.prototype.getPublicData = function() {
  return {
    id: this.id,
    caseId: this.caseId,
    fullName: this.fullName,
    email: this.email,
    status: this.status,
    priority: this.priority,
    submittedAt: this.submittedAt,
    createdAt: this.createdAt
  };
};

// Class methods
FormEntry.findByCaseId = function(caseId) {
  return this.findOne({ where: { caseId } });
};

FormEntry.findByEmail = function(email) {
  return this.findAll({ where: { email: email.toLowerCase() } });
};

FormEntry.getStatistics = async function() {
  const total = await this.count();
  const today = await this.count({
    where: {
      submittedAt: {
        [require('sequelize').Op.gte]: new Date().setHours(0, 0, 0, 0)
      }
    }
  });
  
  const statusCounts = await this.findAll({
    attributes: ['status', [sequelize.fn('COUNT', '*'), 'count']],
    group: 'status',
    raw: true
  });

  return {
    total,
    today,
    statusCounts: statusCounts.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {})
  };
};

module.exports = FormEntry;