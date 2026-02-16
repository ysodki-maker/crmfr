import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = localStorage.getItem('token');
        
        if (currentUser && token) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message || 'Échec de la connexion' };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion au serveur' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};