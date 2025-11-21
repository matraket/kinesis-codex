'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Bonus = {
  id: string;
  code: string;
  name: string;
  description?: string;
  sessionsTotal: number;
  priceTotal?: number | null;
  pricePerSession?: number | null;
  isActive?: boolean;
};

type BonusListResponse = {
  data: Bonus[];
  total: number;
};

async function fetchBonuses(): Promise<Bonus[]> {
  const response = await apiClient.get('/api/admin/bonuses');
  if (!response.ok) {
    let message = 'No se pudo cargar bonos';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as BonusListResponse;
  return body.data ?? [];
}

async function deleteBonus(id: string) {
  const response = await apiClient.del(`/api/admin/bonuses/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el bono';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminBonusesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: 'all' | 'active' | 'inactive' }>({
    search: '',
    status: 'all'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['bonuses'],
    queryFn: fetchBonuses
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((bonus) => {
      const target = `${bonus.name} ${bonus.code}`.toLowerCase();
      const matchesSearch = !filters.search || target.includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' ? bonus.isActive !== false : bonus.isActive === false);
      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteBonus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bonuses'] })
  });

  const goToNew = () => router.push('/admin/bonuses/new');
  const goToEdit = (id: string) => router.push(`/admin/bonuses/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Packs</p>
          <h3 className="text-2xl font-semibold text-white">Bonos</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir bono
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o código"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          <select
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as typeof f.status }))}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        {isLoading && <p className="text-muted">Cargando bonos...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar bonos'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay bonos.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Sesiones</th>
                  <th className="px-3 py-2">Precio total</th>
                  <th className="px-3 py-2">Precio/sesión</th>
                  <th className="px-3 py-2">Activo</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bonus) => (
                  <tr key={bonus.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{bonus.name}</td>
                    <td className="px-3 py-2 text-muted">{bonus.code}</td>
                    <td className="px-3 py-2 text-muted">{bonus.sessionsTotal}</td>
                    <td className="px-3 py-2 text-muted">
                      {bonus.priceTotal !== null && bonus.priceTotal !== undefined ? `${bonus.priceTotal} €` : '—'}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {bonus.pricePerSession !== null && bonus.pricePerSession !== undefined
                        ? `${bonus.pricePerSession} €`
                        : '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          bonus.isActive ?? true ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-muted'
                        }`}
                      >
                        {bonus.isActive ?? true ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(bonus.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este bono?');
                          if (confirmed) deleteMutation.mutate(bonus.id);
                        }}
                        className="rounded-lg border border-red-500 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-70"
                        disabled={deleteMutation.isPending}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
