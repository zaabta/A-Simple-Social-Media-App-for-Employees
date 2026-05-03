import Link from 'next/link';
import { requireAuth } from '@/utils/auth.server';
import { Post, UserInfoCard } from '@/components';
import { User } from '@/types';
import { usersService } from '@/redux/users/service';
import { PostsResponse } from '@/redux/users/types';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

interface PageData {
  user: User;
  posts: PostsResponse;
  currentPage: number;
  totalPages: number;
}

async function fetchUserData(userId: number, page: number = 1): Promise<PageData> {
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const [user, posts] = await Promise.all([
      usersService.fetchUserById(userId),
      usersService.getUserPosts(userId, skip, limit),
    ]);

    const totalPages = Math.ceil(posts.total / limit);

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
  await requireAuth();
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
    <UserInfoCard avatar={user.image} firstName={user.firstName} lastName={user.lastName} username={user.username} email={user.email} job={user.company.title} gender={user.gender} />
    <div className='flex flex-col gap-4'>
      <h2 className="text-2xl font-bold text-gray-900">
        Posts ({posts.total})
      </h2>
      <label htmlFor="search" className="block text-sm font-medium text-gray-700">
        Showing posts {Math.min(posts.skip + posts.limit, posts.total)} of {posts.total}
      </label>

      <div className="space-y-4">
        {posts.posts.map((post) => (
          <Post key={post.id} title={post.title} body={post.body} tags={post.tags} reactions={post.reactions} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {currentPage > 1 && (
            <Link
              href={`/users/${userId}?page=${currentPage - 1}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ← Previous
            </Link>
          )}

          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {currentPage < totalPages && (
            <Link
              href={`/users/${userId}?page=${currentPage + 1}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>

      )}
    </div>
  </>
  );
}