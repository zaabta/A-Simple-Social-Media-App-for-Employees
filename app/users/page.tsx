'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPage,
  selectTotalPages,
  selectHasNextPage,
  selectHasPrevPage,
  selectSearchQuery,
  selectSortField,
  selectSortOrder,
  selectFilterType,
  selectFilterValue,
} from '@/redux/hooks';
import { usersActions } from '@/redux/users/usersActions';
import { calculateSkip } from '@/utils/helpers';
import type { FilterOptions } from '@/redux/users/usersTypes';
import { usersService } from '@/redux/users/usersService';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const page = useAppSelector(selectUsersPage);
  const totalPages = useAppSelector(selectTotalPages);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const hasPrevPage = useAppSelector(selectHasPrevPage);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortField = useAppSelector(selectSortField);
  const sortOrder = useAppSelector(selectSortOrder);
  const filterType = useAppSelector(selectFilterType);
  const filterValue = useAppSelector(selectFilterValue);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [searchInput, setSearchInput] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    jobTitles: [],
    genders: [],
  });

  // Fetch filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await usersService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load filter options', error);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch users on page change, search, filter, or sort
  useEffect(() => {
    const skip = calculateSkip(page, 10);

    if (searchQuery) {
      dispatch(usersActions.searchUsers({ query: searchQuery, skip, limit: 10 }));
    } else if (filterType && filterValue) {
      dispatch(
        usersActions.filterUsers({
          type: filterType,
          value: filterValue,
          skip,
          limit: 10,
        })
      );
    } else if (sortField && sortOrder) {
      dispatch(usersActions.sortUsers({ field: sortField as 'firstName' | 'age' }));
    } else {
      dispatch(usersActions.fetchUsers({ skip, limit: 10 }));
    }
  }, [dispatch, page, searchQuery, filterType, filterValue, sortField, sortOrder]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchInput(query);
      dispatch(usersActions.searchUsers({ query, limit: 10 }));
    } else {
      setSearchInput('');
      dispatch(usersActions.resetSearch());
      dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
    }
  };

  const handleSort = (field: 'firstName' | 'age') => {
    dispatch(usersActions.sortUsers({ field }));
  };

  const handleFilter = (type: 'city' | 'job' | 'gender', value: string) => {
    if (value) {
      dispatch(usersActions.filterUsers({ type, value, skip: 0, limit: 10 }));
    } else {
      dispatch(usersActions.clearFilter());
      dispatch(usersActions.fetchUsers({ skip: 0, limit: 10 }));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      dispatch(usersActions.setPage(page + 1));
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      dispatch(usersActions.setPage(page - 1));
    }
  };

  const getSortButtonClass = (field: 'firstName' | 'age') => {
    const baseClass = 'px-4 py-2 rounded-lg border text-sm font-medium transition-colors ';
    if (sortField === field) {
      if (sortOrder === 'asc') {
        return baseClass + 'bg-blue-500 text-white border-blue-500';
      } else if (sortOrder === 'desc') {
        return baseClass + 'bg-blue-700 text-white border-blue-700';
      }
    }
    return baseClass + 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated && 
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4 items-center justify-left bg-white p-4 rounded-lg shadow">
            <button
              onClick={() => dispatch(usersActions.sortUsers({ field: 'firstName' }))}
              className="bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg">
                sort by first name
              </button>
              <button
                onClick={() => dispatch(usersActions.sortUsers({ field: 'lastName' }))}
                className="bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg"
              >
                sort by last name
              </button>
          </div>
          <div className="flex items-center justify-left bg-white p-4 rounded-lg shadow">
            <select value='city' className="border border-gray-300 rounded-lg bg-white text-sm text-gray-700 py-2 px-4 focus:outline-none"
              onChange={(e) => dispatch(authActions.setRole(e.target.value))}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className='flex gap-2'>
            <div className="border border-gray-300 rounded-lg bg-white flex gap-1 items-center w-full">
              <img src="@/../public/assets/search-icon.svg" alt="Search" className="w-4 h-4 ml-2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search"
                className="w-full px-4 py-1 text-black text-sm border border-none rounded-lg focus:outline-none"
              />
            </div>
            <button
              onClick={() => handleSearch(searchInput)}
              className={`bg-blue-${searchInput ? '500' : '300'} hover:bg-blue-600 text-white py-2 px-4 rounded-md`}
            >
              Search
            </button>
          </div>
        </div>}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">Loading users...</div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">No users found</div>
              </div>
            ) : (
              <>
                {/* User Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users/${user.id}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
                    >
                      <div className="space-y-4">
                        {/* Name */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                        </div>

                        {/* Age and Gender */}
                        <div className="flex gap-4">
                          {user.age && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">Age</p>
                              <p className="text-sm text-gray-700">{user.age}</p>
                            </div>
                          )}
                          {user.gender && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase">Gender</p>
                              <p className="text-sm text-gray-700 capitalize">{user.gender}</p>
                            </div>
                          )}
                        </div>

                        {/* Username */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Username</p>
                          <p className="text-sm text-gray-700">@{user.username}</p>
                        </div>

                        {/* Email */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                          <p className="text-sm text-gray-700 truncate">{user.email}</p>
                        </div>

                        {/* City */}
                        {user.address?.city && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">City</p>
                            <p className="text-sm text-gray-700">{user.address.city}</p>
                          </div>
                        )}

                        {/* Job Title */}
                        {user.job?.title && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Job Title</p>
                            <p className="text-sm text-gray-700">{user.job.title}</p>
                          </div>
                        )}

                        {/* View Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <span className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage || loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage || loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
      </main>
    </div>
  );
}
