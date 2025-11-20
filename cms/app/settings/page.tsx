'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings, type SettingRow } from '@/features/settings/api';
import { StatusPill } from '@/components/ui/status-pill';
import { TableSkeleton } from '@/components/feedback/skeletons';

export default function SettingsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });

  const grouped = useMemo(() => {
    const groups: Record<string, SettingRow[]> = {};
    const items = Array.isArray(data) ? data : [];
    items.forEach((item) => {
      const category = item.category || 'other';
      groups[category] = groups[category] ? [...groups[category], item] : [item];
    });
    return groups;
  }, [data]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="card space-y-3">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{category}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Últimas actualizaciones</p>
              </div>
              <StatusPill label={`${items.length} claves`} variant="info" />
            </header>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => (
                <div key={item.id} className="py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.key}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Actualizado: {new Date(item.updatedAt).toLocaleString('es-ES')}</p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
