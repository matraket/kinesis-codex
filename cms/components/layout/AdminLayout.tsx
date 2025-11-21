'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/auth-context';

const navItems = [{ href: '/admin', label: 'Dashboard' }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-surface text-white">
      <aside className="fixed inset-y-0 w-64 border-r border-border bg-[#020617] px-4 py-6">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wide text-muted">Kinesis</p>
          <h1 className="text-xl font-semibold text-white">CMS</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="ml-64 min-h-screen">
        <header className="flex items-center justify-between border-b border-border bg-[#0F172A] px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Panel</p>
            <h2 className="text-lg font-semibold">Dashboard basico</h2>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Salir
          </button>
        </header>
        <main className="px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
