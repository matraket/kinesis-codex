import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'kinesis_admin_session';

export interface SessionCookieValue {
  alias: string;
  secret: string;
  createdAt: string;
}

export function encodeSession(value: SessionCookieValue) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

export function decodeSession(raw?: string): SessionCookieValue | null {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as SessionCookieValue;
  } catch (error) {
    console.error('Failed to decode session', error);
    return null;
  }
}

export function getSessionFromCookies(): SessionCookieValue | null {
  const cookieStore = cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decodeSession(raw);
}
