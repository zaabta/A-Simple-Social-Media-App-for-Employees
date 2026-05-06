import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN, AUTH_USER, SERVER_AUTH_COOKIE_OPTIONS } from '@/constants';

export async function POST(request: NextRequest) {
    try {
        const { token, user } = await request.json();

        if (!token || !user) return NextResponse.json({ error: 'Missing token or user' }, { status: 400 });

        const response = NextResponse.json({ success: true });

        // Get the host from the request to set the correct domain
        const host = request.headers.get('host') || '';
        // Strip port for local dev (localhost:3000 → localhost)
        const domain = host.includes(':') ? host.split(':')[0] : host;

        const cookieOptions = {
            ...SERVER_AUTH_COOKIE_OPTIONS,
            ...(process.env.NODE_ENV === 'production' && { domain }),
        };

        response.cookies.set(AUTH_TOKEN, token, cookieOptions);
        response.cookies.set(AUTH_USER, JSON.stringify(user), cookieOptions);

        return response;
    } catch {
        return NextResponse.json({ error: 'Failed to set cookies' }, { status: 500 });
    }
}