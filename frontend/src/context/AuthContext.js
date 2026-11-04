import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cookio_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cookio_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync with backend on startup if token exists
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getProfile();
          if (res) {
            setUser(res);
            localStorage.setItem('cookio_user', JSON.stringify(res));
          }
        } catch (error) {
          console.error('Lỗi kiểm tra phiên đăng nhập:', error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('cookio_token', res.token);
      localStorage.setItem('cookio_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.token && res.user) {
      localStorage.setItem('cookio_token', res.token);
      localStorage.setItem('cookio_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('cookio_token');
    localStorage.removeItem('cookio_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('cookio_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
