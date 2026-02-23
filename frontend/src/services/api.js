import axios from 'axios';
import useAuthStore from '../context/useAuthStore';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  salonRegister: (salonData) => api.post('/auth/salon/register', salonData),
  salonLogin: (credentials) => api.post('/auth/salon/login', credentials),
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadImage: (formData) => api.post('/user/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  submitQuestionnaire: (data) => api.post('/user/questionnaire', data),
  getQuestionnaireHistory: () => api.get('/user/questionnaire/history'),
  getFavorites: () => api.get('/user/favorites'),
  addFavorite: (styleId, notes) => api.post(`/user/favorites/${styleId}`, { notes }),
  removeFavorite: (styleId) => api.delete(`/user/favorites/${styleId}`),
  getAIAnalysis: (uploadId) => api.get(`/user/analysis/${uploadId}`),
  getMaintenanceTips: (data) => api.post('/user/maintenance-tips', data),
};

// ============================================
// BEARD STYLES API
// ============================================

export const stylesAPI = {
  getAll: (filters) => api.get('/styles', { params: filters }),
  getPopular: (limit = 10) => api.get('/styles/popular', { params: { limit } }),
  getRecommendations: (questionnaireData) => api.post('/styles/recommend', questionnaireData),
  getById: (id) => api.get(`/styles/${id}`),
  getBySlug: (slug) => api.get(`/styles/slug/${slug}`),
  getTags: () => api.get('/styles/meta/tags'),
  getFaceTypes: () => api.get('/styles/meta/face-types'),
  visualizeBeard: (uploadId, styleId) => api.post('/styles/visualize', { uploadId, styleId }),
};

// ============================================
// SALON API
// ============================================

export const salonAPI = {
  getProfile: () => api.get('/salon/profile'),
  getStats: () => api.get('/salon/stats'),
  getCustomers: () => api.get('/salon/customers'),
  createCustomer: (customerData) => api.post('/salon/customers', customerData),
  getCustomer: (customerId) => api.get(`/salon/customers/${customerId}`),
  createSession: (customerId, uploadId) => api.post('/salon/session/create', { customerId, uploadId }),
  joinSession: (code) => api.get(`/salon/session/join/${code}`),
  getSession: (sessionId) => api.get(`/salon/session/${sessionId}`),
  updateSessionStyle: (sessionId, styleId, notes) => 
    api.put(`/salon/session/${sessionId}/style`, { styleId, notes }),
  completeSession: (sessionId, stylistNotes, customerFeedback) =>
    api.post(`/salon/session/${sessionId}/complete`, { stylistNotes, customerFeedback }),
  getActiveSessions: () => api.get('/salon/sessions/active'),
  getSessionHistory: (sessionId) => api.get(`/salon/session/${sessionId}/history`),
};

export default api;
