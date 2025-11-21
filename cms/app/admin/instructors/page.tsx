'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
};

type InstructorListResponse = {
  data: Instructor[];
  total: number;
};

async function fetchInstructors(): Promise<Instructor[]> {
  const response = await apiClient.get('/api/admin/instructors');
  if (!response.ok) {
    let message = 'No se pudo cargar instructores';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as InstructorListResponse;
  return body.data ?? [];
}

async function deleteInstructor(id: string) {
  const response = await apiClient.del(`/api/admin/instructors/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el instructor';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminInstructorsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string }>({ search: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: fetchInstructors
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((inst) => {
      const fullName = `${inst.firstName || ''} ${inst.lastName || ''} ${inst.displayName || ''}`.toLowerCase();
      return !filters.search || fullName.includes(filters.search.toLowerCase());
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    }
  });

  const goToNew = () => router.push('/admin/instructors/new');
  const goToEdit = (id: string) => router.push(`/admin/instructors/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Equipo</p>
          <h3 className="text-2xl font-semibold text-white">Instructores</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir instructor
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o email"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {isLoading && <p className="text-muted">Cargando instructores...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar instructores'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay instructores.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2">Rol</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst) => (
                  <tr key={inst.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">
                      {inst.displayName || `${inst.firstName} ${inst.lastName}`}
                    </td>
                    <td className="px-3 py-2 text-muted">{inst.email || '—'}</td>
                    <td className="px-3 py-2 text-muted">{inst.phone || '—'}</td>
                    <td className="px-3 py-2 text-muted">{inst.role || '—'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(inst.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este instructor?');
                          if (confirmed) deleteMutation.mutate(inst.id);
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
