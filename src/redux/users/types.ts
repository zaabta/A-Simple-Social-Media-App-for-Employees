import { Options } from '@/components/DropDown';
import { FILTER_TYPE, SORT_ORDERS } from '@/index';
import type { User } from '@/types';

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  isSearching: boolean;
  sortByFirstNameOrder: SORT_ORDERS | null;
  sortByAgeOrder: SORT_ORDERS | null;
  filters: {
    city: string;
    job: string;
    gender: string;
  };
}

export interface FetchUsersPayload {
  skip?: number;
  limit?: number;
  query?: string;
  sortByFirstNameOrder?: SORT_ORDERS | null;
  sortByAgeOrder?: SORT_ORDERS | null;
  filters?: {
    city?: string;
    job?: string;
    gender?: string;
  };
}

export interface SearchUsersPayload {
  query: string;
  skip?: number;
  limit?: number;
}

export interface FetchUserByIdPayload {
  id: number;
}

export interface SortUsersPayload {
  sortByFirstNameOrder: SORT_ORDERS | null;
  sortByAgeOrder: SORT_ORDERS | null;
}

export interface FilterUsersPayload {
  type: FILTER_TYPE;
  value: string;
  skip?: number;
  limit?: number;
}

export interface FilterOptions {
  cities: Options[];
  jobTitles: Options[];
  genders: Options[];
}
