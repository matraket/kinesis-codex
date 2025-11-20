import { NextRequest } from 'next/server';
import { decodeSession, getSessionFromCookies } from './session';

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export function getApiBaseUrl() {
  return API_BASE_URL.replace(/\/$/, '');
}

export function resolveSession(req?: NextRequest) {
  if (req) {
    const cookie = req.cookies.get('kinesis_admin_session');
    return decodeSession(cookie?.value);
  }
  return getSessionFromCookies();
}

export async function serverFetch(path: string, init?: RequestInit, req?: NextRequest) {
  const session = resolveSession(req);
  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  return fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(session?.secret ? { 'X-Admin-Secret': session.secret } : {})
    }
  });
}
