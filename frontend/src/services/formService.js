import api from './api';

export const formService = {
  /**
   * Submit form data to backend
   */
  submitForm: async (formData) => {
    try {
      const response = await api.post('/api/form', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all form submissions (admin feature)
   */
  getFormSubmissions: async (params = {}) => {
    try {
      const response = await api.get('/api/form', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get form submission by ID
   */
  getFormById: async (id) => {
    try {
      const response = await api.get(`/api/form/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get form submission by case ID
   */
  getFormByCaseId: async (caseId) => {
    try {
      const response = await api.get(`/api/form/case/${caseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get form submission statistics
   */
  getFormStats: async () => {
    try {
      const response = await api.get('/api/form/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update form submission status (admin feature)
   */
  updateFormStatus: async (id, statusData) => {
    try {
      const response = await api.patch(`/api/form/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};