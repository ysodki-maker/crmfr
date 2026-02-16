// React services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://corecrm.cosinus.ma/api';

// Configuration du retry
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 seconde

// Instance axios configurée
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes de timeout
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification et le rate limiting
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Gestion du rate limiting (429)
    if (error.response?.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = originalRequest._retryCount || 0;

      if (originalRequest._retryCount < MAX_RETRIES) {
        originalRequest._retryCount++;

        // Récupérer le délai depuis le header Retry-After ou utiliser un délai exponentiel
        const retryAfter = error.response.headers['retry-after'];
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : INITIAL_RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);

        console.log(
          `Rate limit atteint. Nouvelle tentative dans ${delay}ms (tentative ${originalRequest._retryCount}/${MAX_RETRIES})`
        );

        // Attendre avant de réessayer
        await new Promise((resolve) => setTimeout(resolve, delay));

        return api(originalRequest);
      } else {
        console.error('Nombre maximum de tentatives atteint pour le rate limiting');
        throw new Error(
          'Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.'
        );
      }
    }

    // Gestion des erreurs d'authentification (401/403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Ne pas rediriger si c'est la page de login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Fonction helper pour les appels API avec retry manuel
const apiCallWithRetry = async (apiFn, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) => {
  try {
    return await apiFn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      const retryAfter = error.response.headers['retry-after']
        ? parseInt(error.response.headers['retry-after']) * 1000
        : delay;

      console.log(`Rate limit. Nouvelle tentative dans ${retryAfter}ms (${retries} restantes)`);

      await new Promise((resolve) => setTimeout(resolve, retryAfter));
      return apiCallWithRetry(apiFn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Services d'authentification
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiCallWithRetry(async () => {
        return await api.post('/auth/login', { email, password });
      });

      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 429) {
        throw new Error('Trop de tentatives de connexion. Veuillez patienter quelques minutes.');
      } else if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect.');
      } else if (error.response?.status === 500) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Erreur de connexion. Veuillez réessayer.');
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await apiCallWithRetry(async () => {
        return await api.post('/auth/register', userData);
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else if (error.response?.status === 409) {
        throw new Error('Cet email est déjà utilisé.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiCallWithRetry(async () => {
        return await api.post('/auth/forgot-password', { email });
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      
      if (error.response?.status === 429) {
        throw new Error('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Erreur lors de la réinitialisation. Veuillez réessayer.');
      }
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Services utilisateurs
export const userService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  changePassword: async (id, passwords) => {
    const response = await api.put(`/users/${id}/change-password`, passwords);
    return response.data;
  },
};

// Services projets
export const projetService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/projets', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projets/${id}`);
    return response.data;
  },

  create: async (projetData) => {
    const response = await api.post('/projets', projetData);
    return response.data;
  },

  update: async (id, projetData) => {
    const response = await api.put(`/projets/${id}`, projetData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projets/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/projets/stats');
    return response.data;
  },
};

// Services espaces
export const espaceService = {
  getByProjet: async (projetId) => {
    const response = await api.get(`/espaces/projet/${projetId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/espaces/${id}`);
    return response.data;
  },

  create: async (espaceData) => {
    const response = await api.post('/espaces', espaceData);
    return response.data;
  },

  update: async (id, espaceData) => {
    const response = await api.put(`/espaces/${id}`, espaceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/espaces/${id}`);
    return response.data;
  },
};

// Helper pour vérifier la connexion API
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('API non disponible:', error);
    return { status: 'error', message: 'API non disponible' };
  }
};

export default api;