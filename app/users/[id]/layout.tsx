import Link from 'next/link';
import { ReactNode } from 'react';

export default function UserDetailLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
                <Link
                    href="/users"
                    className="bg-blue-600 flex justify-center items-center gap-2 w-fit text-white hover:bg-blue-700 transition-colors py-2 px-4 rounded-md text-sm font-medium"
                >
                    <img className='h-4 w-4' src='/assets/left-arrow-back.svg' alt='back'/>
                    <span>Go to Main Page</span>
                </Link>
                {children}
            </main>
        </div>
    );
}