'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  selectIsAuthenticated,
  useAppDispatch,
  useAppSelector,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPage,
  selectHasNextPage,
  selectHasPrevPage,
  selectSearchQuery,
  selectUsersTotal,
  selectUsersLimit,
  selectSortOrderByFirstName,
  selectSortOrderByAge,
} from '@/redux/hooks';
import { usersActions } from '@/redux/users/actions';
import { calculateSkip, toggleSortOrder } from '@/utils';
import type { FilterOptions } from '@/redux/users/types';
import { usersService } from '@/redux/users/service';
import { DropDown, Pagination, UserCard } from '@/components';
import { DEFAULT_PAGE_SIZE, FILTER_TYPE, SORT_FIELDS, SORT_ORDERS } from '@/constants';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const page = useAppSelector(selectUsersPage);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const hasPrevPage = useAppSelector(selectHasPrevPage);
  const total = useAppSelector(selectUsersTotal);
  const limit = useAppSelector(selectUsersLimit);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortByFirstNameOrder = useAppSelector(selectSortOrderByFirstName);
  const sortByAgeOrder = useAppSelector(selectSortOrderByAge);
  const filters = useAppSelector(state => state.users.filters);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [searchInput, setSearchInput] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    cities: [],
    jobTitles: [],
    genders: [],
  });

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

  useEffect(() => {
    const hasActiveFilter = filters.city || filters.job || filters.gender;
    if (hasActiveFilter) {
      setSearchInput('');
    }
  }, [filters]);

  useEffect(() => {
    if (searchQuery && searchInput !== searchQuery) {
      setSearchInput(searchQuery);
    }
  }, [searchQuery]);

  // Single useEffect to handle all fetching based on state changes
  useEffect(() => {
    const skip = calculateSkip(page, DEFAULT_PAGE_SIZE);
    dispatch(usersActions.fetchUsers({ skip, limit: DEFAULT_PAGE_SIZE }));
  }, [dispatch, page, searchQuery, filters, sortByFirstNameOrder, sortByAgeOrder]);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    if (!query.trim()) {
      dispatch(usersActions.resetSearch());
    } else {
      dispatch(usersActions.searchUsers({ query, skip: 0, limit: DEFAULT_PAGE_SIZE }));
    }
  };

  const handleFilter = (type: FILTER_TYPE, value: string) => {
    dispatch(usersActions.filterUsers({ type, value, skip: 0, limit: DEFAULT_PAGE_SIZE }));
  };

  const handleSort = (sortField: SORT_FIELDS) => {
    if (sortField === SORT_FIELDS.FIRST_NAME) {
      dispatch(usersActions.sortUsers({
        sortByFirstNameOrder: toggleSortOrder(sortByFirstNameOrder),
        sortByAgeOrder
      }));
    } else {
      dispatch(usersActions.sortUsers({
        sortByAgeOrder: toggleSortOrder(sortByAgeOrder),
        sortByFirstNameOrder
      }));
    }
  };

  const handleCardClick = (userId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push(`/users/${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAuthenticated &&
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4 items-center justify-left bg-white p-4 rounded-lg shadow">
              <button
                onClick={() => handleSort(SORT_FIELDS.FIRST_NAME)}
                className="flex gap-2 bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg">
                sort by first name
                {sortByFirstNameOrder && <img src={`/assets/${sortByFirstNameOrder === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`} alt="Sort" className="w-4 h-4 inline-block ml-1" />}
              </button>
              <button
                onClick={() => handleSort(SORT_FIELDS.AGE)}
                className="flex gap-2 bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg"
              >
                sort by age
                {sortByAgeOrder && <img src={`/assets/${sortByAgeOrder === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`} alt="Sort" className="w-4 h-4 inline-block ml-1" />}
              </button>
            </div>
            <div className="flex items-center justify-left gap-4 bg-white p-4 rounded-lg shadow">
              <DropDown
                label="City"
                options={filterOptions.cities}
                value={filters.city}
                onSelect={(value) => handleFilter(FILTER_TYPE.CITY, value)}
              />
              <DropDown
                label="Title"
                options={filterOptions.jobTitles}
                value={filters.job}
                onSelect={(value) => handleFilter(FILTER_TYPE.JOB, value)}
              />
              <DropDown
                label="Gender"
                options={filterOptions.genders}
                value={filters.gender}
                onSelect={(value) => handleFilter(FILTER_TYPE.GENDER, value)}
              />
            </div>
            <div className='flex gap-2'>
              <div className="border border-gray-300 rounded-lg bg-white flex gap-1 items-center w-full px-2">
                <img src="/assets/search.svg" alt="Search" className="w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search"
                  className="w-full px-0 py-1 text-black text-sm border border-none rounded-lg focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleSearch(searchInput)}
                disabled={loading || !searchInput.trim()}
                className={`bg-blue-${searchInput.trim() ? '600' : '100'} w-25 flex gap-x-0.5 items-center justify-left text-white text-sm py-2 px-2 rounded-md`}
              >
                <img src="/assets/search.svg" alt="Search" className="w-5 h-5" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  name={`${user.firstName} ${user.lastName}`}
                  age={user.age || 0}
                  gender={user.gender}
                  avatar={user.image}
                  email={user.email}
                  username={user.username}
                  city={user.address?.city}
                  job={user.company?.title}
                  onClick={() => handleCardClick(user.id)}
                />
              ))}
            </div>

            <Pagination
              page={page}
              total={total}
              startIndex={total === 0 ? 0 : (page - 1) * limit + 1}
              endIndex={total === 0 ? 0 : Math.min(page * limit, total)}
              hasPrevPage={hasPrevPage}
              hasNextPage={hasNextPage}
              isLoading={loading}
              handlePrevPage={() => hasNextPage && dispatch(usersActions.setPage(page - 1))}
              handleNextPage={() => hasNextPage && dispatch(usersActions.setPage(page + 1))}
              handlePageClick={(page) => dispatch(usersActions.setPage(page))}
            />
          </>
        )}
      </main>
    </div>
  );
}
