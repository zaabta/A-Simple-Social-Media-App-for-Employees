import { apiClient } from '@/services/apiClient';
import type { User, UsersResponse } from '@/types';
import type { FetchUsersPayload, SearchUsersPayload, SortUsersPayload, FilterUsersPayload, FilterOptions } from './types';
import { capitalize } from '@/utils';
import { SORT_FIELDS } from '@/constants';

export const usersService = {
  fetchUsers: async (payload: FetchUsersPayload): Promise<UsersResponse> => {
    const { skip = 0, limit = 15, query, sortByFirstNameOrder, sortByAgeOrder, filters } = payload;

    let baseUrl = '/users';
    const queryParams: string[] = [`skip=${skip}`, `limit=${limit}`];

    // Determine the base URL and primary search/filter param
    if (query) {
      baseUrl = '/users/search';
      queryParams.push(`q=${encodeURIComponent(query)}`);
    } else if (filters) {
      // API only supports one filter at a time.
      let filterKey = '';
      let filterValue = '';

      if (filters.city) {
        filterKey = 'address.city';
        filterValue = filters.city;
      } else if (filters.job) {
        filterKey = 'company.title';
        filterValue = filters.job;
      } else if (filters.gender) {
        filterKey = 'gender';
        filterValue = filters.gender;
      }

      if (filterKey && filterValue) {
        baseUrl = '/users/filter';
        queryParams.push(`key=${encodeURIComponent(filterKey)}`);
        queryParams.push(`value=${encodeURIComponent(filterValue)}`);
      }
    }

    // Add sorting params
    if (sortByFirstNameOrder) {
      queryParams.push(`sortBy=${SORT_FIELDS.FIRST_NAME}`);
      queryParams.push(`order=${sortByFirstNameOrder}`);
    } else if (sortByAgeOrder) {
      queryParams.push(`sortBy=${SORT_FIELDS.AGE}`);
      queryParams.push(`order=${sortByAgeOrder}`);
    }

    const fullUrl = `${baseUrl}?${queryParams.join('&')}`;
    const response = await apiClient.get<UsersResponse>(fullUrl);
    return response;
  },

  fetchUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response;
  },



  searchUsers: async (payload: SearchUsersPayload & Partial<SortUsersPayload>): Promise<UsersResponse> => {
    const { query, skip = 0, limit = 15, sortByFirstNameOrder, sortByAgeOrder } = payload;
    
    let queryParams = `/users/search?q=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`;
    
    // Add sorting if provided
    if (sortByFirstNameOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.FIRST_NAME}&order=${sortByFirstNameOrder}`;
    } else if (sortByAgeOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.AGE}&order=${sortByAgeOrder}`;
    }
    
    if (sortByFirstNameOrder && sortByAgeOrder) {
      queryParams += `&sortBy2=${SORT_FIELDS.AGE}&order2=${sortByAgeOrder}`;
    }
    
    const response = await apiClient.get<UsersResponse>(queryParams);
    return response;
  },

  sortUsers: async (payload: SortUsersPayload & FetchUsersPayload): Promise<UsersResponse> => {
    const { sortByAgeOrder, sortByFirstNameOrder, skip = 0, limit = 15 } = payload;

    let queryParams = `/users?skip=${skip}&limit=${limit}`;

    // If both sorts are active, prioritize firstName first, then add age
    if (sortByFirstNameOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.FIRST_NAME}&order=${sortByFirstNameOrder}`;
    } else if (sortByAgeOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.AGE}&order=${sortByAgeOrder}`;
    }
    
    // Add secondary sort if both are set
    if (sortByFirstNameOrder && sortByAgeOrder) {
      queryParams += `&sortBy2=${SORT_FIELDS.AGE}&order2=${sortByAgeOrder}`;
    }
    
    const response = await apiClient.get<UsersResponse>(queryParams);

    return response;
  },

  filterUsers: async (payload: FilterUsersPayload & Partial<SortUsersPayload>): Promise<UsersResponse> => {
    const { type, value, skip = 0, limit = 15, sortByFirstNameOrder, sortByAgeOrder } = payload;
    
    let queryParams = `/users/filter?key=${encodeURIComponent(type)}&value=${encodeURIComponent(value)}&skip=${skip}&limit=${limit}`;
    
    // Add sorting if provided
    if (sortByFirstNameOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.FIRST_NAME}&order=${sortByFirstNameOrder}`;
    } else if (sortByAgeOrder) {
      queryParams += `&sortBy=${SORT_FIELDS.AGE}&order=${sortByAgeOrder}`;
    }
    
    if (sortByFirstNameOrder &&
       sortByAgeOrder) {
      queryParams += `&sortBy2=${SORT_FIELDS.AGE}&order2=${sortByAgeOrder}`;
    }
    
    const response = await apiClient.get<UsersResponse>(queryParams);
    return response;
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    try {
      // Fetch all users to get complete filter options
      const response = await apiClient.get<UsersResponse>('/users?limit=0');

      const cities = new Set<string>();
      const jobTitles = new Set<string>();
      const genders = new Set<string>();

      if (response.users && Array.isArray(response.users)) {
        response.users.forEach(user => {
          if (user.address?.city) cities.add(user.address.city);
          if (user.company?.title) jobTitles.add(user.company.title);
          if (user.gender) genders.add(user.gender);
        });
      }

      const cityOptions = Array.from(cities)
        .map(value => ({ value, label: value }))
      
        .sort((a, b) => a.label.localeCompare(b.label));

      const jobOptions = Array.from(jobTitles)
        .map(value => ({ value, label: value }))
        .sort((a, b) => a.label.localeCompare(b.label));

      const genderOptions = Array.from(genders)
        .map(value => ({ value, label: capitalize(value) }))
        .sort((a, b) => a.label.localeCompare(b.label));

      return {
        cities: [{ value: '', label: 'All Cities' }, ...cityOptions],
        jobTitles: [{ value: '', label: 'All Titles' }, ...jobOptions],
        genders: [{ value: '', label: 'All Genders' }, ...genderOptions],
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
