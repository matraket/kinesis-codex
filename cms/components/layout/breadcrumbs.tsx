'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
        </li>
        {segments.map((segment, idx) => {
          const href = `/${segments.slice(0, idx + 1).join('/')}`;
          return (
            <li key={href} className="flex items-center gap-2 capitalize">
              <span aria-hidden>/</span>
              {idx === segments.length - 1 ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100">{segment}</span>
              ) : (
                <Link href={href} className="hover:text-primary">
                  {segment}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
