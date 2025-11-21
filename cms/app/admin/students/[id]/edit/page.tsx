'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

type StudentPayload = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
};

type StudentResponse = {
  data: StudentPayload;
};

async function fetchStudent(id: string): Promise<StudentPayload> {
  const response = await apiClient.get(`/api/admin/students/${id}`);
  if (!response.ok) {
    let message = 'No se pudo cargar el estudiante';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as StudentResponse;
  return body.data;
}

async function updateStudent(id: string, payload: StudentPayload) {
  const response = await apiClient.post(`/api/admin/students/${id}`, payload, { method: 'PUT' });
  if (!response.ok) {
    let message = 'No se pudo actualizar el estudiante';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function EditStudentPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [formState, setFormState] = useState<StudentPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: ''
  });

  const studentQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchStudent(id),
    enabled: Boolean(id)
  });

  useEffect(() => {
    if (studentQuery.data) {
      setFormState({
        firstName: studentQuery.data.firstName,
        lastName: studentQuery.data.lastName,
        email: studentQuery.data.email ?? '',
        phone: studentQuery.data.phone ?? '',
        status: studentQuery.data.status ?? ''
      });
    }
  }, [studentQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload: StudentPayload) => updateStudent(id, payload),
    onSuccess: () => router.push('/admin/students')
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateMutation.mutateAsync({
      ...formState,
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      email: formState.email?.trim() || undefined,
      phone: formState.phone?.trim() || undefined,
      status: formState.status?.trim() || undefined
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Alumnos</p>
          <h3 className="text-2xl font-semibold text-white">Editar estudiante</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/students')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      {studentQuery.isLoading && <p className="text-muted">Cargando estudiante...</p>}
      {studentQuery.isError && (
        <p className="text-red-400">
          {studentQuery.error instanceof Error ? studentQuery.error.message : 'No se pudo cargar el estudiante'}
        </p>
      )}

      {!studentQuery.isLoading && !studentQuery.isError && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-white/5 p-6 text-sm text-muted">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted">Nombre</label>
              <input
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.firstName}
                onChange={(e) => setFormState((s) => ({ ...s, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Apellidos</label>
              <input
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.lastName}
                onChange={(e) => setFormState((s) => ({ ...s, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.email}
                onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Teléfono</label>
              <input
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.phone}
                onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted">Estado</label>
            <input
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              value={formState.status}
              onChange={(e) => setFormState((s) => ({ ...s, status: e.target.value }))}
            />
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
              onClick={() => router.push('/admin/students')}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
