import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useBuildUrl() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildUrl = useCallback(
        (updates: Record<string, string | null>, resetPage = true) => {
            const params = new URLSearchParams(searchParams.toString());

            if (resetPage) params.set('page', '1');

            for (const [key, val] of Object.entries(updates)) {
                if (val === null || val === '') {
                    params.delete(key);
                } else {
                    params.set(key, val);
                }
            }

            return `${pathname}?${params.toString()}`;
        },
        [pathname, searchParams]
    );

    return buildUrl;
}