import { NextRequest, NextResponse } from 'next/server';
import { loadWebContent, saveWebContent } from '@/lib/web-content-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = (searchParams.get('key') ?? '').trim();
  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  try {
    const data = await loadWebContent(key);
    if (data === undefined) {
      return NextResponse.json({ data: null }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const key = (body?.key ?? '').trim();
    const value = body?.value;
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    await saveWebContent(key, value);
    return NextResponse.json({ data: { key } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
