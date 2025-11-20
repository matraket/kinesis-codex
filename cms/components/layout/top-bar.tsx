'use client';

import { MoonIcon, SunIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAdminSession } from '@/features/auth/hooks';
import { useRouter } from 'next/navigation';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { session, logout } = useAdminSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Kinesis Admin</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Panel de control</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {mounted && (
          <button
            type="button"
            aria-label="Cambiar tema"
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        )}
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <span>{session?.alias ?? 'Admin'}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Salir
        </button>
      </div>
    </header>
  );
}
