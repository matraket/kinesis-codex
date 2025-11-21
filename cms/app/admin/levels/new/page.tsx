'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

type LevelPayload = {
  code: string;
  name: string;
  description?: string;
  sequence: number;
};

async function createLevel(payload: LevelPayload) {
  const response = await apiClient.post('/api/admin/levels', payload);
  if (!response.ok) {
    let message = 'No se pudo crear el nivel';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function NewLevelPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<LevelPayload>({
    code: '',
    name: '',
    description: '',
    sequence: 0
  });

  const mutation = useMutation({
    mutationFn: createLevel,
    onSuccess: () => {
      router.push('/admin/levels');
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({
      code: formState.code.trim(),
      name: formState.name.trim(),
      description: formState.description?.trim() || undefined,
      sequence: formState.sequence
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta académica</p>
          <h3 className="text-2xl font-semibold text-white">Nuevo nivel</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/levels')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

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

        <div className="space-y-1">
          <label className="text-xs text-muted">Orden (sequence)</label>
          <input
            type="number"
            className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={formState.sequence}
            onChange={(e) => setFormState((s) => ({ ...s, sequence: Number(e.target.value) }))}
          />
        </div>

        {mutation.isError && (
          <p className="text-red-400 text-sm">
            {mutation.error instanceof Error ? mutation.error.message : 'No se pudo crear el nivel'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
          >
            {mutation.isPending ? 'Guardando...' : 'Crear nivel'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/levels')}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
