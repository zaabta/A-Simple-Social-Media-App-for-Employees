/**
 * Client-side cookie utilities
 */

import { CookieOptions } from "../types";

export function setCookie(key: string, value: string, options: CookieOptions): void {
  if (typeof document === 'undefined') {
    return;
  }

  const {
    maxAge = 7 * 24 * 60 * 60, // 7 days
    path = '/',
    secure = true,
    sameSite = 'Lax',
  } = options || {};

  let cookieStr = `${key}=${encodeURIComponent(value)};path=${path}`;

  if (maxAge) {
    cookieStr += `;max-age=${maxAge}`;
  }

  if (secure) {
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
  setCookie(key, '', { maxAge: -1 });
}
