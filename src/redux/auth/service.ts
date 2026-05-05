import { apiClient } from '@/services/apiClient';
import type { LoginPayload, AuthResponse } from './types';
import { API_ENDPOINTS, AUTH_TOKEN } from '@/constants';

export const authService = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_TOKEN);
    }
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ valid: boolean }>(API_ENDPOINTS.AUTH.VALIDATE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response?.valid ?? false;
    } catch {
      return false;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response;
  },
};
