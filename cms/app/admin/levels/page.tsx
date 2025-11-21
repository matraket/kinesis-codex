'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Level = {
  id: string;
  code: string;
  name: string;
  description?: string;
  sequence: number;
};

type LevelListResponse = {
  data: Level[];
  total: number;
};

async function fetchLevels(): Promise<Level[]> {
  const response = await apiClient.get('/api/admin/levels');
  if (!response.ok) {
    let message = 'No se pudo cargar niveles';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as LevelListResponse;
  return body.data ?? [];
}

async function deleteLevel(id: string) {
  const response = await apiClient.del(`/api/admin/levels/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el nivel';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminLevelsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string }>({ search: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['levels'],
    queryFn: fetchLevels
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((level) => {
      const target = `${level.name} ${level.code}`.toLowerCase();
      return !filters.search || target.includes(filters.search.toLowerCase());
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['levels'] });
    }
  });

  const goToNew = () => router.push('/admin/levels/new');
  const goToEdit = (id: string) => router.push(`/admin/levels/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Niveles</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir nivel
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o código"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {isLoading && <p className="text-muted">Cargando niveles...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar niveles'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay niveles.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Orden</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((level) => (
                  <tr key={level.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{level.name}</td>
                    <td className="px-3 py-2 text-muted">{level.code}</td>
                    <td className="px-3 py-2 text-muted">{level.sequence}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(level.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este nivel?');
                          if (confirmed) deleteMutation.mutate(level.id);
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
