'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLeads, fetchLeadStats, type LeadRow } from '@/features/leads/api';
import { DataTable } from '@/components/ui/data-table';
import { StatusPill } from '@/components/ui/status-pill';
import { TableSkeleton } from '@/components/feedback/skeletons';
import { useState } from 'react';

const statusVariants: Record<string, 'info' | 'success' | 'warning' | 'danger'> = {
  open: 'info',
  contacted: 'warning',
  converted: 'success',
  closed: 'danger'
};

export default function LeadsPage() {
  const [filters, setFilters] = useState<{ status?: string; type?: string; date?: string }>({});
  const { data, isLoading } = useQuery({ queryKey: ['leads', filters], queryFn: () => fetchLeads(filters) });
  const { data: stats } = useQuery({ queryKey: ['lead-stats'], queryFn: fetchLeadStats });

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Filtrar por estado"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={filters.status ?? ''}
          onChange={(event) => updateFilter('status', event.target.value)}
        >
          <option value="">Estado</option>
          <option value="open">Abierto</option>
          <option value="contacted">Contactado</option>
          <option value="converted">Convertido</option>
          <option value="closed">Cerrado</option>
        </select>
        <select
          aria-label="Filtrar por tipo"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={filters.type ?? ''}
          onChange={(event) => updateFilter('type', event.target.value)}
        >
          <option value="">Tipo</option>
          <option value="demo">Demo</option>
          <option value="newsletter">Newsletter</option>
          <option value="webinar">Webinar</option>
        </select>
        <input
          type="date"
          aria-label="Filtrar por fecha"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={filters.date ?? ''}
          onChange={(event) => updateFilter('date', event.target.value)}
        />
        {stats && <span className="text-sm text-slate-600 dark:text-slate-300">Totales: {stats.total}</span>}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable<LeadRow>
          columns={[
            { key: 'name', header: 'Nombre' },
            { key: 'email', header: 'Email' },
            {
              key: 'status',
              header: 'Estado',
              render: (value) => <StatusPill label={String(value)} variant={statusVariants[String(value)] ?? 'info'} />
            },
            { key: 'source', header: 'Origen' },
            {
              key: 'createdAt',
              header: 'Fecha',
              render: (value) => new Date(String(value)).toLocaleDateString('es-ES')
            }
          ]}
          data={data ?? []}
          emptyLabel="Aún no hay leads con estos filtros"
        />
      )}
    </div>
  );
}
