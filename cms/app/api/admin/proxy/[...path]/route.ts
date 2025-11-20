import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from '@/lib/server-fetcher';
import { getSessionFromCookies } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const targetPath = `/api/admin/${params.path.join('/')}${request.nextUrl.search}`;
  const upstream = await serverFetch(targetPath, { method: 'GET' }, request);

  const data = await upstream.json().catch(() => ({ error: 'Invalid JSON' }));
  return NextResponse.json(data, { status: upstream.status });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const targetPath = `/api/admin/${params.path.join('/')}`;
  const upstream = await serverFetch(
    targetPath,
    {
      method: 'POST',
      body: JSON.stringify(body)
    },
    request
  );
  const data = await upstream.json().catch(() => ({ error: 'Invalid JSON' }));
  return NextResponse.json(data, { status: upstream.status });
}
