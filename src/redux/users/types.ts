import { Options } from '@/components/DropDown';
import { FILTER_TYPE, SORT_FIELDS, SORT_ORDERS } from '@/index';
import type { PaginationParams, User } from '@/types';

export interface UsersState extends PaginationParams {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
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

export interface FetchUsersPayload extends PaginationParams {
  query?: string;
  sortByFirstNameOrder?: SORT_ORDERS | null;
  sortByAgeOrder?: SORT_ORDERS | null;
  sortOrder?: SORT_ORDERS | null;
  filters?: {
    city?: string;
    job?: string;
    gender?: string;
  };
}

export interface FetchUserByIdPayload {
  id: number;
}

export interface FilterUsersPayload extends PaginationParams {
  type: FILTER_TYPE;
  value: string;
}

export interface FilterOptions {
  cities: Options[];
  jobTitles: Options[];
  genders: Options[];
}


export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions?: {
    likes?: number;
    dislikes?: number;
  };
}

export interface PostsResponse extends PaginationParams {
  posts: Post[];
  total: number;
}

export interface SearchUsersPayload extends PaginationParams {
  query: string;
}

export interface UsersResponse extends PaginationParams {
  users: User[];
  total: number;
}

export interface SortUsersPayload {
  sortByFirstNameOrder: SORT_ORDERS | null;
  sortByAgeOrder: SORT_ORDERS | null;
}

