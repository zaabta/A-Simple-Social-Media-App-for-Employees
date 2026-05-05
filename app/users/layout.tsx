import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AUTH_TOKEN, AUTH_USER } from '@/constants';
import Link from 'next/link';

export default async function UsersLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get(AUTH_TOKEN)?.value !== undefined;
    const authUser = isAuthenticated ? JSON.parse(cookieStore.get(AUTH_USER)?.value || '{}') : null;

    return (
        <>
            <header className="bg-white shadow sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex justify-between items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                {authUser?.image && (
                                    <img
                                        src={authUser.image}
                                        alt={authUser.username}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                                    />
                                )}
                                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                                    Welcome
                                    <span className="hidden xs:inline">, {authUser.firstName} {authUser.lastName}</span>
                                    <span className="xs:hidden">, {authUser.firstName}</span>
                                </h1>
                            </div>
                        ) : (
                            <div />
                        )}
                        <Link
                            href={isAuthenticated ? '/logout' : '/login'}
                            className="shrink-0 bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 font-medium py-1.5 px-4 rounded-md transition-colors"
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Link>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </>
    );
}