'use client';

import { useCallback } from "react";
import DropDown, { Options } from "./DropDown";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FILTER_TYPE } from "@/constants";


export interface FilterControlsProps {
    cities: Options[];
    jobTitles: Options[];
    genders: Options[];
    activeCity: string;
    activeJob: string;
    activeGender: string;
};

export default function FilterControls({ cities, jobTitles, genders, activeCity, activeJob, activeGender }: FilterControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildUrl = useCallback(
        (updates: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            for (const [key, val] of Object.entries(updates)) {
                if (!val) {
                    params.delete(key);
                } else {
                    params.set(key, val);
                }
            }
            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams]
    );

    const handleFilter = (type: FILTER_TYPE, value: string) => {
        switch (type) {
            case FILTER_TYPE.CITY:
                router.push(buildUrl({ city: value, job: undefined, gender: undefined }));
                break;
            case FILTER_TYPE.JOB:
                router.push(buildUrl({ job: value, city: undefined, gender: undefined }));
                break;
            case FILTER_TYPE.GENDER:
                router.push(buildUrl({ gender: value, city: undefined, job: undefined }));
                break;
        }
    };

    return (
        <div className="flex items-center justify-left gap-4 bg-white p-4 rounded-lg shadow">
            <DropDown
                label="City"
                options={cities}
                value={activeCity}
                onSelect={(value) => handleFilter(FILTER_TYPE.CITY, value)}
            />
            <DropDown
                label="Title"
                options={jobTitles}
                value={activeJob}
                onSelect={(value) => handleFilter(FILTER_TYPE.JOB, value)}
            />
            <DropDown
                label="Gender"
                options={genders}
                value={activeGender}
                onSelect={(value) => handleFilter(FILTER_TYPE.GENDER, value)}
            />
        </div>
    );
}