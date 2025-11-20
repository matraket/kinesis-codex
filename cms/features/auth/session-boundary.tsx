'use client';

import { useAdminSession } from './hooks';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function SessionBoundary({ children }: { children: React.ReactNode }) {
  const { session, status, refreshSession } = useAdminSession();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/login') {
      router.replace('/login');
      void queryClient.cancelQueries();
    }
  }, [pathname, queryClient, router, status]);

  return <>{children}</>;
}
