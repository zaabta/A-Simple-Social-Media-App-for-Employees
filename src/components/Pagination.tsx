'use client';

import { useRouter } from 'next/navigation';
import { getPageNumbers } from '@/utils';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useBuildUrl } from '@/hooks/useBuildUrl';

export interface PaginationProps {
    page: number;
    total: number;
    startIndex: number;
    endIndex: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    isLoading: boolean;
}

export default function Pagination({ page, total, startIndex, endIndex, hasPrevPage, hasNextPage, isLoading }: PaginationProps) {
    const router = useRouter();
    const buildUrl = useBuildUrl();

    const handlePrevPage = () => router.push(buildUrl({ page: String(page - 1) }, false));
    const handleNextPage = () => router.push(buildUrl({ page: String(page + 1) }, false));
    const handlePageClick = (p: number) => router.push(buildUrl({ page: String(p) }, false));

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between sm:justify-end items-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
                {total === 0 ? '0' : `${startIndex}–${endIndex}`} of {total} results
            </p>

            <div className="flex gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
                <button
                    onClick={handlePrevPage}
                    disabled={isLoading || !hasPrevPage}
                    className={`px-2.5 py-1.5 rounded-md text-sm transition-colors ${isLoading || !hasPrevPage
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <img src="/assets/left-arrow.svg" alt="Previous" className="w-4 h-4" />
                </button>

                {getPageNumbers(total, page, DEFAULT_PAGE_SIZE).map((num, index) =>
                    num === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-sm text-gray-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={num}
                            onClick={() => handlePageClick(Number(num))}
                            className={`min-w-[32px] px-2.5 py-1.5 rounded-md text-sm transition-colors ${num === page
                                ? 'bg-blue-600 text-white font-medium shadow-sm'
                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {num}
                        </button>
                    )
                )}

                <button
                    onClick={handleNextPage}
                    disabled={isLoading || !hasNextPage}
                    className={`px-2.5 py-1.5 rounded-md text-sm transition-colors ${isLoading || !hasNextPage
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <img src="/assets/right-arrow.svg" alt="Next" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}