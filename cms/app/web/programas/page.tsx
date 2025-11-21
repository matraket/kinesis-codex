import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../lib/public-fetch';

type Program = {
  id: string;
  name: string;
  code?: string;
  isActive?: boolean;
};

async function getPrograms(): Promise<Program[]> {
  const data = await fetchJson<{ data?: Program[] }>('/api/admin/programs', undefined, { data: [] });
  return data.data ?? [];
}

async function enrichProgram(program: Program): Promise<{ program: Program; content: WebContent | null }> {
  const content = await fetchWebContent([
    `webcontent-programa-${program.id}`,
    'webcontent-programa'
  ]);
  return { program, content };
}

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const enriched = await Promise.all(programs.map((p) => enrichProgram(p)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Oferta</p>
        <h1 className="text-3xl font-bold text-white">Programas</h1>
        <p className="text-muted">Listado de programas publicados desde el CMS.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {enriched.map(({ program, content }) => (
          <Link
            key={program.id}
            href={`/web/programas/${program.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white/5 via-white/0 to-primary/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-primary/80 hover:shadow-primary/30"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-white">{program.name}</h2>
                {program.isActive && (
                  <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-300">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">Código: {program.code ?? '—'}</p>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ver detalle <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
        {enriched.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white/5 p-6 text-sm text-muted">
            No hay programas publicados o falta el `NEXT_PUBLIC_ADMIN_SECRET` para listar.
          </div>
        )}
      </div>
    </div>
  );
}
