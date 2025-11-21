'use client';

import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Course = {
  id: string;
  code: string;
  name: string;
  status?: string;
  priceMonthly?: number | null;
  capacity?: number | null;
  specialtyId?: string | null;
  levelId?: string | null;
  roomId?: string | null;
  instructorId?: string | null;
  businessModelId?: string | null;
};

type CourseListResponse = {
  data: Course[];
  total: number;
};

type SimpleOption = { id: string; name: string };

async function fetchCourses(): Promise<Course[]> {
  const response = await apiClient.get('/api/admin/courses');
  if (!response.ok) {
    let message = 'No se pudo cargar cursos';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as CourseListResponse;
  return body.data ?? [];
}

async function deleteCourse(id: string) {
  const response = await apiClient.del(`/api/admin/courses/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar el curso';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

async function fetchOptions(path: string): Promise<SimpleOption[]> {
  const response = await apiClient.get(path);
  if (!response.ok) return [];
  const body = await response.json();
  const data: any[] = body?.data ?? [];
  return data.map((item) => ({ id: item.id, name: item.name ?? item.code ?? '—' }));
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: string }>({ search: '', status: 'all' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] })
  });

  const [specialties, levels, rooms, instructors, businessModels] = useQueries({
    queries: [
      { queryKey: ['options', 'specialties'], queryFn: () => fetchOptions('/api/admin/specialties') },
      { queryKey: ['options', 'levels'], queryFn: () => fetchOptions('/api/admin/levels') },
      { queryKey: ['options', 'rooms'], queryFn: () => fetchOptions('/api/admin/rooms') },
      { queryKey: ['options', 'instructors'], queryFn: () => fetchOptions('/api/admin/instructors') },
      { queryKey: ['options', 'businessModels'], queryFn: () => fetchOptions('/api/admin/business-models') }
    ]
  });

  const optionNameById = (list: SimpleOption[], id?: string | null) =>
    list.find((o) => o.id === id)?.name ?? '—';

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((course) => {
      const target = `${course.name} ${course.code}`.toLowerCase();
      const matchesSearch = !filters.search || target.includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'all' || (course.status ?? '').toLowerCase() === filters.status;
      return matchesSearch && matchesStatus;
    });
  }, [data, filters]);

  const goToNew = () => router.push('/admin/courses/new');
  const goToEdit = (id: string) => router.push(`/admin/courses/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Cursos / Actividades</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir curso
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
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="all">Todos</option>
            <option value="open">Abierto</option>
            <option value="closed">Cerrado</option>
            <option value="finalized">Finalizado</option>
          </select>
        </div>

        {isLoading && <p className="text-muted">Cargando cursos...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar cursos'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay cursos.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Precio mensual</th>
                  <th className="px-3 py-2">Capacidad</th>
                  <th className="px-3 py-2">Especialidad</th>
                  <th className="px-3 py-2">Nivel</th>
                  <th className="px-3 py-2">Sala</th>
                  <th className="px-3 py-2">Instructor</th>
                  <th className="px-3 py-2">Modelo de negocio</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{course.name}</td>
                    <td className="px-3 py-2 text-muted">{course.code}</td>
                    <td className="px-3 py-2 text-muted">{course.status ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">
                      {course.priceMonthly !== null && course.priceMonthly !== undefined ? `${course.priceMonthly} €` : '—'}
                    </td>
                    <td className="px-3 py-2 text-muted">{course.capacity ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">
                      {optionNameById(specialties.data ?? [], course.specialtyId)}
                    </td>
                    <td className="px-3 py-2 text-muted">{optionNameById(levels.data ?? [], course.levelId)}</td>
                    <td className="px-3 py-2 text-muted">{optionNameById(rooms.data ?? [], course.roomId)}</td>
                    <td className="px-3 py-2 text-muted">
                      {optionNameById(instructors.data ?? [], course.instructorId)}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {optionNameById(businessModels.data ?? [], course.businessModelId)}
                    </td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(course.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar este curso?');
                          if (confirmed) deleteMutation.mutate(course.id);
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
