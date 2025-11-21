'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

type BonusPayload = {
  code: string;
  name: string;
  description?: string;
  sessionsTotal: number;
  priceTotal?: number;
  pricePerSession?: number;
  isActive?: boolean;
};

type BonusResponse = {
  data: BonusPayload;
};

async function fetchBonus(id: string): Promise<BonusPayload> {
  const response = await apiClient.get(`/api/admin/bonuses/${id}`);
  if (!response.ok) {
    let message = 'No se pudo cargar el bono';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as BonusResponse;
  return body.data;
}

async function updateBonus(id: string, payload: BonusPayload) {
  const response = await apiClient.post(`/api/admin/bonuses/${id}`, payload, { method: 'PUT' });
  if (!response.ok) {
    let message = 'No se pudo actualizar el bono';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function EditBonusPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [formState, setFormState] = useState<BonusPayload>({
    code: '',
    name: '',
    description: '',
    sessionsTotal: 1,
    priceTotal: undefined,
    pricePerSession: undefined,
    isActive: true
  });

  const bonusQuery = useQuery({
    queryKey: ['bonus', id],
    queryFn: () => fetchBonus(id),
    enabled: Boolean(id)
  });

  useEffect(() => {
    if (bonusQuery.data) {
      setFormState(bonusQuery.data);
    }
  }, [bonusQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (payload: BonusPayload) => updateBonus(id, payload),
    onSuccess: () => router.push('/admin/bonuses')
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
          <p className="text-xs uppercase tracking-wide text-muted">Packs</p>
          <h3 className="text-2xl font-semibold text-white">Editar bono</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/bonuses')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      {bonusQuery.isLoading && <p className="text-muted">Cargando bono...</p>}
      {bonusQuery.isError && (
        <p className="text-red-400">
          {bonusQuery.error instanceof Error ? bonusQuery.error.message : 'No se pudo cargar el bono'}
        </p>
      )}

      {!bonusQuery.isLoading && !bonusQuery.isError && (
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
              <label className="text-xs text-muted">Sesiones totales</label>
              <input
                type="number"
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.sessionsTotal}
                onChange={(e) => setFormState((s) => ({ ...s, sessionsTotal: Number(e.target.value) }))}
                min={1}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Precio total (€)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.priceTotal ?? ''}
                onChange={(e) => setFormState((s) => ({ ...s, priceTotal: e.target.value ? Number(e.target.value) : undefined }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted">Precio por sesión (€)</label>
              <input
                type="number"
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.pricePerSession ?? ''}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, pricePerSession: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={formState.isActive ?? true}
              onChange={(e) => setFormState((s) => ({ ...s, isActive: e.target.checked }))}
            />
            Activo
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
              onClick={() => router.push('/admin/bonuses')}
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
