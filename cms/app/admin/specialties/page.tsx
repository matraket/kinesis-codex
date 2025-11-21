'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Specialty = {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  displayOrder?: number;
};

type SpecialtyListResponse = {
  data: Specialty[];
  total: number;
};

async function fetchSpecialties(): Promise<Specialty[]> {
  const response = await apiClient.get('/api/admin/specialties');
  if (!response.ok) {
    let message = 'No se pudo cargar especialidades';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as SpecialtyListResponse;
  return body.data ?? [];
}

async function deleteSpecialty(id: string) {
  const response = await apiClient.del(`/api/admin/specialties/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar la especialidad';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminSpecialtiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: 'all' | 'active' | 'inactive' }>({
    search: '',
    status: 'all'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: fetchSpecialties
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.code.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' ? item.isActive !== false : item.isActive === false);
      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteSpecialty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    }
  });

  const goToNew = () => router.push('/admin/specialties/new');
  const goToEdit = (id: string) => router.push(`/admin/specialties/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Especialidades</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir especialidad
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
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>

        {isLoading && <p className="text-muted">Cargando especialidades...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar especialidades'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay especialidades.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Categoría</th>
                  <th className="px-3 py-2">Activa</th>
                  <th className="px-3 py-2">Orden</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{item.name}</td>
                    <td className="px-3 py-2 text-muted">{item.code}</td>
                    <td className="px-3 py-2 text-muted">{item.category ?? '—'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          item.isActive ?? true ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-muted'
                        }`}
                      >
                        {item.isActive ?? true ? 'Sí' : 'No'}
                      </span>
                    </td>
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
                          const confirmed = window.confirm('¿Seguro que quieres borrar esta especialidad?');
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
