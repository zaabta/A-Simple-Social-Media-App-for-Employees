'use client';

import { useBuildUrl, useDebouncedRouter } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
    initialValue: string;
    disabled?: boolean;
};

export default function SearchBar({ initialValue, disabled }: Props) {
    const [searchInput, setSearchInput] = useState(initialValue);
    const router = useRouter();
    const buildUrl = useBuildUrl();
    const { debouncedPush } = useDebouncedRouter(300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const val = e.target.value
        if (!val) debouncedPush(buildUrl({ search: '' }));
        setSearchInput(val)
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
        <div className='flex gap-2'>
            <div className="border border-gray-300 rounded-lg bg-white flex gap-1 items-center w-full px-2">
                <img src="/assets/search.svg" alt="Search" className="w-5 h-5" />
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search"
                    className="w-full px-0 py-1 text-black text-sm border border-none rounded-lg focus:outline-none"
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={disabled || !searchInput.trim()}
                className={`bg-blue-${searchInput.trim() ? '600' : '100'} w-25 flex gap-x-0.5 items-center justify-left text-white text-sm py-2 px-2 rounded-md`}
            >
                <img src="/assets/search.svg" alt="Search" className="w-5 h-5" />
                Search
            </button>
        </div>
    );
}