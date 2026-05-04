import { toggleSortOrder, getPageNumbers, capitalize, debounce, mapOptions } from '@/utils/helpers';
import { SORT_ORDERS } from '@/constants';

describe('toggleSortOrder', () => {
    it('returns ASC when current is null', () => {
        expect(toggleSortOrder(null)).toBe(SORT_ORDERS.ASC);
    });

    it('returns DESC when current is ASC', () => {
        expect(toggleSortOrder(SORT_ORDERS.ASC)).toBe(SORT_ORDERS.DESC);
    });

    it('returns null when current is DESC', () => {
        expect(toggleSortOrder(SORT_ORDERS.DESC)).toBeNull();
    });
});

describe('getPageNumbers', () => {
    it('returns all pages when totalItems fits within 7 pages', () => {
        // 30 items / 15 per page = 2 pages
        expect(getPageNumbers(30, 1, 15)).toEqual([1, 2]);
    });

    it('returns ellipsis for large page counts', () => {
        // 200 items / 15 per page = 14 pages
        const pages = getPageNumbers(200, 7, 15);
        expect(pages).toContain('ellipsis');
        expect(pages[0]).toBe(1);
        expect(pages[pages.length - 1]).toBe(14);
    });

    it('shows correct page range around current page', () => {
        const pages = getPageNumbers(200, 7, 15);
        expect(pages).toContain(6);
        expect(pages).toContain(7);
        expect(pages).toContain(8);
    });
});

describe('capitalize', () => {
    it('capitalizes first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('handles already capitalized string', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });
});

describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
        const fn = jest.fn();
        const debouncedFn = debounce(fn, 300);

        debouncedFn('arg1');
        expect(fn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(300);
        expect(fn).toHaveBeenCalledWith('arg1');
    });

    it('only calls once for multiple rapid calls', () => {
        const fn = jest.fn();
        const debouncedFn = debounce(fn, 300);

        debouncedFn('a');
        debouncedFn('b');
        debouncedFn('c');

        jest.advanceTimersByTime(300);
        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith('c');
    });
});

describe('mapOptions', () => {
    it('prepends an All option', () => {
        const set = new Set(['New York', 'Paris']);
        const options = mapOptions(set, v => v, 'All Cities');
        expect(options[0]).toEqual({ value: '', label: 'All Cities' });
    });

    it('sorts options alphabetically', () => {
        const set = new Set(['Paris', 'Berlin', 'Amsterdam']);
        const options = mapOptions(set, v => v);
        const labels = options.slice(1).map(o => o.label);
        expect(labels).toEqual(['Amsterdam', 'Berlin', 'Paris']);
    });

    it('applies format function', () => {
        const set = new Set(['male', 'female']);
        const options = mapOptions(set, v => v.toUpperCase());
        expect(options.find(o => o.value === 'male')?.label).toBe('MALE');
    });
});