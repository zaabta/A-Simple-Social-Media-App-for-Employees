/**
 * Redux Store and Hooks Export
 * Import your Redux dependencies from this file
 */

// Store
export { store } from './store';
export type { AppDispatch, RootState } from './store';

// Hooks
export {
  useAppDispatch,
  useAppSelector,
  selectAuth,
  selectAuthUser,
  selectAuthToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUsers,
  selectSelectedUser,
  selectUsersLoading,
  selectUsersError,
  selectUsersTotal,
  selectUsersPage,
  selectUsersLimit,
  selectSearchQuery,
  selectIsSearching,
  selectTotalPages,
  selectHasNextPage,
  selectHasPrevPage,
} from './hooks';

// Auth
export { default as authReducer } from './auth/slice';
export { authSaga } from './auth/saga';
export { authActions } from './auth/actions';
export type { AuthState, LoginPayload, AuthResponse } from './auth/types';

// Users
export { default as usersReducer } from './users/slice';
export { usersSaga } from './users/saga';
export { usersActions } from './users/actions';
export type {
  UsersState,
  FetchUsersPayload,
  SearchUsersPayload,
  FetchUserByIdPayload,
} from './users/types';
