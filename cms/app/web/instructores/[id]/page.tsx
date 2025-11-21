import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../../lib/public-fetch';

type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role?: string;
};

async function getInstructor(id: string): Promise<Instructor | null> {
  try {
    const data = await fetchJson<{ data?: Instructor }>(
      `/api/admin/instructors/${id}`,
      undefined,
      { data: null as unknown as Instructor }
    );
    return data.data ?? null;
  } catch {
    return null;
  }
}

export default async function InstructorDetail({ params }: { params: { id: string } }) {
  const instructor = await getInstructor(params.id);
  const content = await fetchWebContent([
    `webcontent-instructor-${params.id}`,
    'webcontent-instructor'
  ]);

  if (!instructor) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Instructor no encontrado</h1>
        <Link href="/web/instructores" className="text-primary underline">
          Volver
        </Link>
      </div>
    );
  }

  const displayName = instructor.displayName || `${instructor.firstName} ${instructor.lastName}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/web/instructores" className="text-primary underline">
          ← Volver a instructores
        </Link>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">{instructor.role ?? '—'}</span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white/5 via-white/0 to-primary/10">
        {content?.heroUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.heroUrl} alt={displayName} className="h-72 w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs uppercase tracking-wide text-primary">Instructor</p>
              <h1 className="text-3xl font-bold text-white">{content?.title || displayName}</h1>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-2">
            <p className="text-xs uppercase tracking-wide text-primary">Instructor</p>
            <h1 className="text-3xl font-bold text-white">{content?.title || displayName}</h1>
            {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
          </div>
        )}
      </section>

      <article
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted"
        dangerouslySetInnerHTML={{ __html: content?.bodyHtml ?? '<p>Sin contenido web</p>' }}
      />
    </div>
  );
}
