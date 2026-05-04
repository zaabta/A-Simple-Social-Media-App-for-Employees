'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { getPageNumbers } from "@/utils";

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
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildUrl = useCallback((p: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(p));
        return `${pathname}?${params.toString()}`;
    }, [pathname, searchParams]);

    const handlePrevPage = () => router.push(buildUrl(page - 1));
    const handleNextPage = () => router.push(buildUrl(page + 1));
    const handlePageClick = (p: number) => router.push(buildUrl(p));

    return (
        <div className="flex gap-4 justify-end items-center mt-6">
            <p className="text-sm text-gray-500">
                {total === 0 ? '0' : `${startIndex}–${endIndex}`} of {total} results
            </p>

            <div className="flex gap-2">
                <button
                    onClick={handlePrevPage}
                    disabled={isLoading || !hasPrevPage}
                    className={`px-3 py-1 rounded-md text-sm ${isLoading || !hasPrevPage
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-white border text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <img src="/assets/left-arrow.svg" alt="Previous" className="w-4 h-4" />
                </button>
                {getPageNumbers(total, page).map((num, index) => (
                    num === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500">
                            ...
                        </span>
                    ) : (
                        <button
                            key={num}
                            onClick={() => handlePageClick(Number(num))}
                            className={`px-3 py-1 rounded-md text-sm ${num === page
                                ? "bg-blue-600 text-white"
                                : "bg-white border text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {num}
                        </button>
                    )
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={isLoading || !hasNextPage}
                    className={`px-3 py-1 rounded-md text-sm ${isLoading || !hasNextPage
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-white border text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <img src="/assets/right-arrow.svg" alt="Next" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}