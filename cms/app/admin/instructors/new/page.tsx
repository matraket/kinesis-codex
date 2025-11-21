'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { TabSwitcher } from '@/components/ui/Tabs';
import { WebContentEditor } from '@/components/ui/WebContentEditor';

type InstructorPayload = {
  firstName: string;
  lastName: string;
  displayName?: string;
  email?: string;
  phone?: string;
  role?: string;
  tagline?: string;
  bioSummary?: string;
};

async function createInstructor(payload: InstructorPayload) {
  const response = await apiClient.post('/api/admin/instructors', payload);
  if (!response.ok) {
    let message = 'No se pudo crear el instructor';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function NewInstructorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'data' | 'web'>('data');
  const [formState, setFormState] = useState<InstructorPayload>({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
    role: '',
    tagline: '',
    bioSummary: ''
  });

  const mutation = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      router.push('/admin/instructors');
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({
      ...formState,
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      displayName: formState.displayName?.trim() || undefined,
      email: formState.email?.trim() || undefined,
      phone: formState.phone?.trim() || undefined,
      role: formState.role?.trim() || undefined,
      tagline: formState.tagline?.trim() || undefined,
      bioSummary: formState.bioSummary?.trim() || undefined
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Equipo</p>
          <h3 className="text-2xl font-semibold text-white">Nuevo instructor</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/instructors')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      <div className="space-y-3">
        <TabSwitcher
          tabs={[
            { id: 'data', label: 'Datos' },
            { id: 'web', label: 'Vista web', description: 'Perfil para la web' }
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
                <label className="text-xs text-muted">Nombre</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.firstName}
                  onChange={(e) => setFormState((s) => ({ ...s, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted">Apellido</label>
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
                <label className="text-xs text-muted">Nombre mostrado</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.displayName}
                  onChange={(e) => setFormState((s) => ({ ...s, displayName: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted">Rol</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.role}
                  onChange={(e) => setFormState((s) => ({ ...s, role: e.target.value }))}
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
              <label className="text-xs text-muted">Tagline</label>
              <input
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                value={formState.tagline}
                onChange={(e) => setFormState((s) => ({ ...s, tagline: e.target.value }))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted">Bio corta</label>
              <textarea
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                rows={3}
                value={formState.bioSummary}
                onChange={(e) => setFormState((s) => ({ ...s, bioSummary: e.target.value }))}
              />
            </div>

            {mutation.isError && (
              <p className="text-red-400 text-sm">
                {mutation.error instanceof Error ? mutation.error.message : 'No se pudo crear el instructor'}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
              >
                {mutation.isPending ? 'Guardando...' : 'Crear instructor'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/instructors')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {activeTab === 'web' && <WebContentEditor entityLabel="instructor" />}
      </div>
    </section>
  );
}
