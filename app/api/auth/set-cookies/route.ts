import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN, AUTH_USER, AUTH_COOKIE_OPTIONS, SERVER_AUTH_COOKIE_OPTIONS } from '@/constants';

export async function POST(request: NextRequest) {
    try {
        const { token, user } = await request.json();

        if (!token || !user) return NextResponse.json({ error: 'Missing token or user' }, { status: 400 });

        const response = NextResponse.json({ success: true });

        response.cookies.set(AUTH_TOKEN, token, SERVER_AUTH_COOKIE_OPTIONS);
        response.cookies.set(AUTH_USER, JSON.stringify(user), SERVER_AUTH_COOKIE_OPTIONS);

        return response;
    } catch {
        return NextResponse.json({ error: 'Failed to set cookies' }, { status: 500 });
    }
}