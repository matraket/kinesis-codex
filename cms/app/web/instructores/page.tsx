import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../lib/public-fetch';

type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role?: string;
};

async function getInstructors(): Promise<Instructor[]> {
  const data = await fetchJson<{ data?: Instructor[] }>(
    '/api/admin/instructors',
    undefined,
    { data: [] }
  );
  return data.data ?? [];
}

async function enrichInstructor(instructor: Instructor): Promise<{ instructor: Instructor; content: WebContent | null }> {
  const content = await fetchWebContent([
    `webcontent-instructor-${instructor.id}`,
    'webcontent-instructor'
  ]);
  return { instructor, content };
}

export default async function InstructorsPage() {
  const instructors = await getInstructors();
  const enriched = await Promise.all(instructors.map((i) => enrichInstructor(i)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Equipo</p>
        <h1 className="text-3xl font-bold text-white">Instructores</h1>
        <p className="text-muted">Perfiles publicados desde el CMS.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {enriched.map(({ instructor, content }) => (
          <Link
            key={instructor.id}
            href={`/web/instructores/${instructor.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white/5 via-white/0 to-primary/10 p-5 shadow-lg transition hover:-translate-y-1 hover:border-primary/80 hover:shadow-primary/30"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative space-y-2">
              <h2 className="text-xl font-semibold text-white">
                {instructor.displayName || `${instructor.firstName} ${instructor.lastName}`}
              </h2>
              <p className="text-xs text-muted">{instructor.role ?? 'Instructor'}</p>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ver perfil <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
        {enriched.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white/5 p-6 text-sm text-muted">
            No hay instructores publicados o falta el `NEXT_PUBLIC_ADMIN_SECRET` para listar.
          </div>
        )}
      </div>
    </div>
  );
}
