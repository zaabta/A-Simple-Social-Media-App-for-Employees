'use client';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated, selectAuthUser } from '@/redux/hooks';
import { authActions } from '@/redux/auth/authActions';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authUser = useAppSelector(selectAuthUser);
    const router = useRouter();
    const dispatch = useAppDispatch();

    return (
        <>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
                    <div className="flex justify-between items-center">
                        {/* Left side - Title/Welcome */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                {authUser?.image && (
                                    <img
                                        src={authUser.image}
                                        alt={authUser.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Welcome, {authUser?.firstName} {authUser?.lastName} 
                                    </h1>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}

                        {/* Right side - Button */}
                        <div>
                            <button
                                onClick={() => isAuthenticated ? dispatch(authActions.logout()) : router.push('/login')}
                                className="bg-gray-300 hover:bg-gray-600 text-sm text-gray-950 py-2 px-4 rounded-md transition-colors"
                            >
                                {isAuthenticated ? 'Logout' : 'Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            {children}
        </>
    );
}