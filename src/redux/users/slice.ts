import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SingleUser } from '@/types';
import type { UsersState, FetchUsersPayload, SearchUsersPayload, FetchUserByIdPayload, FilterUsersPayload, UsersResponse, SortUsersPayload } from './types';
import { DEFAULT_PAGE_SIZE, FILTER_TYPE } from '@/constants';

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  skip: 0,
  limit: DEFAULT_PAGE_SIZE,
  searchQuery: '',
  isSearching: false,
  sortByFirstNameOrder: null,
  sortByAgeOrder: null, 
  filters: {
    city: '',
    job: '',
    gender: '',
  },
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Unified Fetch Request
    fetchUsersRequest: (state, action: PayloadAction<FetchUsersPayload>) => {
      state.loading = true;
      state.error = null;
    },

    fetchUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      const skip = action.payload.skip || 0;
      const limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      state.page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
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

    fetchUserByIdSuccess: (state, action: PayloadAction<SingleUser>) => {
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
      state.searchQuery = action.payload.query;
      state.page = 1;
      // Clear filters when search is applied (API doesn't support combining both)
      state.filters = {
        city: '',
        job: '',
        gender: '',
      };
    },

    searchUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.isSearching = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      state.page = 1;
      state.error = null;
    },

    searchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isSearching = false;
      state.error = action.payload;
    },

    // Sort users
    sortUsersRequest: (state, action: PayloadAction<SortUsersPayload>) => {
      state.sortByFirstNameOrder = action.payload.sortByFirstNameOrder;
      state.sortByAgeOrder = action.payload.sortByAgeOrder;
      state.page = 1;
    },

    sortUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;   
      state.total = action.payload.total;
      state.limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      const skip = action.payload.skip || 0;
      const limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      state.page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
      state.error = null;
    },

    sortUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Filter users
    filterUsersRequest: (state, action: PayloadAction<FilterUsersPayload>) => {
      const { type, value } = action.payload;
      // Clear all filters first (only one filter active at a time)
      state.filters = {
        city: '',
        job: '',
        gender: '',
      };
      // Apply the new filter
      if (type === FILTER_TYPE.CITY) state.filters.city = value;
      if (type === FILTER_TYPE.JOB) state.filters.job = value;
      if (type === FILTER_TYPE.GENDER) state.filters.gender = value;
      state.page = 1;
      // Clear search when filter is applied (API doesn't support combining both)
      state.searchQuery = '';
    },

    filterUsersSuccess: (state, action: PayloadAction<UsersResponse>) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      const skip = action.payload.skip || 0;
      const limit = action.payload.limit || DEFAULT_PAGE_SIZE;
      state.page = limit > 0 ? Math.floor(skip / limit) + 1 : 1;
      state.error = null;
    },

    filterUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear sort
    clearSort: (state) => {
      state.sortByFirstNameOrder = null;
      state.sortByAgeOrder = null;
    },

    // Clear filter
    clearFilter: (state) => {
      state.filters = {
        city: '',
        job: '',
        gender: '',
      };
      state.page = 1;
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
