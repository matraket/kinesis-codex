import { create } from 'zustand';
import type { SessionCookieValue } from '@/lib/session';

interface SessionState {
  session: SessionCookieValue | null;
  setSession: (session: SessionCookieValue) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null })
}));
