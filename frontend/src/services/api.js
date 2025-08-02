import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    
    // Handle common errors
    if (error.response?.status === 404) {
      console.warn('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error - falling back to mock data if available');
    }
    
    return Promise.reject(error);
  }
);

// API Functions

// Modules API
export const modulesApi = {
  // Get all modules
  getAll: async () => {
    try {
      const response = await api.get('/modules');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      throw error;
    }
  },

  // Get specific module
  getById: async (id) => {
    try {
      const response = await api.get(`/modules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch module ${id}:`, error);
      throw error;
    }
  },

  // Update module progress
  updateProgress: async (id, progressData) => {
    try {
      const response = await api.put(`/modules/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update module ${id} progress:`, error);
      throw error;
    }
  },

  // Get module exercises
  getExercises: async (id) => {
    try {
      const response = await api.get(`/modules/${id}/exercises`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch exercises for module ${id}:`, error);
      throw error;
    }
  }
};

// User API
export const userApi = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  },

  // Get user progress
  getProgress: async () => {
    try {
      const response = await api.get('/user/progress');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      throw error;
    }
  }
};

// Exercises API
export const exercisesApi = {
  // Complete exercise
  complete: async (exerciseId, completed) => {
    try {
      const response = await api.post(`/exercises/${exerciseId}/complete`, { completed });
      return response.data;
    } catch (error) {
      console.error(`Failed to complete exercise ${exerciseId}:`, error);
      throw error;
    }
  }
};

// Certificates API  
export const certificatesApi = {
  // Get user certificates
  getAll: async () => {
    try {
      const response = await api.get('/certificates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      throw error;
    }
  },

  // Generate certificate
  generate: async () => {
    try {
      const response = await api.post('/certificates/generate');
      return response.data;
    } catch (error) {
      console.error('Failed to generate certificate:', error);
      throw error;
    }
  }
};

// Stats API
export const statsApi = {
  // Get platform stats
  get: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      throw error;
    }
  }
};

export default api;