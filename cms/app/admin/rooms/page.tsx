'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

type Room = {
  id: string;
  code: string;
  name: string;
  capacity?: number;
  surfaceM2?: number | null;
};

type RoomListResponse = {
  data: Room[];
  total: number;
};

async function fetchRooms(): Promise<Room[]> {
  const response = await apiClient.get('/api/admin/rooms');
  if (!response.ok) {
    let message = 'No se pudo cargar salas';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as RoomListResponse;
  return body.data ?? [];
}

async function deleteRoom(id: string) {
  const response = await apiClient.del(`/api/admin/rooms/${id}`);
  if (!response.ok) {
    let message = 'No se pudo borrar la sala';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function AdminRoomsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string }>({ search: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((room) => {
      const target = `${room.name} ${room.code}`.toLowerCase();
      return !filters.search || target.includes(filters.search.toLowerCase());
    });
  }, [data, filters]);

  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    }
  });

  const goToNew = () => router.push('/admin/rooms/new');
  const goToEdit = (id: string) => router.push(`/admin/rooms/${id}/edit`);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Infraestructura</p>
          <h3 className="text-2xl font-semibold text-white">Salas</h3>
        </div>
        <button
          type="button"
          onClick={goToNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Añadir sala
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Buscar por nombre o código"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {isLoading && <p className="text-muted">Cargando salas...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar salas'}</p>
        )}
        {!isLoading && !error && filtered.length === 0 && <p className="text-muted">No hay salas.</p>}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Capacidad</th>
                  <th className="px-3 py-2">Superficie (m²)</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room) => (
                  <tr key={room.id} className="border-b border-border/60">
                    <td className="px-3 py-2 font-medium">{room.name}</td>
                    <td className="px-3 py-2 text-muted">{room.code}</td>
                    <td className="px-3 py-2 text-muted">{room.capacity ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{room.surfaceM2 ?? '—'}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => goToEdit(room.id)}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm('¿Seguro que quieres borrar esta sala?');
                          if (confirmed) deleteMutation.mutate(room.id);
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
