import { apiClient } from '@/services/apiClient';
import type { LoginPayload, AuthResponse } from './authTypes';

export const authService = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response;
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('authToken');
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ valid: boolean }>('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.valid ?? false;
    } catch {
      return false;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response;
  },
};
