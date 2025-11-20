const STORAGE_KEY = 'kinesis_admin_session';

export type StoredSession = {
  email: string;
  secret: string;
};

export function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

export function persistSession(session: StoredSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getStoredSecret() {
  return readStoredSession()?.secret ?? null;
}
