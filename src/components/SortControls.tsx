'use client';
import { useRouter } from "next/dist/client/components/navigation";
import { SORT_ORDERS } from "@/constants";
import { toggleSortOrder } from "@/utils";
import { useBuildUrl } from "@/hooks/useBuildUrl";

export type SortControlsProps = {
    sortFirstName: SORT_ORDERS | null;
    sortAge: SORT_ORDERS | null;
};

export default function SortControls({ sortFirstName, sortAge }: SortControlsProps) {
    const router = useRouter();
    const buildUrl = useBuildUrl();

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