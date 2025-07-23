import { FORM_CONSTANTS } from './constants';

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} ${FORM_CONSTANTS.validationMessages.required}`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return FORM_CONSTANTS.validationMessages.email;
  }
  
  if (email.length > FORM_CONSTANTS.maxLengths.email) {
    return FORM_CONSTANTS.validationMessages.maxLength(FORM_CONSTANTS.maxLengths.email);
  }
  
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return 'Phone number must be between 10-15 digits';
  }
  
  return null;
};

export const validateName = (name, fieldName = 'Name') => {
  const requiredError = validateRequired(name, fieldName);
  if (requiredError) return requiredError;
  
  if (name.length < 2) {
    return FORM_CONSTANTS.validationMessages.minLength(2);
  }
  
  if (name.length > FORM_CONSTANTS.maxLengths.name) {
    return FORM_CONSTANTS.validationMessages.maxLength(FORM_CONSTANTS.maxLengths.name);
  }
  
  // Only allow letters, spaces, hyphens, apostrophes, and periods
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, apostrophes, and periods';
  }
  
  return null;
};

export const validateDate = (date, fieldName = 'Date', isPast = true) => {
  if (!date) return null;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(dateObj.getTime())) {
    return FORM_CONSTANTS.validationMessages.date;
  }
  
  if (isPast && dateObj >= today) {
    return `${fieldName} cannot be in the future`;
  }
  
  // Check if date is too far in the past (before 1900)
  if (dateObj.getFullYear() < 1900) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  
  return null;
};

export const validateMessage = (message) => {
  if (!message) return null;
  
  if (message.length > FORM_CONSTANTS.maxLengths.message) {
    return FORM_CONSTANTS.validationMessages.maxLength(FORM_CONSTANTS.maxLengths.message);
  }
  
  return null;
};

export const validateForm = (formData) => {
  const errors = {};
  
  // Required fields
  errors.firstName = validateName(formData.firstName, 'First name');
  errors.lastName = validateName(formData.lastName, 'Last name');
  errors.email = validateEmail(formData.email) || validateRequired(formData.email, 'Email');
  errors.phoneNumber = validatePhone(formData.phoneNumber) || validateRequired(formData.phoneNumber, 'Phone number');
  
  // Optional fields with validation
  if (formData.dateOfBirth) {
    errors.dateOfBirth = validateDate(formData.dateOfBirth, 'Date of birth');
  }
  
  if (formData.dateOfDiagnosis) {
    errors.dateOfDiagnosis = validateDate(formData.dateOfDiagnosis, 'Date of diagnosis');
  }
  
  if (formData.jobTitle && formData.jobTitle.length > FORM_CONSTANTS.maxLengths.jobTitle) {
    errors.jobTitle = FORM_CONSTANTS.validationMessages.maxLength(FORM_CONSTANTS.maxLengths.jobTitle);
  }
  
  errors.message = validateMessage(formData.message);
  
  // Checkboxes
  if (!formData.agreeToPrivacy) {
    errors.agreeToPrivacy = 'You must agree to the privacy policy';
  }
  
  if (!formData.verifyHuman) {
    errors.verifyHuman = 'Please verify you are human';
  }
  
  // Remove null/undefined errors
  Object.keys(errors).forEach(key => {
    if (!errors[key]) {
      delete errors[key];
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};