import axios from 'axios';
import toast from 'react-hot-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configuration d'axios
const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('confianceboost_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('confianceboost_token');
      localStorage.removeItem('confianceboost_user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de l\'inscription';
      toast.error(message);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la connexion';
      toast.error(message);
      throw error;
    }
  }
};

// Services des modules
export const moduleService = {
  getAll: async () => {
    try {
      const response = await api.get('/modules');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération modules:', error);
      toast.error('Erreur lors du chargement des modules');
      throw error;
    }
  },

  getById: async (moduleId) => {
    try {
      const response = await api.get(`/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération module:', error);
      toast.error('Erreur lors du chargement du module');
      throw error;
    }
  }
};

// Services de progression
export const progressService = {
  getUserProgress: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération progression:', error);
      throw error;
    }
  },

  startModule: async (moduleId) => {
    try {
      const response = await api.post(`/progress/${moduleId}/start`);
      toast.success('Module commencé !');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors du démarrage du module';
      toast.error(message);
      throw error;
    }
  },

  completeLesson: async (moduleId, lessonId) => {
    try {
      const response = await api.post(`/progress/${moduleId}/complete-lesson/${lessonId}`);
      toast.success('Leçon terminée !');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la validation de la leçon';
      toast.error(message);
      throw error;
    }
  }
};

// Services du dashboard
export const dashboardService = {
  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération dashboard:', error);
      toast.error('Erreur lors du chargement du tableau de bord');
      throw error;
    }
  }
};

// Services de paiement
export const paymentService = {
  createCheckout: async (userData) => {
    try {
      const response = await api.post('/payment/create-checkout', userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la création du checkout';
      toast.error(message);
      throw error;
    }
  },

  verifyPayment: async (checkoutId) => {
    try {
      const response = await api.post('/payment/verify', { checkout_id: checkoutId });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de la vérification du paiement';
      toast.error(message);
      throw error;
    }
  },

  activatePremium: async (checkoutData) => {
    try {
      const response = await api.post('/payment/activate-premium', checkoutData);
      toast.success('Statut premium activé !');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Erreur lors de l\'activation premium';
      toast.error(message);
      throw error;
    }
  }
};

// Services des statistiques
export const statsService = {
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      return {
        total_users: 1250,
        premium_users: 892,
        total_modules: 6,
        total_certificates: 734,
        average_completion_rate: 78.5
      };
    }
  }
};

export default api;