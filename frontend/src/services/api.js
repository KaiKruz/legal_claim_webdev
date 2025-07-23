import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    // Log request in development
    if (process.env.REACT_APP_ENABLE_DEBUG === 'true') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.REACT_APP_ENABLE_DEBUG === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, data?.message || 'Unknown error');
      
      // Handle specific error codes
      switch (status) {
        case 400:
          error.message = data?.message || 'Invalid request. Please check your input.';
          break;
        case 429:
          error.message = data?.message || 'Too many requests. Please try again later.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = data?.message || `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.request);
      error.message = 'Network error. Please check your internet connection.';
    } else {
      // Request setup error
      console.error('❌ Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
};

// Generic API methods
export const apiMethods = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
};

export default api;