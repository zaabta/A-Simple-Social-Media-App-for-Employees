import { AUTH_TOKEN, AUTH_USER } from '@/constants';
import type { AuthUser } from '@/redux/auth/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthSession {
  token: string;
  user: AuthUser;
}

/**
 * Get the current auth session from cookies
 * This is used server-side to validate authentication
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN)?.value;
    const userJson = cookieStore.get(AUTH_USER)?.value;

    if (!token || !userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson) as AuthUser;
      return { token, user };
    } catch (error) {
      console.error('Failed to parse auth user from cookie:', error);
      return null;
    }
  } catch (error) {
    console.error('Failed to get auth session:', error);
    return null;
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getAuthSession();
  
  if (!session) {
    redirect('/login');
  }

  return session;
}
