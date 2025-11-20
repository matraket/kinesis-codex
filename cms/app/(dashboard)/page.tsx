"use client";

import { StatCard } from '@/components/ui/stat-card';
import { StatusPill } from '@/components/ui/status-pill';
import { CardSkeleton } from '@/components/feedback/skeletons';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '@/features/leads/api';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Leads totales" value={data?.leads.total ?? '—'} helper="Últimos 30 días" trend={data?.leads.trend} />
            <StatCard title="Páginas publicadas" value={data?.pages.published ?? '—'} helper="Landing y legales" />
            <StatCard title="Estado de settings" value={data?.settings.active ?? '—'} helper="Claves críticas" />
          </>
        )}
      </div>
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Alertas rápidas</h2>
          {data?.settings.outdated && <StatusPill label="Configuración desactualizada" variant="warning" />}
        </div>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li>Leads abiertos: {data?.leads.open ?? '—'}</li>
          <li>Leads cerrados: {data?.leads.closed ?? '—'}</li>
          <li>Páginas legales auditadas: {data?.pages.legal ?? '—'}</li>
        </ul>
      </div>
    </div>
  );
}
