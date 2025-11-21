const STORAGE_KEY = 'kinesis_admin_session';

export type StoredSession = {
  secret: string;
  createdAt: number;
};

export function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as Partial<StoredSession>;
    if (!data?.secret) return null;
    return {
      secret: data.secret,
      createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now()
    };
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
