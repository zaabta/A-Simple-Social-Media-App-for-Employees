import { getPageNumbers } from "@/utils";

export interface PaginationProps {
    page: number;
    total: number;
    startIndex: number;
    endIndex: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    isLoading: boolean;
    handlePrevPage: () => void;
    handleNextPage: () => void;
    handlePageClick: (page: number) => void;
}

export default function Pagination({ page, total, startIndex, endIndex, hasPrevPage, hasNextPage, isLoading, handlePrevPage, handleNextPage, handlePageClick }: PaginationProps) {
    return (
        <div className="flex gap-4 justify-end items-center mt-6">
            <p className="text-sm text-gray-500">
                {total === 0 ? '0' : `${startIndex}–${endIndex}`} of {total} results
            </p>

            <div className="flex gap-2">
                <button
                    onClick={handlePrevPage}
                    className={`px-3 py-1 rounded-md text-sm ${isLoading || !hasPrevPage
                        ? "bg-blue-600 text-white cursor-not-allowed"
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
                    className={`px-3 py-1 rounded-md text-sm ${isLoading || !hasNextPage
                        ? "bg-blue-600 text-white cursor-not-allowed"
                        : "bg-white border text-gray-600 hover:bg-gray-50"
                        }`}
                >
                    <img src="/assets/right-arrow.svg" alt="Next" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}