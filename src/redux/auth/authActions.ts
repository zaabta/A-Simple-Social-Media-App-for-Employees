import { loginRequest, logoutRequest, clearAuthError, rehydrateAuth } from './authSlice';
import type { LoginPayload, RehydrateAuthPayload } from './authTypes';

export const authActions = {
  login: (credentials: LoginPayload) => loginRequest(credentials),
  logout: () => logoutRequest(),
  clearError: () => clearAuthError(),
  rehydrate: (payload: RehydrateAuthPayload) => rehydrateAuth(payload),
};
