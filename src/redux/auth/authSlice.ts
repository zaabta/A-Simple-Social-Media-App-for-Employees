import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthResponse, LoginPayload, User } from './authTypes';
import { use } from 'react';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
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
      // Persist token
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authToken', action.payload.accessToken);
        sessionStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },

    // Logout actions
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
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
      }
    },

    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Rehydrate from session storage
    rehydrateAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    },

    // Clear error
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
