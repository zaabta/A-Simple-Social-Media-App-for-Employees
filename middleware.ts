import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN, PAGE_PATH } from '@/constants';

const PROTECTED_ROUTES = [PAGE_PATH.USERS+'/'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_TOKEN)?.value;

    const isProtected = PROTECTED_ROUTES.some(() =>
        // /users/[id] only — not /users itself
        pathname.match(/^\/users\/\d+/)
    );

    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectBack', pathname);
        return NextResponse.redirect(loginUrl, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [`/users/:id*`],
};