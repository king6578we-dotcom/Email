import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, setAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      if (res?.user) {
        setUser(res.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string) => {
    const res = await api.auth.login({ email, password });
    if (res?.token) {
      setAuthToken(res.token);
    }
    if (res?.user) {
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    const res = await api.auth.register({ name, email, password });
    if (res?.token) {
      setAuthToken(res.token);
    }
    if (res?.user) {
      setUser(res.user);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data: any) => {
    const res = await api.auth.updateProfile(data);
    if (res?.user) {
      setUser(res.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
