import { GENDER } from "@/constants";

export interface Address {
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  postalCode: string;
  state: string;
  stateCode: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  phone: string;
  gender: GENDER;
  age: number;
  company: {
    title: string;
    name: string;
    address: Address
  };
  address: Address;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: GENDER;
  image: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface PaginationParams {
  skip: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchParams {
  q: string;
  skip?: number;
  limit?: number;
}
