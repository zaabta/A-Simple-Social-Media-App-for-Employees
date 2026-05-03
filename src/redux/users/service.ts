import { apiClient } from '@/services/apiClient';
import type { UsersResponse } from './types';
import type {
  FetchUsersPayload,
  FilterOptions,
  PostsResponse,
} from './types';
import { capitalize } from '@/utils';
import { FILTER_TYPE } from '@/index';

export const usersService = {
  fetchUsers: async (payload: FetchUsersPayload): Promise<UsersResponse> => {
    const {
      skip = 0,
      limit = 15,
      query,
      filters,
      sortByFirstNameOrder,
      sortByAgeOrder,
    } = payload;

    let baseUrl = '/users';
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    // 🔍 SEARCH
    if (query) {
      baseUrl = '/users/search';
      params.append('q', query);
    }

    // 🎯 FILTER (only one at a time - API limitation)
    else if (filters) {
      let key = '';
      let value = '';

      if (filters.city) {
        key = FILTER_TYPE.CITY;
        value = filters.city;
      } else if (filters.job) {
        key = FILTER_TYPE.JOB;
        value = filters.job;
      } else if (filters.gender) {
        key = FILTER_TYPE.GENDER;
        value = filters.gender;
      }

      if (key && value) {
        baseUrl = '/users/filter';
        params.append('key', key);
        params.append('value', value);
      }
    }

    // 🔄 SORT (only one primary sort)
    if (sortByFirstNameOrder) {
      params.append('sortBy', 'firstName');
      params.append('order', sortByFirstNameOrder);
    } else if (sortByAgeOrder) {
      params.append('sortBy', 'age');
      params.append('order', sortByAgeOrder);
    }

    const response = await apiClient.get<UsersResponse>(
      `${baseUrl}?${params.toString()}`
    );

    return response;
  },

  fetchUserById: async (id: number): Promise<UsersResponse> => {
    return apiClient.get<UsersResponse>(`/users/${id}`);
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    try {
      const response = await apiClient.get<UsersResponse>('/users?limit=0');

      const cities = new Set<string>();
      const jobTitles = new Set<string>();
      const genders = new Set<string>();

      response.users?.forEach(user => {
        if (user.address?.city) cities.add(user.address.city);
        if (user.company?.title) jobTitles.add(user.company.title);
        if (user.gender) genders.add(user.gender);
      });

      const mapOptions = (set: Set<string>, format?: (v: string) => string) =>
        [
          { value: '', label: 'All' },
          ...Array.from(set)
            .sort()
            .map(value => ({
              value,
              label: format ? format(value) : value,
            })),
        ];

      return {
        cities: mapOptions(cities, v => v),
        jobTitles: mapOptions(jobTitles, v => v),
        genders: mapOptions(genders, v => capitalize(v)),
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
    const response = await apiClient.get<UsersResponse>('/users?limit=1');
    return response.total;
  },

  getUserPosts: async (userId: number, skip: number = 0, limit: number = 10): Promise<PostsResponse> => {
      try {
        const response = await apiClient.get<PostsResponse>(
          `/users/${userId}/posts?skip=${skip}&limit=${limit}`
        );
        return response;
      } catch (error) {
        console.error(`Failed to fetch posts for user ${userId}:`, error);
        throw error;
      }
    }
};