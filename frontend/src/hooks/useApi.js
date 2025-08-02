import { useState, useEffect } from 'react';
import { mockModules, mockUser, mockTestimonials, mockStats } from '../components/mock';

// Custom hook for API calls with loading states and fallback to mock data
export const useApi = (apiCall, fallbackData = null, dependencies = []) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        console.warn('API call failed, using fallback data:', err.message);
        setError(err);
        if (fallbackData) {
          setData(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// Specific hooks for different data types
export const useModules = () => {
  const { modulesApi } = require('../services/api');
  return useApi(() => modulesApi.getAll(), mockModules);
};

export const useModule = (id) => {
  const { modulesApi } = require('../services/api');
  const mockModule = mockModules.find(m => m.id === parseInt(id));
  return useApi(() => modulesApi.getById(id), mockModule, [id]);
};

export const useUser = () => {
  const { userApi } = require('../services/api');
  return useApi(() => userApi.getProfile(), mockUser);
};

export const useUserProgress = () => {
  const { userApi } = require('../services/api');
  const mockProgress = {
    totalProgress: 33,
    completedModules: 2,
    totalModules: 6
  };
  return useApi(() => userApi.getProgress(), mockProgress);
};

export const useStats = () => {
  const { statsApi } = require('../services/api');
  return useApi(() => statsApi.get(), mockStats);
};

// Hook for updating module progress
export const useUpdateModuleProgress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProgress = async (moduleId, progressData) => {
    try {
      setLoading(true);
      setError(null);
      const { modulesApi } = require('../services/api');
      const result = await modulesApi.updateProgress(moduleId, progressData);
      return result;
    } catch (err) {
      console.error('Failed to update module progress:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProgress, loading, error };
};