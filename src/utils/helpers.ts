import { SORT_ORDERS } from "..";

/**
 * Check if code is running on client side
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Format user name from first and last names
 */
export const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

/**
 * Get initials from user name
 */
export const getUserInitials = (firstName: string, lastName: string): string => {
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName.charAt(0).toUpperCase();
  return `${first}${last}`;
};

/**
 * Format email to be more readable
 */
export const formatEmail = (email: string): string => {
  return email.toLowerCase();
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: Parameters<T>) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Calculate pagination skip value
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Truncate string to specified length
 */
export const truncateString = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

/**
 * Wait for specified time
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};


/** * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/** 
 * Toggle sort order
 */
export const toggleSortOrder = (sortOrder: SORT_ORDERS | null) => {
  return sortOrder === null ? SORT_ORDERS.ASC : sortOrder === SORT_ORDERS.ASC ? SORT_ORDERS.DESC : null;
}

export const getPageNumbers = (totalItems: number, page: number, itemsPerPage: number): (number | string)[] => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  const rangeStart = Math.max(2, page - 1);
  const rangeEnd = Math.min(totalPages - 1, page + 1);

  if (rangeStart > 2) pages.push('ellipsis');

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push('ellipsis');

  pages.push(totalPages);
  return pages;
};


export const mapOptions = (set: Set<string>, format?: (v: string) => string, allLabel = 'All') =>
  [
    { value: '', label: allLabel },
    ...Array.from(set)
      .sort()
      .map(value => ({
        value,
        label: format ? format(value) : value,
      })),
  ];