import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, AUTH_COOKIE_NAME } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    const payload = token ? await verifyAdminToken(token) : null;
    const isAuthenticated = !!payload;

    // If on login page and already authenticated, redirect to /admin/dashboard
    if (isLoginPage && isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If accessing protected admin page and NOT authenticated, redirect to /admin/login
    if (!isLoginPage && !isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
