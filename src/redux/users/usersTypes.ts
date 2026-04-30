import type { User, UsersResponse } from '@/types/global';

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
  sortField: string | null;
  sortOrder: 'asc' | 'desc' | null;
  filterType: 'city' | 'job' | 'gender' | null;
  filterValue: string | null;
}

export interface FetchUsersPayload {
  skip?: number;
  limit?: number;
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
  field: 'firstName' | 'age';
}

export interface FilterUsersPayload {
  type: 'city' | 'job' | 'gender';
  value: string;
  skip?: number;
  limit?: number;
}

export interface FilterOptions {
  cities: string[];
  jobTitles: string[];
  genders: string[];
}
