/**
 * Server-side API client for Next.js server components
 * Uses the fetch API directly instead of axios
 */
import { API_BASE_URL, RequestTypes } from '@/constants';
    
export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ServerApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    method: string,
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed for ${method} ${url}:`, error);
      throw error;
    }
  }

  async get<T>(url: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(RequestTypes.GET, url, options);
  }

  async post<T>(url: string, data?: unknown, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(RequestTypes.POST, url, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: unknown, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(RequestTypes.PUT, url, {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string, options: FetchOptions = {}): Promise<T> {
    return this.request<T>(RequestTypes.DELETE, url, options);
  }
}

export const serverApiClient = new ServerApiClient();
