import { apiClient } from '@/services/apiClient';
import type { UsersResponse } from './types';
import type {
  FetchUsersPayload,
  FilterOptions,
  PostsResponse,
} from './types';
import { capitalize, mapOptions } from '@/utils';
import { API_ENDPOINTS, FILTER_TYPE, SingleUser, SORT_FIELDS } from '@/index';

export const usersService = {
  fetchUsers: async (payload: FetchUsersPayload): Promise<UsersResponse> => {
    const {
      skip = 0,
      limit = 15,
      query,
      filters,
      sortByFirstNameOrder,
      sortByAgeOrder,
      firstName,
      age,
    } = payload;

    const sortFirstName = firstName ?? sortByFirstNameOrder;
    const sortAge = age ?? sortByAgeOrder;

    let baseUrl = API_ENDPOINTS.USERS.LIST;
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    if (query) {
      baseUrl = API_ENDPOINTS.USERS.SEARCH;
      params.append('q', query);
    } else if (filters) {
      let key = '';
      let value = '';

      if (filters.city) { key = FILTER_TYPE.CITY; value = filters.city; }
      else if (filters.job) { key = FILTER_TYPE.JOB; value = filters.job; }
      else if (filters.gender) { key = FILTER_TYPE.GENDER; value = filters.gender; }

      if (key && value) {
        baseUrl = API_ENDPOINTS.USERS.FILTER;
        params.append('key', key);
        params.append('value', value);
      }
    }

    if (sortFirstName) {
      params.append('sortBy', SORT_FIELDS.FIRST_NAME);
      params.append('order', sortFirstName);
    } else if (sortAge) {
      params.append('sortBy', SORT_FIELDS.AGE);
      params.append('order', sortAge);
    }

    return apiClient.get<UsersResponse>(`${baseUrl}?${params.toString()}`);
  },

  fetchUserById: async (id: number): Promise<SingleUser> => {
    return apiClient.get<SingleUser>(API_ENDPOINTS.USERS.BY_ID(id));
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    try {
      const response = await apiClient.get<UsersResponse>(API_ENDPOINTS.USERS.ALL);

      const cities = new Set<string>();
      const jobTitles = new Set<string>();
      const genders = new Set<string>();

      response.users?.forEach(user => {
        if (user.address?.city) cities.add(user.address.city);
        if (user.company?.title) jobTitles.add(user.company.title);
        if (user.gender) genders.add(user.gender);
      });

      return {
        cities: mapOptions(cities, v => v, 'All Cities'),
        jobTitles: mapOptions(jobTitles, v => v, 'Job Titles'),
        genders: mapOptions(genders, v => capitalize(v), 'All Genders'),
      };
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
      return { cities: [], jobTitles: [], genders: [] };
    }
  },

  getUsersCount: async (): Promise<number> => {
    const response = await apiClient.get<UsersResponse>(`${API_ENDPOINTS.USERS.LIST}?limit=1`);
    return response.total;
  },

  getUserPosts: async (userId: number, skip: number = 0, limit: number = 10): Promise<PostsResponse> => {
    try {
      return await apiClient.get<PostsResponse>(API_ENDPOINTS.USERS.POSTS(userId, skip, limit));
    } catch (error) {
      console.error(`Failed to fetch posts for user ${userId}:`, error);
      throw error;
    }
  },
};