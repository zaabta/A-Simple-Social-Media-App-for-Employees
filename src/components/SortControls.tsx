'use client';
import { useRouter } from 'next/navigation';
import { SORT_ORDERS } from '@/constants';
import { toggleSortOrder } from '@/utils';
import { useBuildUrl } from '@/hooks/useBuildUrl';

export type SortControlsProps = {
    sortFirstName: SORT_ORDERS | null;
    sortAge: SORT_ORDERS | null;
};

export default function SortControls({ sortFirstName, sortAge }: SortControlsProps) {
    const router = useRouter();
    const buildUrl = useBuildUrl();

    const handleSortFirstName = () => {
        router.push(buildUrl({ firstName: toggleSortOrder(sortFirstName), age: null }));
    };

    const handleSortAge = () => {
        router.push(buildUrl({ age: toggleSortOrder(sortAge), firstName: null }));
    };

    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center bg-white p-3 sm:p-4 rounded-lg shadow">
            <button
                onClick={handleSortFirstName}
                className={`flex items-center gap-2 text-sm border py-2 px-3 sm:px-4 rounded-lg transition-colors
                    ${sortFirstName
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <span className="hidden sm:inline">Sort by </span>First Name
                {sortFirstName && (
                    <img
                        src={`/assets/${sortFirstName === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`}
                        alt={sortFirstName}
                        className="w-4 h-4"
                    />
                )}
            </button>
            <button
                onClick={handleSortAge}
                className={`flex items-center gap-2 text-sm border py-2 px-3 sm:px-4 rounded-lg transition-colors
                    ${sortAge
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                <span className="hidden sm:inline">Sort by </span>Age
                {sortAge && (
                    <img
                        src={`/assets/${sortAge === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`}
                        alt={sortAge}
                        className="w-4 h-4"
                    />
                )}
            </button>
        </div>
    );
}