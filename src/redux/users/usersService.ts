import { apiClient } from '@/services/apiClient';
import type { User, UsersResponse } from '@/types/global';
import type { FetchUsersPayload, SearchUsersPayload, SortUsersPayload, FilterUsersPayload, FilterOptions } from './usersTypes';

export const usersService = {
  fetchUsers: async (payload: FetchUsersPayload): Promise<UsersResponse> => {
    const { skip = 0, limit = 10 } = payload;
    const response = await apiClient.get<UsersResponse>(
      `/users?skip=${skip}&limit=${limit}`
    );
    return response;
  },

  fetchUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  },

  searchUsers: async (payload: SearchUsersPayload): Promise<UsersResponse> => {
    const { query, skip = 0, limit = 10 } = payload;
    const response = await apiClient.post<UsersResponse>(`/users/search`, {
      q: query,
      skip,
      limit,
    });
    return response;
  },

  sortUsers: async (payload: SortUsersPayload & FetchUsersPayload): Promise<UsersResponse> => {
    const { field, skip = 0, limit = 10 } = payload;
    let sortBy = 'firstName';
    if (field === 'age') {
      sortBy = 'age';
    }
    const response = await apiClient.get<UsersResponse>(
      `/users?skip=${skip}&limit=${limit}&sortBy=${sortBy}`
    );
    return response;
  },

  filterUsers: async (payload: FilterUsersPayload): Promise<UsersResponse> => {
    const { type, value, skip = 0, limit = 10 } = payload;
    let filterKey = 'city';
    if (type === 'job') {
      filterKey = 'jobTitle';
    } else if (type === 'gender') {
      filterKey = 'gender';
    }
    const response = await apiClient.get<UsersResponse>(
      `/users?skip=${skip}&limit=${limit}&${filterKey}=${encodeURIComponent(value)}`
    );
    return response;
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    try {
      // Fetch a large number of users to extract unique values
      const response = await apiClient.get<UsersResponse>('/users?skip=0&limit=30');
      const cities = new Set<string>();
      const jobTitles = new Set<string>();
      const genders = new Set<string>();
      
      if (response.users && Array.isArray(response.users)) {
        response.users.forEach(user => {
          if (user.address?.city) cities.add(user.address.city);
          if (user.job?.title) jobTitles.add(user.job.title);
          if (user.gender) genders.add(user.gender);
        });
      }

      return {
        cities: Array.from(cities).sort(),
        jobTitles: Array.from(jobTitles).sort(),
        genders: Array.from(genders).sort(),
      };
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
      return {
        cities: [],
        jobTitles: [],
        genders: [],
      };
    }
  },

  getUsersCount: async (): Promise<number> => {
    const response = await apiClient.get<UsersResponse>('/users?skip=0&limit=1');
    return response.total;
  },
};
