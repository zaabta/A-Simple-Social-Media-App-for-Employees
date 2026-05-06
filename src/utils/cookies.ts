import { CookieOptions } from "../types";

/**
 * Client-side cookie utilities
 */
export function setCookie(key: string, value: string, options?: CookieOptions): void {
  if (typeof document === 'undefined') {
    return;
  }

  const {
    maxAge = 7 * 24 * 60 * 60,
    path = '/',
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'Lax',
  } = options || {};

  let cookieStr = `${key}=${encodeURIComponent(value)};path=${path}`;

  if (maxAge) {
    cookieStr += `;max-age=${maxAge}`;
  }

  // Only add secure flag in production — Vercel serves HTTPS so this is safe
  // In local dev (http://localhost) secure cookies are silently dropped by the browser
  if (secure && typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookieStr += ';secure';
  }

  if (sameSite) {
    cookieStr += `;samesite=${sameSite}`;
  }

  document.cookie = cookieStr;
}

export function getCookie(key: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = `${key}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(nameEQ)) {
      return decodeURIComponent(trimmed.substring(nameEQ.length));
    }
  }

  return null;
}

export function removeCookie(key: string): void {
  if (typeof document === 'undefined') return;
  // Must match the same path used when setting
  document.cookie = `${key}=;path=/;max-age=-1`;
}

export function waitForCookie(name: string, maxWaitMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const found = document.cookie.split(';').some(c => c.trim().startsWith(`${name}=`));
      if (found) return resolve(true);
      if (Date.now() - start > maxWaitMs) return resolve(false);
      setTimeout(check, 50);
    };
    check();
  });
}