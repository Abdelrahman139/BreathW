import React, { createContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('xray_token');
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('xray_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // In a real app, you might validate the token with the backend here or load the user details
    // if only the token is saved in localStorage. For now we assume user is passed on login.
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('unauthorized_error', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized_error', handleUnauthorized);
    };
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('xray_token', newToken);
    localStorage.setItem('xray_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    toast.success('Successfully logged in!');
  };

  const logout = () => {
    localStorage.removeItem('xray_token');
    localStorage.removeItem('xray_user');
    setToken(null);
    setUser(null);
    toast.success('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
