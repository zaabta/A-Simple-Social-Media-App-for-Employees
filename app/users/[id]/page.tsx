import { Pagination, Post, UserInfoCard } from '@/components';
import { SingleUser } from '@/types';
import { usersService } from '@/redux/users/service';
import { PostsResponse } from '@/redux/users/types';
import { DEFAULT_PAGE_SIZE } from '@/constants';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface PageData {
  user: SingleUser;
  posts: PostsResponse;
  currentPage: number;
  totalPages: number;
}

async function fetchUserData(userId: number, page: number = 1): Promise<PageData> {
  const skip = (page - 1) * DEFAULT_PAGE_SIZE;

  try {
    const [user, posts] = await Promise.all([
      usersService.fetchUserById(userId),
      usersService.getUserPosts(userId, skip, DEFAULT_PAGE_SIZE),
    ]);

    const totalPages = Math.ceil(posts.total / DEFAULT_PAGE_SIZE);

    return {
      user,
      posts,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

export default async function UserDetailPage({
  params,
  searchParams,
}: UserDetailPageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;

  const userId = Number(id);
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  if (isNaN(userId) || userId <= 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600">Invalid user ID</div>
      </div>
    );
  }

  let pageData: PageData;
  try {
    pageData = await fetchUserData(userId, currentPage);
  } catch (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-red-600">
          Failed to load user details. Please try again.
        </div>
      </div>
    );
  }

  const { user, posts, totalPages } = pageData;

  return (<>
    <UserInfoCard avatar={user.image} firstName={user.firstName} lastName={user.lastName} age={user.age} username={user.username} email={user.email} job={user.company.title} gender={user.gender} />
    <div className='flex flex-col gap-4'>
      <h2 className="text-2xl font-bold text-gray-900">
        Posts ({posts.total})
      </h2>
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        Showing posts {Math.min(posts.skip + posts.limit, posts.total)} of {posts.total}
      </label>

      <div className="flex flex-col gap-6">
        {posts.posts.map((post) => (
          <Post key={post.id} title={post.title} body={post.body} tags={post.tags} reactions={post.reactions} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          total={totalPages}
          startIndex={totalPages === 0 ? 0 : (currentPage - 1) * DEFAULT_PAGE_SIZE + 1}
          endIndex={totalPages === 0 ? 0 : Math.min(currentPage * DEFAULT_PAGE_SIZE, posts.total)}
          hasPrevPage={currentPage > 1}
          hasNextPage={currentPage < totalPages}
          isLoading={false}
        />
      )}
    </div>
  </>
  );
}