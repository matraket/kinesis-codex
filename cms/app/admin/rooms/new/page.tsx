'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

type RoomPayload = {
  code: string;
  name: string;
  capacity?: number;
  surfaceM2?: number | null;
};

async function createRoom(payload: RoomPayload) {
  const response = await apiClient.post('/api/admin/rooms', payload);
  if (!response.ok) {
    let message = 'No se pudo crear la sala';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function NewRoomPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<RoomPayload>({
    code: '',
    name: '',
    capacity: undefined,
    surfaceM2: undefined
  });

  const mutation = useMutation({
    mutationFn: createRoom,
    onSuccess: () => router.push('/admin/rooms')
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({
      code: formState.code.trim(),
      name: formState.name.trim(),
      capacity: formState.capacity,
      surfaceM2: formState.surfaceM2
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Infraestructura</p>
          <h3 className="text-2xl font-semibold text-white">Nueva sala</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/rooms')}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted">Capacidad</label>
            <input
              type="number"
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              value={formState.capacity ?? ''}
              onChange={(e) => setFormState((s) => ({ ...s, capacity: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted">Superficie (m²)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              value={formState.surfaceM2 ?? ''}
              onChange={(e) => setFormState((s) => ({ ...s, surfaceM2: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </div>
        </div>

        {mutation.isError && (
          <p className="text-red-400 text-sm">
            {mutation.error instanceof Error ? mutation.error.message : 'No se pudo crear la sala'}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
          >
            {mutation.isPending ? 'Guardando...' : 'Crear sala'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/rooms')}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
