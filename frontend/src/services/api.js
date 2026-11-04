import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cookio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto logout on initial me check
      if (!error.config.url.includes('/auth/profile')) {
        localStorage.removeItem('cookio_token');
        localStorage.removeItem('cookio_user');
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Đã xảy ra lỗi, vui lòng thử lại';
    return Promise.reject(new Error(message));
  },
);

// Auth APIs
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Recipe APIs
export const recipeApi = {
  getAll: (params) => api.get('/recipes', { params }),
  getTrending: (limit = 8) => api.get('/recipes/trending', { params: { limit } }),
  getLatest: (limit = 8) => api.get('/recipes/latest', { params: { limit } }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post('/recipes', data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
  toggleLike: (id) => api.post(`/recipes/${id}/like`),
  toggleSave: (id) => api.post(`/recipes/${id}/save`),
  smartFridge: (ingredients) => api.post('/recipes/smart-fridge', { ingredients }),
};

// User APIs
export const userApi = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserRecipes: (username, params) => api.get(`/users/${username}/recipes`, { params }),
  getSavedRecipes: (params) => api.get('/users/me/saved', { params }),
  getLikedRecipes: (params) => api.get('/users/me/liked', { params }),
  follow: (id) => api.post(`/users/${id}/follow`),
  unfollow: (id) => api.delete(`/users/${id}/follow`),
};

// Comments APIs
export const commentApi = {
  getByRecipe: (recipeId) => api.get(`/comments/recipe/${recipeId}`),
  create: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Notifications APIs
export const notificationApi = {
  getAll: (limit = 20) => api.get('/notifications', { params: { limit } }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Cookbooks APIs
export const cookbookApi = {
  getMyCookbooks: () => api.get('/cookbooks/my'),
  getById: (id) => api.get(`/cookbooks/${id}`),
  create: (data) => api.post('/cookbooks', data),
  addRecipe: (cookbookId, recipeId) => api.post(`/cookbooks/${cookbookId}/recipes/${recipeId}`),
  removeRecipe: (cookbookId, recipeId) => api.delete(`/cookbooks/${cookbookId}/recipes/${recipeId}`),
  delete: (id) => api.delete(`/cookbooks/${id}`),
};

// Admin APIs
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getRecipes: (params) => api.get('/admin/recipes', { params }),
  togglePublish: (id) => api.patch(`/admin/recipes/${id}/toggle-publish`),
  toggleFeatured: (id) => api.patch(`/admin/recipes/${id}/toggle-featured`),
  getComments: (params) => api.get('/admin/comments', { params }),
  toggleCommentVisibility: (id) => api.patch(`/admin/comments/${id}/toggle-visibility`),
};

export default api;
