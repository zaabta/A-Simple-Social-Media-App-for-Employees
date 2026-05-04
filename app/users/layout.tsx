import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { AUTH_TOKEN, AUTH_USER } from '@/constants';
import Link from 'next/link';


export default async function UsersLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get(AUTH_TOKEN) !== undefined;
    const authUser = isAuthenticated ? JSON.parse(cookieStore.get(AUTH_USER)?.value || '{}') : null;

    return (
        <>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-12 py-4">
                    <div className="flex justify-between items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                {authUser?.image && (
                                    <img
                                        src={authUser.image}
                                        alt={authUser.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <h1 className="text-xl font-bold text-gray-900">
                                    Welcome
                                    <span>, {authUser.firstName} {authUser.lastName}</span>
                                </h1>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <Link href={isAuthenticated ? '/logout' : '/login'} className="bg-gray-300 hover:bg-gray-600 text-sm text-gray-950 py-2 px-4 rounded-md transition-colors">
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Link>

                    </div>
                </div>
            </header>
            {children}
        </>
    );
}