'use client';

import { useBuildUrl, useDebouncedRouter } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
    initialValue: string;
    disabled?: boolean;
};

export default function SearchBar({ initialValue, disabled }: Props) {
    const [searchInput, setSearchInput] = useState(initialValue);
    const router = useRouter();
    const buildUrl = useBuildUrl();
    const { debouncedPush } = useDebouncedRouter(300);

    const handleChange = (value: string) => {
        setSearchInput(value);
        if (!value.trim()) {
            debouncedPush(buildUrl({ search: '' }));
        }
    };

    const handleSubmit = () => {
        router.push(buildUrl({ search: searchInput }));
    };

    const handleClear = () => {
        setSearchInput('');
        router.push(buildUrl({ search: '' }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') handleClear();
    };

    return (
        <div className="flex gap-2">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg bg-white px-3 w-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                <img src="/assets/search.svg" alt="Search" className="w-4 h-4 shrink-0 opacity-50" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search users..."
                    disabled={disabled}
                    className="w-full py-2 text-sm text-gray-800 bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                {searchInput && (
                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 shrink-0 text-lg leading-none"
                        aria-label="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>
            <button
                onClick={handleSubmit}
                disabled={disabled || !searchInput.trim()}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors shrink-0"
            >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
            </button>
        </div>
    );
}