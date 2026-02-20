import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('family_token');
  const { pathname } = request.nextUrl;

  // Allow static assets and the login page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/login') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token || token.value !== 'authorized') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
