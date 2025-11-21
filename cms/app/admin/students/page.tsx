'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
};

type StudentListResponse = {
  data: Student[];
  total: number;
};

async function fetchStudents(): Promise<Student[]> {
  const response = await apiClient.get('/api/admin/students');
  if (!response.ok) {
    let message = 'No se pudo cargar estudiantes';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as StudentListResponse;
  return body.data ?? [];
}

async function deleteStudent(id: string) {
  const response = await apiClient.del(`/api/admin/students/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el estudiante';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: string }>({ search: '', status: 'all' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((student) => {
      const full = `${student.firstName} ${student.lastName} ${student.email ?? ''}`.toLowerCase();
      const matchesSearch = !filters.search || full.includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || (student.status ?? '').toLowerCase() === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] })
  });

  const goToNew = () => router.push('/admin/students/new');
  const goToEdit = (id: string) => router.push(`/admin/students/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Alumnos</p>
          <h3 className="text-2xl font-semibold text-white">Estudiantes</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir estudiante
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o email"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          <select
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>

        {isLoading && <p className="text-muted">Cargando estudiantes...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar estudiantes'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay estudiantes.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr key={student.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="px-3 py-2 text-muted">{student.email ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{student.phone ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{student.status ?? '—'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(student.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este estudiante?');
                          if (confirmed) deleteMutation.mutate(student.id);
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
