'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type BusinessModel = {
  id: string;
  internalCode: string;
  name: string;
  subtitle?: string;
  description?: string;
  format?: string;
  displayOrder?: number;
  slug?: string;
};

type BusinessModelListResponse = {
  data: BusinessModel[];
  total: number;
};

type BusinessModelPayload = {
  internalCode: string;
  name: string;
  subtitle?: string;
  description: string;
  format?: string;
  displayOrder?: number;
  slug: string;
};

async function fetchBusinessModels(): Promise<BusinessModel[]> {
  const response = await apiClient.get('/api/admin/business-models');
  if (!response.ok) {
    let message = 'No se pudo cargar modelos de negocio';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as BusinessModelListResponse;
  return body.data ?? [];
}

async function deleteBusinessModel(id: string) {
  const response = await apiClient.del(`/api/admin/business-models/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el modelo';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminBusinessModelsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string }>({ search: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['business-models'],
    queryFn: fetchBusinessModels
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const target = `${item.name} ${item.internalCode} ${item.subtitle ?? ''}`.toLowerCase();
      return !filters.search || target.includes(filters.search.toLowerCase());
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-models'] });
    }
  });

  const goToNew = () => router.push('/admin/business-models/new');
  const goToEdit = (id: string) => router.push(`/admin/business-models/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta</p>
          <h3 className="text-2xl font-semibold text-white">Modelos de negocio</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir modelo
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o código interno"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {isLoading && <p className="text-muted">Cargando modelos de negocio...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar modelos'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay modelos de negocio.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código interno</th>
                  <th className="px-3 py-2">Slug</th>
                  <th className="px-3 py-2">Orden</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{item.name}</td>
                    <td className="px-3 py-2 text-muted">{item.internalCode}</td>
                    <td className="px-3 py-2 text-muted">{item.slug ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{item.displayOrder ?? 0}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(item.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este modelo?');
                          if (confirmed) deleteMutation.mutate(item.id);
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
