'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { ToastProvider } from '@/components/feedback/toast-provider';
import { SessionBoundary } from '@/features/auth/session-boundary';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000
          }
        }
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="kinesis-theme">
      <QueryClientProvider client={queryClient}>
        <SessionBoundary>
          <ToastProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          </ToastProvider>
        </SessionBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
