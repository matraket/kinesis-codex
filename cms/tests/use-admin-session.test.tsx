import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminSession } from '@/features/auth/hooks';
import '@testing-library/jest-dom';

vi.mock('@/features/auth/services', () => ({
  getSession: vi.fn(async () => ({ alias: 'qa', createdAt: new Date().toISOString() })),
  logoutAdmin: vi.fn(async () => ({})),
  loginAdmin: vi.fn()
}));

vi.mock('@/store/session.store', async () => {
  const actual = await vi.importActual<typeof import('@/store/session.store')>('@/store/session.store');
  return {
    ...actual,
    useSessionStore: vi.fn(() => ({ setSession: vi.fn(), clearSession: vi.fn() }))
  };
});

describe('useAdminSession', () => {
  it('carga la sesión actual', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAdminSession(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.session?.alias).toBe('qa');
  });
});
