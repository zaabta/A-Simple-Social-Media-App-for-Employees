import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from './users/usersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
