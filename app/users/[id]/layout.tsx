import Link from "next/link";
import { ReactNode } from "react";

export default function UsersLayout({ children }: { children: ReactNode }) {
    return (<div className="min-h-screen bg-gray-50">
        <main className="flex flex-col gap-8 max-w-3xl mx-auto px-2  py-4">
            {/* Back Button */}
            <Link
                href="/users"
                className="bg-blue-600 flex items-center  gap-2 w-fit text-white hover:bg-blue-800 transition-colors py-2 px-4 rounded-md"
            >
                <span>←</span>
                <span>Go to Main Page</span>
            </Link>
            {children}
        </main>
    </div>
    );
}