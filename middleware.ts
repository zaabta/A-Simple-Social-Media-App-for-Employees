import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN, PAGE_PATH } from '@/constants';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_TOKEN)?.value;
    const isProtected = /^\/users\/\d+/.test(pathname);

    if (isProtected && !token) {
        const loginUrl = new URL(PAGE_PATH.LOGIN, request.url);
        loginUrl.searchParams.set('redirectBack', pathname);
        const response = NextResponse.redirect(loginUrl, 307);
        response.headers.set('Cache-Control', 'no-store');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/users/:path+'],
};