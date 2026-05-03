import { loginRequest, logoutRequest, clearAuthError, rehydrateAuth } from './slice';
import type { LoginPayload, RehydrateAuthPayload } from './types';

export const authActions = {
  login: (credentials: LoginPayload) => loginRequest(credentials),
  logout: () => logoutRequest(),
  clearError: () => clearAuthError(),
  rehydrate: (payload: RehydrateAuthPayload) => rehydrateAuth(payload),
};
