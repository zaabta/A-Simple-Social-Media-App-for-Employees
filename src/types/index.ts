import { GENDER, SAME_SITE } from "@/constants";

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

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: SAME_SITE;
}