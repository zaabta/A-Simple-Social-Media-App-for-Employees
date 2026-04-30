import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UsersResponse } from '@/types/global';
import type { UsersState, FetchUsersPayload, SearchUsersPayload, FetchUserByIdPayload, SortUsersPayload, FilterUsersPayload } from './usersTypes';

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  searchQuery: '',
  isSearching: false,
  sortField: null,
  sortOrder: null,
  filterType: null,
  filterValue: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Fetch users
    fetchUsersRequest: (state, action: PayloadAction<FetchUsersPayload>) => {
      state.loading = true;
      state.error = null;
    },

    fetchUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit;
      state.page = Math.floor(action.payload.skip / action.payload.limit) + 1;
      state.error = null;
    },

    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch user by ID
    fetchUserByIdRequest: (state, action: PayloadAction<FetchUserByIdPayload>) => {
      state.loading = true;
      state.error = null;
    },

    fetchUserByIdSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.selectedUser = action.payload;
      state.error = null;
    },

    fetchUserByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Search users
    searchUsersRequest: (state, action: PayloadAction<SearchUsersPayload>) => {
      state.isSearching = true;
      state.searchQuery = action.payload.query;
      state.error = null;
      state.page = 1;
      state.filterType = null;
      state.filterValue = null;
      state.sortField = null;
      state.sortOrder = null;
    },

    searchUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.isSearching = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit;
      state.page = 1;
      state.error = null;
    },

    searchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isSearching = false;
      state.error = action.payload;
    },

    // Sort users
    sortUsersRequest: (state, action: PayloadAction<SortUsersPayload>) => {
      state.loading = true;
      state.error = null;
      state.page = 1;
      state.searchQuery = '';
      state.filterType = null;
      state.filterValue = null;

      // Toggle sort order: asc -> desc -> null -> asc
      if (state.sortField === action.payload.field) {
        if (state.sortOrder === 'asc') {
          state.sortOrder = 'desc';
        } else if (state.sortOrder === 'desc') {
          state.sortOrder = null;
          state.sortField = null;
        } else {
          state.sortOrder = 'asc';
          state.sortField = action.payload.field;
        }
      } else {
        state.sortField = action.payload.field;
        state.sortOrder = 'asc';
      }
    },

    sortUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit;
      state.page = Math.floor(action.payload.skip / action.payload.limit) + 1;
      state.error = null;
    },

    sortUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filter users
    filterUsersRequest: (state, action: PayloadAction<FilterUsersPayload>) => {
      state.loading = true;
      state.error = null;
      state.page = 1;
      state.searchQuery = '';
      state.sortField = null;
      state.sortOrder = null;
      state.filterType = action.payload.type;
      state.filterValue = action.payload.value;
    },

    filterUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit;
      state.page = Math.floor(action.payload.skip / action.payload.limit) + 1;
      state.error = null;
    },

    filterUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear sort
    clearSort: (state) => {
      state.sortField = null;
      state.sortOrder = null;
    },

    // Clear filter
    clearFilter: (state) => {
      state.filterType = null;
      state.filterValue = null;
    },

    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },

    // Clear selected user
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    // Clear error
    clearUsersError: (state) => {
      state.error = null;
    },

    // Reset search
    resetSearch: (state) => {
      state.searchQuery = '';
      state.page = 1;
    },
  },
});

export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserByIdRequest,
  fetchUserByIdSuccess,
  fetchUserByIdFailure,
  searchUsersRequest,
  searchUsersSuccess,
  searchUsersFailure,
  sortUsersRequest,
  sortUsersSuccess,
  sortUsersFailure,
  filterUsersRequest,
  filterUsersSuccess,
  filterUsersFailure,
  clearSort,
  clearFilter,
  setPage,
  setLimit,
  clearSelectedUser,
  clearUsersError,
  resetSearch,
} = usersSlice.actions;

export default usersSlice.reducer;
