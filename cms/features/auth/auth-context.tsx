'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredSession, persistSession, readStoredSession, type StoredSession } from '@/lib/auth-storage';
import { login as loginRequest, logout as logoutRequest, validateSession } from '@/lib/api/auth';

type AuthContextValue = {
  session: StoredSession | null;
  isLoading: boolean;
  error?: string;
  login: (email: string, secret: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedSession, setStoredSession] = useState<StoredSession | null>(() => readStoredSession());
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ['auth', 'session', storedSession?.email],
    queryFn: async () => {
      if (!storedSession) throw new Error('No hay sesión');
      return validateSession(storedSession);
    },
    enabled: Boolean(storedSession?.secret),
    staleTime: 5 * 60 * 1000,
    retry: false,
    onError: () => {
      clearStoredSession();
      setStoredSession(null);
    }
  });

  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; secret: string }) => loginRequest(payload),
    onSuccess: (session) => {
      persistSession(session);
      setStoredSession(session);
      queryClient.setQueryData(['auth', 'session', session.email], session);
    },
    onError: () => {
      clearStoredSession();
      setStoredSession(null);
    }
  });

  const logout = () => {
    clearStoredSession();
    setStoredSession(null);
    queryClient.removeQueries({ queryKey: ['auth'] });
    void logoutRequest();
  };

  const session = sessionQuery.isError ? null : sessionQuery.data ?? storedSession ?? null;
  const isLoading = sessionQuery.isFetching || loginMutation.isPending;
  const error = (loginMutation.error as Error | null)?.message ?? (sessionQuery.error as Error | null)?.message;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      error,
      login: async (email: string, secret: string) => {
        await loginMutation.mutateAsync({ email, secret });
      },
      logout
    }),
    [error, isLoading, session, loginMutation, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/admin/login');
    }
  }, [isLoading, session, router]);

  if (!session) {
    return isLoading ? <div className="p-6 text-sm text-muted">Comprobando sesión...</div> : null;
  }

  return <>{children}</>;
}
