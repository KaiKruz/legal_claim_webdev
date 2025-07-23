export const APP_CONFIG = {
  name: process.env.REACT_APP_SITE_NAME || 'Legal Aid Services',
  description: process.env.REACT_APP_SITE_DESCRIPTION || 'Mesothelioma Case Evaluation',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  phone: process.env.REACT_APP_PHONE || '1-800-LEGAL-AID',
  email: process.env.REACT_APP_EMAIL || 'help@legalaidservices.com',
};

export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
};

export const FORM_CONSTANTS = {
  diagnosisTypes: [
    { value: '', label: 'Select diagnosis type' },
    { value: 'mesothelioma', label: 'Mesothelioma' },
    { value: 'lung_cancer', label: 'Lung Cancer' },
    { value: 'asbestosis', label: 'Asbestosis' },
    { value: 'pleural_disease', label: 'Pleural Disease' },
    { value: 'other', label: 'Other Asbestos-Related Disease' }
  ],
  
  maxLengths: {
    name: 100,
    email: 255,
    phone: 20,
    jobTitle: 100,
    message: 2000
  },
  
  validationMessages: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    date: 'Please enter a valid date',
    maxLength: (max) => `Maximum ${max} characters allowed`,
    minLength: (min) => `Minimum ${min} characters required`
  }
};

export const UI_CONSTANTS = {
  slotsLeft: 6,
  urgencyMessage: 'ONLY 6 SLOTS LEFT TODAY',
  features: [
    {
      icon: '👥',
      title: 'Secondary Exposure is Common',
      description: 'Many women developed mesothelioma through secondary exposure from family members who worked with asbestos.'
    },
    {
      icon: '🛡️',
      title: 'Misdiagnosis Delays are Frequent',
      description: 'Women often experience delayed diagnosis due to symptoms being mistaken for other conditions.'
    },
    {
      icon: '🏆',
      title: 'Significant Legal Settlements',
      description: 'Women have successfully won substantial compensation for their suffering and medical expenses.'
    }
  ],
  
  benefits: [
    { icon: '🛡️', text: '100% Confidential' },
    { icon: '🏆', text: 'No Win, No Fee' },
    { icon: '⚡', text: 'Fast Response' },
    { icon: '🆓', text: '100% Free Service' },
    { icon: '🔒', text: 'Secure Database' },
    { icon: '📞', text: 'Available 24/7' }
  ]
};

export const ROUTES = {
  home: '/',
  success: '/success',
  notFound: '/404'
};