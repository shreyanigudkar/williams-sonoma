import { useEffect } from 'react';
import { useAuthStore } from '../context/store';
import api from '../services/api';

export const useAuth = () => {
  const { user, token, setUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const response = await api.getMe();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    };

    initAuth();
  }, [setUser]);

  return { user, token, isAuthenticated: !!token };
};

export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

import React from 'react';
