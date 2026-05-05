'use client';
import DropDown, { Options } from './DropDown';
import { useRouter } from 'next/navigation';
import { FILTER_TYPE } from '@/constants';
import { useBuildUrl } from '@/hooks/useBuildUrl';

export interface FilterControlsProps {
    cities: Options[];
    jobTitles: Options[];
    genders: Options[];
    activeCity: string;
    activeJob: string;
    activeGender: string;
}

export default function FilterControls({ cities, jobTitles, genders, activeCity, activeJob, activeGender }: FilterControlsProps) {
    const router = useRouter();
    const buildUrl = useBuildUrl();

    const handleFilter = (type: FILTER_TYPE, value: string) => {
        switch (type) {
            case FILTER_TYPE.CITY:
                router.push(buildUrl({ city: value, job: null, gender: null }));
                break;
            case FILTER_TYPE.JOB:
                router.push(buildUrl({ job: value, city: null, gender: null }));
                break;
            case FILTER_TYPE.GENDER:
                router.push(buildUrl({ gender: value, city: null, job: null }));
                break;
        }
    };

    return (
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        </div>
    );
}