'use client';

import { useEffect } from 'react';

export default function UsersError({
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-12">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">!</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Failed to load users</h2>
                <p className="text-gray-500 max-w-md">
                    {error.message || 'Something went wrong while fetching users. Please try again.'}
                </p>
            </div>
            <button
                onClick={reset}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
            >
                Try again
            </button>
        </div>
    );
}