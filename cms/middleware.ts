import { NextRequest, NextResponse } from 'next/server';
import { decodeSession, SESSION_COOKIE_NAME } from './lib/session';

const publicPaths = ['/login', '/api/admin/login'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const decoded = decodeSession(session);

  if (!decoded) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)']
};
