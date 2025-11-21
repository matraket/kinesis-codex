'use client';

import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { TabSwitcher } from '@/components/ui/Tabs';
import { WebContentEditor } from '@/components/ui/WebContentEditor';

type CoursePayload = {
  code: string;
  name: string;
  description?: string;
  programId?: string;
  specialtyId?: string;
  levelId?: string;
  businessModelId?: string;
  roomId?: string;
  instructorId?: string;
  scheduleDescription?: string;
  priceMonthly?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
};

type CourseResponse = {
  data: CoursePayload & { startDate?: string; endDate?: string };
};

type SimpleOption = { id: string; name: string };

async function fetchCourse(id: string): Promise<CoursePayload> {
  const response = await apiClient.get(`/api/admin/courses/${id}`);
  if (!response.ok) {
    let message = 'No se pudo cargar el curso';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as CourseResponse;
  const startDate = body.data.startDate ? body.data.startDate.slice(0, 10) : '';
  const endDate = body.data.endDate ? body.data.endDate.slice(0, 10) : '';
  return { ...body.data, startDate, endDate };
}

async function updateCourse(id: string, payload: CoursePayload) {
  const response = await apiClient.post(`/api/admin/courses/${id}`, {
    ...payload,
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    endDate: payload.endDate ? new Date(payload.endDate) : undefined
  }, { method: 'PUT' });
  if (!response.ok) {
    let message = 'No se pudo actualizar el curso';
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

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'data' | 'web'>('data');
  const [formState, setFormState] = useState<CoursePayload>({
    code: '',
    name: '',
    description: '',
    programId: '',
    specialtyId: '',
    levelId: '',
    businessModelId: '',
    roomId: '',
    instructorId: '',
    scheduleDescription: '',
    priceMonthly: undefined,
    status: 'open',
    startDate: '',
    endDate: '',
    capacity: undefined
  });

  const courseQuery = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourse(id),
    enabled: Boolean(id)
  });

  useEffect(() => {
    if (courseQuery.data) {
      setFormState(courseQuery.data);
    }
  }, [courseQuery.data]);

  const [programs, specialties, levels, rooms, instructors, businessModels] = useQueries({
    queries: [
      { queryKey: ['options', 'programs'], queryFn: () => fetchOptions('/api/admin/programs') },
      { queryKey: ['options', 'specialties'], queryFn: () => fetchOptions('/api/admin/specialties') },
      { queryKey: ['options', 'levels'], queryFn: () => fetchOptions('/api/admin/levels') },
      { queryKey: ['options', 'rooms'], queryFn: () => fetchOptions('/api/admin/rooms') },
      { queryKey: ['options', 'instructors'], queryFn: () => fetchOptions('/api/admin/instructors') },
      { queryKey: ['options', 'businessModels'], queryFn: () => fetchOptions('/api/admin/business-models') }
    ]
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CoursePayload) => updateCourse(id, payload),
    onSuccess: () => router.push('/admin/courses')
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateMutation.mutateAsync({
      ...formState,
      code: formState.code.trim(),
      name: formState.name.trim(),
      description: formState.description?.trim() || undefined
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Editar curso</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/courses')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      {courseQuery.isLoading && <p className="text-muted">Cargando curso...</p>}
      {courseQuery.isError && (
        <p className="text-red-400">
          {courseQuery.error instanceof Error ? courseQuery.error.message : 'No se pudo cargar el curso'}
        </p>
      )}

      {!courseQuery.isLoading && !courseQuery.isError && (
        <div className="space-y-3">
          <TabSwitcher
            tabs={[
              { id: 'data', label: 'Datos' },
              { id: 'web', label: 'Vista web', description: 'Preparar ficha pública' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'data' && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-xl border border-border bg-white/5 p-6 text-sm text-muted"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted">Código</label>
                  <input
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.code}
                    onChange={(e) => setFormState((s) => ({ ...s, code: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Nombre</label>
                  <input
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted">Descripción</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted">Programa</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.programId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, programId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(programs.data ?? []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Especialidad</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.specialtyId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, specialtyId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(specialties.data ?? []).map((sp) => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Nivel</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.levelId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, levelId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(levels.data ?? []).map((lv) => (
                      <option key={lv.id} value={lv.id}>
                        {lv.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted">Modelo de negocio</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.businessModelId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, businessModelId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(businessModels.data ?? []).map((bm) => (
                      <option key={bm.id} value={bm.id}>
                        {bm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Sala</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.roomId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, roomId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(rooms.data ?? []).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Instructor</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.instructorId ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, instructorId: e.target.value || undefined }))}
                  >
                    <option value="">(opcional)</option>
                    {(instructors.data ?? []).map((ins) => (
                      <option key={ins.id} value={ins.id}>
                        {ins.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted">Horario / descripción</label>
                <textarea
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  rows={2}
                  value={formState.scheduleDescription ?? ''}
                  onChange={(e) => setFormState((s) => ({ ...s, scheduleDescription: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted">Precio mensual (€)</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.priceMonthly ?? ''}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, priceMonthly: e.target.value ? Number(e.target.value) : undefined }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Estado</label>
                  <select
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.status ?? 'open'}
                    onChange={(e) => setFormState((s) => ({ ...s, status: e.target.value }))}
                  >
                    <option value="open">Abierto</option>
                    <option value="closed">Cerrado</option>
                    <option value="finalized">Finalizado</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Capacidad</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.capacity ?? ''}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, capacity: e.target.value ? Number(e.target.value) : undefined }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted">Fecha inicio</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.startDate ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted">Fecha fin</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                    value={formState.endDate ?? ''}
                    onChange={(e) => setFormState((s) => ({ ...s, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {updateMutation.isError && (
                <p className="text-red-400 text-sm">
                  {updateMutation.error instanceof Error ? updateMutation.error.message : 'No se pudo guardar'}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
                >
                  {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/courses')}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {activeTab === 'web' && <WebContentEditor entityLabel={`curso-${id}`} />}
        </div>
      )}
    </section>
  );
}
