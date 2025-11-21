'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

type SpecialtyPayload = {
  code: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  displayOrder?: number;
};

type SpecialtyResponse = {
  data: SpecialtyPayload;
};

async function fetchSpecialty(id: string): Promise<SpecialtyPayload> {
  const response = await apiClient.get(`/api/admin/specialties/${id}`);
  if (!response.ok) {
    let message = 'No se pudo cargar la especialidad';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as SpecialtyResponse;
  return body.data;
}

async function updateSpecialty(id: string, payload: SpecialtyPayload) {
  const response = await apiClient.post(`/api/admin/specialties/${id}`, payload, { method: 'PUT' });
  if (!response.ok) {
    let message = 'No se pudo actualizar la especialidad';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function EditSpecialtyPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [formState, setFormState] = useState<SpecialtyPayload>({
    code: '',
    name: '',
    description: '',
    category: '',
    isActive: true,
    displayOrder: 0
  });

  const specialtyQuery = useQuery({
    queryKey: ['specialty', id],
    queryFn: () => fetchSpecialty(id),
    enabled: Boolean(id)
  });

  useEffect(() => {
    if (specialtyQuery.data) {
      setFormState({
        code: specialtyQuery.data.code,
        name: specialtyQuery.data.name,
        description: specialtyQuery.data.description ?? '',
        category: specialtyQuery.data.category ?? '',
        isActive: specialtyQuery.data.isActive ?? true,
        displayOrder: specialtyQuery.data.displayOrder ?? 0
      });
    }
  }, [specialtyQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload: SpecialtyPayload) => updateSpecialty(id, payload),
    onSuccess: () => router.push('/admin/specialties')
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateMutation.mutateAsync({
      code: formState.code.trim(),
      name: formState.name.trim(),
      description: formState.description?.trim() || undefined,
      category: formState.category?.trim() || undefined,
      isActive: formState.isActive,
      displayOrder: formState.displayOrder
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Editar especialidad</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/specialties')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      {specialtyQuery.isLoading && <p className="text-muted">Cargando especialidad...</p>}
      {specialtyQuery.isError && (
        <p className="text-red-400">
          {specialtyQuery.error instanceof Error ? specialtyQuery.error.message : 'No se pudo cargar la especialidad'}
        </p>
      )}

      {!specialtyQuery.isLoading && !specialtyQuery.isError && (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-white/5 p-6 text-sm text-muted">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-muted">Categoría</label>
              <input
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.category}
                onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Orden</label>
              <input
                type="number"
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.displayOrder ?? 0}
                onChange={(e) => setFormState((s) => ({ ...s, displayOrder: Number(e.target.value) }))}
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

          <label className="inline-flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={formState.isActive ?? true}
              onChange={(e) => setFormState((s) => ({ ...s, isActive: e.target.checked }))}
            />
            Activa
          </label>

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
              onClick={() => router.push('/admin/specialties')}
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
