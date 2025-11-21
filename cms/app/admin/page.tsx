'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type DashboardSummary = {
  leads: { total: number; open: number; closed: number; trend?: string };
  pages: { published: number; legal: number };
  settings: { active: number; outdated: boolean };
};

async function fetchDashboard(): Promise<DashboardSummary> {
  const response = await apiClient.get('/api/admin/dashboard');
  if (!response.ok) {
    let message = 'No se pudo cargar el dashboard';
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
  const data = (await response.json()) as DashboardSummary;
  return data;
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboard,
    staleTime: 60_000
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Panel</p>
          <h3 className="text-2xl font-semibold text-white">Dashboard</h3>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-border bg-white/5 p-6 text-sm text-muted">
          Cargando resumen...
        </div>
      )}

      {error instanceof Error && (
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 text-sm text-red-100">
          Error: {error.message}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Leads</p>
            <h4 className="mt-1 text-3xl font-semibold text-white">{data.leads.total}</h4>
            <p className="mt-1 text-sm text-muted">
              Abiertos: {data.leads.open} · Cerrados:{' '}
              {data.leads.closed} {data.leads.trend ? `· Tendencia ${data.leads.trend}` : ''}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Contenidos publicados</p>
            <h4 className="mt-1 text-3xl font-semibold text-white">{data.pages.published}</h4>
            <p className="mt-1 text-sm text-muted">Páginas legales: {data.pages.legal}</p>
          </div>

          <div className="rounded-xl border border-border bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Ajustes</p>
            <h4 className="mt-1 text-3xl font-semibold text-white">{data.settings.active}</h4>
            <p className="mt-1 text-sm text-muted">
              Estado: {data.settings.outdated ? 'Desactualizados' : 'Actualizados'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
