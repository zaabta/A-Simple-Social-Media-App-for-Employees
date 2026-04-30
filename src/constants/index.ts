export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com';
export const API_TIMEOUT = 30000; // 30 seconds

export const DEFAULT_PAGE_SIZE = 15;
export const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 50];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  USERS: '/users',
  USER_DETAIL: (id: number) => `/users/${id}`,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  REFRESH_TOKEN: 'refreshToken',
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  NOT_FOUND: 'Resource not found.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  FETCH_SUCCESS: 'Data fetched successfully.',
};

export enum GENDER { MALE = 'male', FEMALE = 'female' };

export enum FILTER_TYPE {
  CITY = 'city',
  JOB = 'company.title',
  GENDER = 'gender',
}

export enum SORT_ORDERS {
  ASC= 'asc',
  DESC= 'desc',
};

export enum SORT_FIELDS {
  FIRST_NAME = 'firstName',
  AGE = 'age',
}
