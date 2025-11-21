'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type ProgramListItem = {
  id: string;
  code: string;
  name: string;
  isActive?: boolean;
  showOnWeb?: boolean;
};

type ProgramPayload = {
  code: string;
  name: string;
  isActive?: boolean;
  showOnWeb?: boolean;
};

async function fetchPrograms(): Promise<ProgramListItem[]> {
  const response = await apiClient.get('/api/admin/programs');
  if (!response.ok) {
    let message = 'No se pudo cargar la lista de programas';
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const payload = (await response.json()) as { data?: ProgramListItem[] };
  return payload.data ?? [];
}

async function createProgram(payload: ProgramPayload) {
  const response = await apiClient.post('/api/admin/programs', payload);
  if (!response.ok) {
    let message = 'No se pudo crear el programa';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

async function updateProgram(id: string, payload: ProgramPayload) {
  const response = await apiClient.post(`/api/admin/programs/${id}`, payload, { method: 'PUT' });
  if (!response.ok) {
    let message = 'No se pudo actualizar el programa';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

async function deleteProgram(id: string) {
  const response = await apiClient.del(`/api/admin/programs/${id}`);
  if (!response.ok) {
    let message = 'No se pudo eliminar el programa';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminContentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: 'all' | 'active' | 'inactive'; visibility: 'all' | 'web' | 'hidden' }>({
    search: '',
    status: 'all',
    visibility: 'all'
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['programs'],
    queryFn: fetchPrograms
  });

  const createMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      router.push('/admin/content');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProgramPayload }) => updateProgram(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      router.push('/admin/content');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    }
  });

  const filteredPrograms = useMemo(() => {
    if (!data) return [];
    return data.filter((program) => {
      const matchesSearch =
        !filters.search ||
        program.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        program.code?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' ? program.isActive : !program.isActive);
      const matchesVisibility =
        filters.visibility === 'all' ||
        (filters.visibility === 'web' ? program.showOnWeb : !program.showOnWeb);
      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [data, filters]);

  const goToNew = () => router.push('/admin/content/new');
  const goToEdit = (id: string) => router.push(`/admin/content/${id}/edit`);

  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold text-white">Contenidos</h3>
      <p className="text-sm text-muted">Programas (lectura con acciones de alta/edición/borrado).</p>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-white/5 p-4 text-sm text-muted">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <select
              className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              value={filters.visibility}
              onChange={(e) =>
                setFilters((f) => ({ ...f, visibility: e.target.value as typeof f.visibility }))
              }
            >
              <option value="all">Todos</option>
              <option value="web">Visibles web</option>
              <option value="hidden">Ocultos web</option>
            </select>
          </div>
          <button
            type="button"
            onClick={goToNew}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Añadir programa
          </button>
        </div>

        {isLoading && <p className="text-muted">Cargando programas...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar programas'}</p>
        )}
        {!isLoading && !error && (filteredPrograms?.length ?? 0) === 0 && (
          <p className="text-muted">No hay programas disponibles.</p>
        )}

        {!isLoading && !error && (filteredPrograms?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Activo</th>
                  <th className="px-3 py-2">Visible web</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms?.map((program) => (
                  <tr key={program.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{program.name ?? 'Sin nombre'}</td>
                    <td className="px-3 py-2 text-muted">{program.code ?? '—'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          program.isActive ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-muted'
                        }`}
                      >
                        {program.isActive ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          program.showOnWeb ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-muted'
                        }`}
                      >
                        {program.showOnWeb ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(program.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este programa?');
                          if (confirmed) deleteMutation.mutate(program.id);
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
