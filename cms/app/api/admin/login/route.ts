import { NextResponse } from 'next/server';
import { encodeSession, getSessionFromCookies, SESSION_COOKIE_NAME } from '@/lib/session';
import { serverFetch } from '@/lib/server-fetcher';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ alias: session.alias, createdAt: session.createdAt });
}

export async function POST(request: Request) {
  const { alias, secret } = await request.json();
  const health = await serverFetch('/api/admin/health', {
    method: 'GET',
    headers: { 'X-Admin-Secret': secret }
  });

  if (!health.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = encodeSession({ alias, secret, createdAt: new Date().toISOString() });
  const response = NextResponse.json({ alias, createdAt: new Date().toISOString() });
  response.cookies.set(SESSION_COOKIE_NAME, payload, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  return response;
}
