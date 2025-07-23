import React, { useState, useEffect } from 'react';
import { formService } from '../services/formService';
import { useApi } from '../hooks/useApi';
import { validateForm } from '../utils/validators';
import { formatPhoneNumber, sanitizeInput, capitalizeWords } from '../utils/helpers';
import { FORM_CONSTANTS, UI_CONSTANTS } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    jobTitle: '',
    dateOfDiagnosis: '',
    typeOfDiagnosis: '',
    story: '',
    agreeToPrivacy: false,
    verifyHuman: false
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);
  const { loading, executeRequest } = useApi();

  // Load submit count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('formSubmitCount');
    if (saved) {
      setSubmitCount(parseInt(saved, 10));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Process specific fields
    if (type === 'text' && (name === 'firstName' || name === 'lastName')) {
      processedValue = capitalizeWords(sanitizeInput(value));
    } else if (name === 'phoneNumber') {
      processedValue = formatPhoneNumber(value);
    } else if (type === 'email') {
      processedValue = sanitizeInput(value).toLowerCase();
    } else if (type === 'text') {
      processedValue = sanitizeInput(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    // Validate form
    const validation = validateForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validation.errors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorElement.focus();
      }
      
      return;
    }

    try {
      // Prepare submission data
      const submissionData = {
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth || null,
        jobTitle: formData.jobTitle?.trim() || null,
        dateOfDiagnosis: formData.dateOfDiagnosis || null,
        typeOfDiagnosis: formData.typeOfDiagnosis || null,
        message: [
          formData.story?.trim() || '',
          `\n--- Form Details ---`,
          `Phone: ${formData.phoneNumber}`,
          `DOB: ${formData.dateOfBirth || 'Not provided'}`,
          `Job: ${formData.jobTitle || 'Not provided'}`,
          `Diagnosis Date: ${formData.dateOfDiagnosis || 'Not provided'}`,
          `Diagnosis Type: ${formData.typeOfDiagnosis || 'Not provided'}`,
          `Submitted: ${new Date().toISOString()}`
        ].join('\n').trim()
      };

      // Submit to API
      const result = await executeRequest(() => formService.submitForm(submissionData));

      // Success handling
      setSubmitStatus({
        type: 'success',
        message: `✅ SUCCESS! Your case ${result.data.caseId} has been submitted successfully. We'll contact you within 24 hours.`,
        caseId: result.data.caseId
      });

      // Update submit count
      const newCount = submitCount + 1;
      setSubmitCount(newCount);
      localStorage.setItem('formSubmitCount', newCount.toString());

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        jobTitle: '',
        dateOfDiagnosis: '',
        typeOfDiagnosis: '',
        story: '',
        agreeToPrivacy: false,
        verifyHuman: false
      });
      setErrors({});

      // Scroll to success message
      setTimeout(() => {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: `❌ ${error.message || 'Submission failed. Please try again or contact us directly.'}`
      });
    }
  };

  const renderField = (name, label, type = 'text', options = {}) => {
    const {
      required = false,
      placeholder = '',
      rows = null,
      children = null
    } = options;

    const fieldError = errors[name];
    const hasError = !!fieldError;

    return (
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'select' ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-xl transition duration-300 focus:outline-none ${
              hasError 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
            }`}
            required={required}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            rows={rows || 4}
            placeholder={placeholder}
            maxLength={FORM_CONSTANTS.maxLengths.message}
            className={`w-full px-4 py-3 border-2 rounded-xl transition duration-300 focus:outline-none resize-none ${
              hasError 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
            }`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border-2 rounded-xl transition duration-300 focus:outline-none ${
              hasError 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
            }`}
            required={required}
            maxLength={type === 'email' ? FORM_CONSTANTS.maxLengths.email : 
                      name === 'jobTitle' ? FORM_CONSTANTS.maxLengths.jobTitle :
                      (name === 'firstName' || name === 'lastName') ? FORM_CONSTANTS.maxLengths.name : undefined}
          />
        )}
        
        {hasError && (
          <p className="text-sm text-red-600 font-medium animate-slide-in">
            {fieldError}
          </p>
        )}
        
        {/* Character count for message field */}
        {name === 'story' && (
          <p className="text-xs text-gray-500 text-right">
            {formData[name].length}/{FORM_CONSTANTS.maxLengths.message} characters
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Free Case Evaluation
        </h2>
        <div className="inline-flex items-center bg-red-50 border-2 border-red-200 text-red-700 px-6 py-3 rounded-full animate-pulse-slow">
          <span className="animate-bounce-gentle mr-2">🔥</span>
          <span className="font-bold text-sm">{UI_CONSTANTS.urgencyMessage}</span>
        </div>
        
        {/* Free service badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {UI_CONSTANTS.benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full flex items-center text-xs font-medium border">
              <span className="mr-2">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Status */}
      {submitStatus && (
        <div className={`success-message mb-8 p-6 rounded-xl border-2 animate-fade-in ${
          submitStatus.type === 'success' 
            ? 'bg-success-50 border-success-200 text-success-800'
            : 'bg-error-50 border-error-200 text-error-800'
        }`}>
          <div className="flex items-start">
            <span className="mr-3 text-2xl">
              {submitStatus.type === 'success' ? '🎉' : '⚠️'}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-lg mb-2">
                {submitStatus.type === 'success' ? 'Form Submitted Successfully!' : 'Submission Error'}
              </p>
              <p className="text-sm leading-relaxed">
                {submitStatus.message}
              </p>
              {submitStatus.caseId && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-success-200">
                  <p className="text-sm">
                    <span className="font-semibold">Your Case ID:</span> 
                    <code className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                      {submitStatus.caseId}
                    </code>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Please save this ID for your records. We'll contact you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          {renderField('firstName', 'First Name', 'text', {
            required: true,
            placeholder: 'Enter your first name'
          })}
          {renderField('lastName', 'Last Name', 'text', {
            required: true,
            placeholder: 'Enter your last name'
          })}
        </div>

        {/* Contact Fields */}
        <div className="grid md:grid-cols-2 gap-6">
                    {renderField('phoneNumber', 'Phone Number', 'tel', {
                      required: true,
                      placeholder: 'Enter your phone number'
                    })}
                    {renderField('email', 'Email Address', 'email', {
                      required: true,
                      placeholder: 'Enter your email address'
                    })}
                  </div>
          
                  {/* Date of Birth and Job Title */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderField('dateOfBirth', 'Date of Birth', 'date', {
                      required: false
                    })}
                    {renderField('jobTitle', 'Job Title', 'text', {
                      required: false,
                      placeholder: 'Your job title (optional)'
                    })}
                  </div>
          
                  {/* Diagnosis Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderField('dateOfDiagnosis', 'Date of Diagnosis', 'date', {
                      required: false
                    })}
                    {renderField('typeOfDiagnosis', 'Type of Diagnosis', 'select', {
                      required: false,
                      children: (
                        <>
                          <option value="">Select diagnosis type (optional)</option>
                          {FORM_CONSTANTS.diagnosisTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                          ))}
                        </>
                      )
                    })}
                  </div>
          
                  {/* Story Field */}
                  {renderField('story', 'Your Story', 'textarea', {
                    required: false,
                    placeholder: 'Share your experience or any details you wish (optional)',
                    rows: 5
                  })}
          
                  {/* Privacy and Human Verification */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreeToPrivacy"
                        checked={formData.agreeToPrivacy}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      <label htmlFor="agreeToPrivacy" className="text-sm text-gray-700">
                        I agree to the <a href="/privacy" className="underline text-primary-600" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        <span className="text-red-500">*</span>
                      </label>
                      {errors.agreeToPrivacy && (
                        <span className="ml-2 text-xs text-red-600">{errors.agreeToPrivacy}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="verifyHuman"
                        checked={formData.verifyHuman}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      <label htmlFor="verifyHuman" className="text-sm text-gray-700">
                        I am not a robot <span className="text-red-500">*</span>
                      </label>
                      {errors.verifyHuman && (
                        <span className="ml-2 text-xs text-red-600">{errors.verifyHuman}</span>
                      )}
                    </div>
                  </div>
          
                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner className="mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Case
                          <span className="ml-2">→</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You have submitted this form {submitCount} {submitCount === 1 ? 'time' : 'times'}.
                    </p>
                  </div>
                </form>
              </div>
            );
          };
          
          export default Form;