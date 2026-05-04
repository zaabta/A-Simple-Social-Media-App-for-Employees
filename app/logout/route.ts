import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_TOKEN, AUTH_USER } from '@/constants';
import { removeCookie } from '@/utils';

export async function GET() {
    removeCookie(AUTH_TOKEN);
    removeCookie(AUTH_USER);

    redirect('/login');
}