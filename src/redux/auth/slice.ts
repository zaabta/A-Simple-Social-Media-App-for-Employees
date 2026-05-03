import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthResponse, LoginPayload, AuthUser } from './types';
import { setCookie, removeCookie } from '@/utils/cookies';
import { AUTH_COOKIE_OPTIONS, AUTH_TOKEN, AUTH_USER, AuthSliceName } from '@/constants';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: AuthSliceName,
  initialState,
  reducers: {
    loginRequest: (state, action: PayloadAction<LoginPayload>) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        image: action.payload.image,
        gender: action.payload.gender,
      };
      state.error = null;
      // Persist token in both sessionStorage and cookies
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(AUTH_TOKEN, action.payload.accessToken);
        sessionStorage.setItem(AUTH_USER, JSON.stringify(state.user));
        setCookie(AUTH_TOKEN, action.payload.accessToken, AUTH_COOKIE_OPTIONS);
        setCookie(AUTH_USER, JSON.stringify(state.user), AUTH_COOKIE_OPTIONS);
      }
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },

    logoutRequest: (state) => {
      state.loading = true;
    },

    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(AUTH_TOKEN);
        sessionStorage.removeItem(AUTH_USER);
        removeCookie(AUTH_TOKEN);
        removeCookie(AUTH_USER);
      }
    },

    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Rehydrate from session storage
    rehydrateAuth: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  rehydrateAuth,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
