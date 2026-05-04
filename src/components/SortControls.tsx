'use client';
import { usePathname, useRouter, useSearchParams } from "next/dist/client/components/navigation";
import { useCallback } from "react";
import { SORT_FIELDS, SORT_ORDERS } from "@/constants";
import { toggleSortOrder } from "@/utils";

export type SortControlsProps = {
    sortFirstName: SORT_ORDERS | null;
    sortAge: SORT_ORDERS | null;
};

export default function SortControls({ sortFirstName, sortAge }: SortControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildUrl = useCallback((updates: Record<SORT_FIELDS, SORT_ORDERS | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        for (const [key, val] of Object.entries(updates)) {
            if (val === null) {
                params.delete(key);
            } else {
                params.set(key, val);
            }
        }
        return `${pathname}?${params.toString()}`;
    },
        [pathname, searchParams]
    );

    const handleSortFirstName = () => {
        const order = toggleSortOrder(sortFirstName);
        router.push(buildUrl({ firstName: order, age: null }));
    };

    const handleSortAge = () => {
        const next = toggleSortOrder(sortAge);
        router.push(buildUrl({ age: next, firstName: null }));
    };
    return (<div className="flex gap-4 items-center justify-left bg-white p-4 rounded-lg shadow">
        <button
            onClick={handleSortFirstName}
            className="flex gap-2 bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg">
            sort by first name
            {sortFirstName && <img src={`/assets/${sortFirstName === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`} alt="Sort" className="w-4 h-4 inline-block ml-1" />}
        </button>
        <button
            onClick={handleSortAge}
            className="flex gap-2 bg-gray-100 hover:bg-gray-200 capitalize text-sm text-gray-700 border border-gray-300 py-2 px-4 rounded-lg"
        >
            sort by age
            {sortAge && <img src={`/assets/${sortAge === SORT_ORDERS.ASC ? 'up' : 'down'}-arrow.svg`} alt="Sort" className="w-4 h-4 inline-block ml-1" />}
        </button>
    </div>);
}