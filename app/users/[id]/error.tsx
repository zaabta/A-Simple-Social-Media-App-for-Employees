'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function UserDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Failed to load user</h2>
            <p className="text-gray-500 max-w-md">
                {error.message || 'Something went wrong while fetching this user. Please try again.'}
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/users"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md transition-colors"
                >
                    Back to users
                </Link>
            </div>
        </div>
    );
}