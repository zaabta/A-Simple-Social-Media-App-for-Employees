import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from '@/utils';

export function useDebouncedRouter(wait = 300) {
    const router = useRouter();

    const debouncedPush = useCallback(
        debounce((url: string) => router.push(url), wait),
        [router, wait]
    );

    return { router, debouncedPush };
}