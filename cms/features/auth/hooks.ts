'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, loginAdmin, logoutAdmin } from './services';
import { useSessionStore } from '@/store/session.store';

export function useAdminSession() {
  const queryClient = useQueryClient();
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);

  const {
    data: session,
    status,
    refetch
  } = useQuery({
    queryKey: ['admin-session'],
    queryFn: async () => {
      const current = await getSession();
      if (current) {
        setSession(current);
      }
      return current;
    },
    staleTime: 60_000
  });

  const refreshSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    await logoutAdmin();
    clearSession();
    await queryClient.invalidateQueries();
  }, [clearSession, queryClient]);

  return { session, status, refreshSession, logout };
}

export function useLogin() {
  const queryClient = useQueryClient();

  const submit = useCallback(
    async (payload: { alias: string; secret: string }) => {
      const session = await loginAdmin(payload);
      await queryClient.invalidateQueries({ queryKey: ['admin-session'] });
      return session;
    },
    [queryClient]
  );

  return { submit };
}
