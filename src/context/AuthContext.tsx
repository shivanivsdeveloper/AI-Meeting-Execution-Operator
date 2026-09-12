import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Workspace } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  register: (name: string, email: string, role: string) => Promise<void>;
  logout: () => void;
  loadDemoSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial fetch
    const initAuth = async () => {
      try {
        const data = await api.getMe();
        if (data.user) {
          setUser(data.user);
          setWorkspace(data.workspace);
        }
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email?: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setWorkspace(res.workspace);
      localStorage.setItem('meetflow_token', res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, role: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, role);
      setUser(res.user);
      setWorkspace(res.workspace);
      localStorage.setItem('meetflow_token', res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setWorkspace(null);
    localStorage.removeItem('meetflow_token');
  };

  const loadDemoSession = async () => {
    await login('shivani@meetflow.ai', 'demopassword');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loadDemoSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
