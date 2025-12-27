/**
 * useAuth Hook - Authentication with Local API
 * Manages user authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { authApi, LoginCredentials, RegisterData, User, ApiError } from '../services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const user = await authApi.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token might be invalid
          authApi.logout();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login(credentials);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(`Welcome back, ${response.user.full_name}!`);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.error(apiError.detail || 'Login failed');
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.register(data);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      toast.success(`Welcome, ${response.user.full_name}!`);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.error(apiError.detail || 'Registration failed');
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success('Logged out successfully');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.getCurrentUser();
      setAuthState(prev => ({ ...prev, user }));
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.detail || 'Failed to refresh user data');
      throw error;
    }
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    refreshUser,
  };
}

export default useAuth;
