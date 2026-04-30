'use client';

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Pre-typed dispatch hook
 * Use this instead of `useDispatch` to get proper type inference
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Pre-typed selector hook
 * Use this instead of `useSelector` to get proper type inference
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Selector for auth state
 */
export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

/**
 * Selectors for users state
 */
export const selectUsers = (state: RootState) => state.users.users;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectUsersTotal = (state: RootState) => state.users.total;
export const selectUsersPage = (state: RootState) => state.users.page;
export const selectUsersLimit = (state: RootState) => state.users.limit;
export const selectSearchQuery = (state: RootState) => state.users.searchQuery;
export const selectIsSearching = (state: RootState) => state.users.isSearching;
export const selectSortField = (state: RootState) => state.users.sortField;
export const selectSortOrder = (state: RootState) => state.users.sortOrder;
export const selectFilterType = (state: RootState) => state.users.filterType;
export const selectFilterValue = (state: RootState) => state.users.filterValue;

/**
 * Derived selectors
 */
export const selectTotalPages = (state: RootState) => {
  const { total, limit } = state.users;
  return Math.ceil(total / limit);
};

export const selectHasNextPage = (state: RootState) => {
  const { page } = state.users;
  const totalPages = selectTotalPages(state);
  return page < totalPages;
};

export const selectHasPrevPage = (state: RootState) => {
  const { page } = state.users;
  return page > 1;
};
