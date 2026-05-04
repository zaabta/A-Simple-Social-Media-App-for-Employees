import { usersService } from '@/redux/users/service';
import { AUTH_FIELDS, AUTH_TOKEN, DEFAULT_PAGE_SIZE, GUEST_FIELDS, SORT_ORDERS } from '@/constants';
import { FilterControls, SortControls, SearchBar, UserCard, Pagination } from '@/components';
import { cookies } from 'next/headers';

export interface UsersPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortFirstName?: SORT_ORDERS | null;
    sortAge?: SORT_ORDERS | null;
    city?: string;
    job?: string;
    gender?: string;
  };
};


export default async function UsersPage({ searchParams }: UsersPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN);
  const isAuthenticated = Boolean(token);
  const { page, search, sortFirstName, sortAge, city, job, gender } = await searchParams;
  const urlParams = {
    page: Math.max(1, parseInt(page ?? '1', 10)),
    query: search?.trim() ?? '',
    sortFirstName: sortFirstName ?? null,
    sortAge: sortAge ?? null,
    filters: {
      city: city ?? '',
      job: job ?? '',
      gender: gender ?? ''
    },
    skip: (Math.max(1, parseInt(page ?? '1', 10)) - 1) * DEFAULT_PAGE_SIZE,
    limit: DEFAULT_PAGE_SIZE,
  };


  const [usersData, filterOptions] = await Promise.all([
    usersService.fetchUsers(urlParams),
    usersService.getFilterOptions(),
  ]);

  const { users, total } = usersData;
  const totalPages = Math.ceil(total / urlParams.limit);
  const hasNextPage = urlParams.page < totalPages;
  const hasPrevPage = urlParams.page > 1;

  const visibleFields = isAuthenticated ? AUTH_FIELDS : GUEST_FIELDS;

  return (
    <div className="flex flex-col gap-4 mx-auto p-12">
      {isAuthenticated && (
        <div className="flex flex-col gap-4">
          <SortControls
            sortFirstName={urlParams.sortFirstName}
            sortAge={urlParams.sortAge}
          />
          <FilterControls
            cities={filterOptions.cities}
            jobTitles={filterOptions.jobTitles}
            genders={filterOptions.genders}
            activeCity={urlParams.filters.city}
            activeJob={urlParams.filters.job}
            activeGender={urlParams.filters.gender}
          />
          <SearchBar initialValue={urlParams.query} />
        </div>
      )}

      {/* ── Results ── */}
      {users.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-lg text-gray-500">No users found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                visibleFields={visibleFields}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          <Pagination
            page={urlParams.page}
            total={total}
            isLoading={false}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            startIndex={total === 0 ? 0 : urlParams.skip + 1}
            endIndex={Math.min(urlParams.skip + urlParams.limit, total)}
          />
        </>
      )}
    </div>
  );
}