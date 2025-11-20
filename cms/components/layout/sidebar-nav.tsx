'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/leads', label: 'Leads' },
  { href: '/settings', label: 'Settings' }
];

export function SidebarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <aside className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-4 md:hidden">
        <span className="text-lg font-semibold">Kinesis CMS</span>
        <button aria-label="Toggle navigation" onClick={toggle} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      <nav className={clsx('px-4 pb-4 md:block', { hidden: !open, block: open })} aria-label="Navegación principal">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-primary/10 hover:text-primary',
                    active ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-200'
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
