'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredSession, persistSession, readStoredSession, type StoredSession } from '@/lib/auth-storage';
import { login as loginRequest, logout as logoutRequest, validateSession } from '@/lib/api/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  session: StoredSession | null;
  isLoading: boolean;
  error?: string;
  login: (secret: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [storedSession, setStoredSession] = useState<StoredSession | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setStoredSession(readStoredSession());
    setHasHydrated(true);
  }, []);

  const sessionQuery = useQuery<StoredSession, Error>({
    queryKey: ['auth', 'session', storedSession?.secret ?? null],
    queryFn: async () => {
      if (!storedSession) throw new Error('No hay sesion');
      return validateSession(storedSession);
    },
    enabled: Boolean(hasHydrated && storedSession?.secret),
    staleTime: 5 * 60 * 1000,
    retry: false
  });

  useEffect(() => {
    if (sessionQuery.isError) {
      clearStoredSession();
      setStoredSession(null);
    }
  }, [sessionQuery.isError]);

  const loginMutation = useMutation<StoredSession, Error, string>({
    mutationFn: (secret: string) => loginRequest({ secret }),
    onSuccess: (session) => {
      persistSession(session);
      setStoredSession(session);
      queryClient.setQueryData(['auth', 'session', session.secret], session);
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

  const session = sessionQuery.data ?? storedSession ?? null;
  const isAuthenticated = Boolean(session?.secret);
  const isLoading = !hasHydrated || sessionQuery.isFetching || loginMutation.isPending;
  const error = loginMutation.error?.message ?? sessionQuery.error?.message;

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      session,
      isLoading,
      error,
      login: async (secret: string) => {
        await loginMutation.mutateAsync(secret);
      },
      logout
    }),
    [error, isAuthenticated, isLoading, loginMutation, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return isLoading ? <div className="p-6 text-sm text-muted">Comprobando acceso...</div> : null;
  }

  return <>{children}</>;
}
