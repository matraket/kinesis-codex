import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../lib/public-fetch';

type BusinessModel = {
  id: string;
  name: string;
  internalCode?: string;
  slug?: string;
};

async function getBusinessModels(): Promise<BusinessModel[]> {
  const data = await fetchJson<{ data?: BusinessModel[] }>(
    '/api/admin/business-models',
    undefined,
    { data: [] }
  );
  return data.data ?? [];
}

async function enrichModel(model: BusinessModel): Promise<{ model: BusinessModel; content: WebContent | null }> {
  const content = await fetchWebContent([
    `webcontent-modeloNegocio-${model.id}`,
    'webcontent-modeloNegocio'
  ]);
  return { model, content };
}

export default async function BusinessModelsPage() {
  const models = await getBusinessModels();
  const enriched = await Promise.all(models.map((m) => enrichModel(m)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Modalidades</p>
        <h1 className="text-3xl font-bold text-white">Modelos de negocio</h1>
        <p className="text-muted">Modalidades publicadas desde el CMS.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {enriched.map(({ model, content }) => (
          <Link
            key={model.id}
            href={`/web/modelos/${model.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white/5 via-white/0 to-primary/10 p-5 shadow-lg transition hover:-translate-y-1 hover:border-primary/80 hover:shadow-primary/30"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative space-y-2">
              <h2 className="text-xl font-semibold text-white">{model.name}</h2>
              <p className="text-xs text-muted">Código: {model.internalCode ?? '—'}</p>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ver detalle <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
        {enriched.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white/5 p-6 text-sm text-muted">
            No hay modelos publicados o falta el `NEXT_PUBLIC_ADMIN_SECRET` para listar.
          </div>
        )}
      </div>
    </div>
  );
}
