'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';

type Lead = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  leadType?: string;
  leadStatus?: string;
  source?: string;
  campaign?: string;
  notes?: string;
};

type LeadListResponse = {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

async function fetchLeads(filters: Record<string, string>) {
  const params = new URLSearchParams(filters);
  const response = await apiClient.get(`/api/admin/leads?${params.toString()}`);
  if (!response.ok) {
    let message = 'No se pudo cargar leads';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  const body = (await response.json()) as LeadListResponse;
  return body;
}

async function updateLeadStatus(id: string, leadStatus: string, notes?: string) {
  const response = await apiClient.post(`/api/admin/leads/${id}/status`, { leadStatus, notes }, { method: 'PATCH' });
  if (!response.ok) {
    let message = 'No se pudo actualizar el estado';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

async function updateLeadNotes(id: string, notes: string) {
  const response = await apiClient.post(`/api/admin/leads/${id}/notes`, { notes }, { method: 'PATCH' });
  if (!response.ok) {
    let message = 'No se pudo actualizar las notas';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

const leadStatusOptions = [
  { value: 'new', label: 'Nuevo' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'qualified', label: 'Calificado' },
  { value: 'converted', label: 'Convertido' },
  { value: 'lost', label: 'Perdido' }
];

const leadTypeOptions = [
  { value: 'contact', label: 'Contacto' },
  { value: 'pre_enrollment', label: 'Pre-inscripción' },
  { value: 'elite_booking', label: 'Elite booking' },
  { value: 'newsletter', label: 'Newsletter' }
];

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<{ search: string; status: string; leadType: string }>({
    search: '',
    status: '',
    leadType: ''
  });
  const [activeNote, setActiveNote] = useState<{ id: string; notes: string } | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () =>
      fetchLeads({
        ...(filters.search ? { source: filters.search } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.leadType ? { leadType: filters.leadType } : {})
      })
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => updateLeadNotes(id, notes),
    onSuccess: () => {
      setActiveNote(null);
      void refetch();
    }
  });

  const filteredLeads = useMemo(() => data?.data ?? [], [data]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Captación</p>
          <h3 className="text-2xl font-semibold text-white">Leads</h3>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white/5 p-4 text-sm text-muted space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            placeholder="Filtra por campaña/fuente"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          <select
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">Estado (todos)</option>
            {leadStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={filters.leadType}
            onChange={(e) => setFilters((f) => ({ ...f, leadType: e.target.value }))}
          >
            <option value="">Tipo (todos)</option>
            {leadTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p className="text-muted">Cargando leads...</p>}
        {error instanceof Error && (
          <p className="text-red-400">Error: {error.message || 'No se pudo cargar leads'}</p>
        )}
        {!isLoading && !error && filteredLeads.length === 0 && <p className="text-muted">No hay leads.</p>}

        {!isLoading && !error && filteredLeads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Teléfono</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Estado</th>
                  <th className="px-3 py-2">Origen</th>
                  <th className="px-3 py-2">Campaña</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/60 align-top">
                    <td className="px-3 py-2 font-medium">
                      {lead.firstName || lead.lastName
                        ? `${lead.firstName ?? ''} ${lead.lastName ?? ''}`.trim()
                        : '—'}
                    </td>
                    <td className="px-3 py-2 text-muted">{lead.email ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{lead.phone ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{lead.leadType ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">
                      <select
                        className="rounded-lg border border-border bg-black/20 px-2 py-1 text-xs text-white focus:border-primary focus:outline-none"
                        value={lead.leadStatus ?? ''}
                        onChange={(e) =>
                          updateStatusMutation.mutate({ id: lead.id, status: e.target.value || 'new' })
                        }
                      >
                        {leadStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-muted">{lead.source ?? '—'}</td>
                    <td className="px-3 py-2 text-muted">{lead.campaign ?? '—'}</td>
                    <td className="px-3 py-2 text-right space-y-2">
                      <button
                        type="button"
                        onClick={() => setActiveNote({ id: lead.id, notes: lead.notes ?? '' })}
                        className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      >
                        Notas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {activeNote && (
        <div className="rounded-xl border border-border bg-black/60 p-4 text-sm text-muted">
          <div className="flex items-center justify-between">
            <p className="text-white font-semibold">Notas del lead</p>
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            rows={4}
            value={activeNote.notes}
            onChange={(e) => setActiveNote({ ...activeNote, notes: e.target.value })}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() =>
                updateNotesMutation.mutate({ id: activeNote.id, notes: activeNote.notes || '' })
              }
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
              disabled={updateNotesMutation.isPending}
            >
              Guardar notas
            </button>
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancelar
            </button>
            {updateNotesMutation.isError && (
              <p className="text-red-400 text-sm">
                {updateNotesMutation.error instanceof Error
                  ? updateNotesMutation.error.message
                  : 'No se pudieron guardar las notas'}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
