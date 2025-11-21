'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { TabSwitcher } from '@/components/ui/Tabs';
import { WebContentEditor } from '@/components/ui/WebContentEditor';

type BusinessModelPayload = {
  internalCode: string;
  name: string;
  subtitle?: string;
  description: string;
  format?: string;
  displayOrder?: number;
  slug: string;
};

async function createBusinessModel(payload: BusinessModelPayload) {
  const response = await apiClient.post('/api/admin/business-models', payload);
  if (!response.ok) {
    let message = 'No se pudo crear el modelo de negocio';
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export default function NewBusinessModelPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'data' | 'web'>('data');
  const [formState, setFormState] = useState<BusinessModelPayload>({
    internalCode: '',
    name: '',
    subtitle: '',
    description: '',
    format: '',
    displayOrder: 0,
    slug: ''
  });

  const mutation = useMutation({
    mutationFn: createBusinessModel,
    onSuccess: () => {
      router.push('/admin/business-models');
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await mutation.mutateAsync({
      internalCode: formState.internalCode.trim(),
      name: formState.name.trim(),
      subtitle: formState.subtitle?.trim() || undefined,
      description: formState.description.trim(),
      format: formState.format?.trim() || undefined,
      displayOrder: formState.displayOrder,
      slug: formState.slug.trim()
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Oferta</p>
          <h3 className="text-2xl font-semibold text-white">Nuevo modelo de negocio</h3>
        </div>
        <button
          type="button"
          onClick={() => router.push('/admin/business-models')}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Volver al listado
        </button>
      </div>

      <div className="space-y-3">
        <TabSwitcher
          tabs={[
            { id: 'data', label: 'Datos' },
            { id: 'web', label: 'Vista web', description: 'Ficha pública' }
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
                <label className="text-xs text-muted">Código interno</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.internalCode}
                  onChange={(e) => setFormState((s) => ({ ...s, internalCode: e.target.value }))}
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
                <label className="text-xs text-muted">Subtítulo</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.subtitle}
                  onChange={(e) => setFormState((s) => ({ ...s, subtitle: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted">Formato</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.format}
                  onChange={(e) => setFormState((s) => ({ ...s, format: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted">Descripción</label>
              <textarea
                className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                rows={4}
                value={formState.description}
                onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted">Slug</label>
                <input
                  className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                  value={formState.slug}
                  onChange={(e) => setFormState((s) => ({ ...s, slug: e.target.value }))}
                  required
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

            {mutation.isError && (
              <p className="text-red-400 text-sm">
                {mutation.error instanceof Error ? mutation.error.message : 'No se pudo crear el modelo'}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-70"
              >
                {mutation.isPending ? 'Guardando...' : 'Crear modelo'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/business-models')}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {activeTab === 'web' && <WebContentEditor entityLabel="modelo de negocio" />}
      </div>
    </section>
  );
}
