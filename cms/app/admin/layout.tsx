'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { AuthGuard } from '@/features/auth/auth-context';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  // En /admin/login no usamos layout ni guard para evitar bucles.
  if (isLogin) return <>{children}</>;

  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
