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
  const { secret } = await request.json();
  const envSecret = process.env.ADMIN_SECRET || process.env.X_ADMIN_SECRET;
  const now = new Date().toISOString();

  let isValid = false;

  if (envSecret && secret === envSecret) {
    isValid = true;
  }

  if (!isValid) {
    try {
      const health = await serverFetch('/api/admin/health', {
        method: 'GET',
        headers: { 'X-Admin-Secret': secret }
      });
      isValid = health.ok;
    } catch (error) {
      console.error('Failed to validate admin secret against backend', error);
      isValid = false;
    }
  }

  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const alias = 'Administrador';
  const payload = encodeSession({ alias, secret, createdAt: now });
  const response = NextResponse.json({ alias, createdAt: now });
  response.cookies.set(SESSION_COOKIE_NAME, payload, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
  return response;
}
