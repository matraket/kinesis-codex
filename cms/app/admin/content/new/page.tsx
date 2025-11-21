'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type ProgramPayload = {
  code: string;
  name: string;
  isActive?: boolean;
  showOnWeb?: boolean;
};

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

export default function NewProgramPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<ProgramPayload>({
    code: '',
    name: '',
    isActive: true,
    showOnWeb: true
  });

  const createMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      router.push('/admin/content');
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createMutation.mutateAsync({
      code: formState.code.trim(),
      name: formState.name.trim(),
      isActive: formState.isActive,
      showOnWeb: formState.showOnWeb
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Contenidos</p>
          <h3 className="text-2xl font-semibold text-white">Nuevo programa</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/content')}
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

        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(e) => setFormState((s) => ({ ...s, isActive: e.target.checked }))}
            />
            Activo
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={formState.showOnWeb}
              onChange={(e) => setFormState((s) => ({ ...s, showOnWeb: e.target.checked }))}
            />
            Visible web
          </label>
        </div>

        {createMutation.isError && (
          <p className="text-red-400 text-sm">
            {createMutation.error instanceof Error ? createMutation.error.message : 'No se pudo crear el programa'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear programa'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/content')}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
