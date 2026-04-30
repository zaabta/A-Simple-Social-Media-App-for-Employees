import {
  fetchUsersRequest,
  fetchUserByIdRequest,
  searchUsersRequest,
  sortUsersRequest,
  filterUsersRequest,
  clearSort,
  clearFilter,
  setPage,
  setLimit,
  clearSelectedUser,
  clearUsersError,
  resetSearch,
} from './slice';
import type {
  FetchUsersPayload,
  FetchUserByIdPayload,
  SearchUsersPayload,
  SortUsersPayload,
  FilterUsersPayload,
} from './types';

export const usersActions = {
  fetchUsers: (payload: FetchUsersPayload) => fetchUsersRequest(payload),
  fetchUserById: (payload: FetchUserByIdPayload) => fetchUserByIdRequest(payload),
  searchUsers: (payload: SearchUsersPayload) => searchUsersRequest(payload),
  sortUsers: (payload: SortUsersPayload) => sortUsersRequest(payload),
  filterUsers: (payload: FilterUsersPayload) => filterUsersRequest(payload),
  clearSort: () => clearSort(),
  clearFilter: () => clearFilter(),
  setPage: (page: number) => setPage(page),
  setLimit: (limit: number) => setLimit(limit),
  clearSelectedUser: () => clearSelectedUser(),
  clearError: () => clearUsersError(),
  resetSearch: () => resetSearch(),
};
