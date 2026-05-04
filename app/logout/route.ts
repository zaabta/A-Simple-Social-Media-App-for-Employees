import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_TOKEN, AUTH_USER } from '@/constants';

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN);
    cookieStore.delete(AUTH_USER);

    redirect('/login');
}