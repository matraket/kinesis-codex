import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../../lib/public-fetch';

type Course = {
  id: string;
  name: string;
  code?: string;
  status?: string;
};

async function getCourse(id: string): Promise<Course | null> {
  try {
    const data = await fetchJson<{ data?: Course }>(
      `/api/admin/courses/${id}`,
      undefined,
      { data: null as unknown as Course }
    );
    return data.data ?? null;
  } catch {
    return null;
  }
}

export default async function CourseDetail({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  const content = await fetchWebContent([
    `webcontent-curso-${params.id}`,
    'webcontent-curso'
  ]);

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white">Curso no encontrado</h1>
        <Link href="/web/cursos" className="text-primary underline">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/web/cursos" className="text-primary underline">
          ← Volver a cursos
        </Link>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
          Código: {course.code ?? '—'}
        </span>
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white/5 via-white/0 to-primary/10">
        {content?.heroUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.heroUrl}
              alt={content?.title || course.name}
              className="h-72 w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] via-[#0B1221]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-xs uppercase tracking-wide text-primary">Curso</p>
              <h1 className="text-3xl font-bold text-white">{content?.title || course.name}</h1>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-2">
            <p className="text-xs uppercase tracking-wide text-primary">Curso</p>
            <h1 className="text-3xl font-bold text-white">{content?.title || course.name}</h1>
            {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white/5 p-4">
          <p className="text-xs text-muted">Código</p>
          <p className="text-lg font-semibold text-white">{course.code ?? '—'}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white/5 p-4">
          <p className="text-xs text-muted">Estado</p>
          <p className="text-lg font-semibold text-white">{course.status ?? '—'}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white/5 p-4">
          <p className="text-xs text-muted">Contenido web</p>
          <p className="text-lg font-semibold text-white">
            {content?.bodyHtml ? 'Configurado' : 'Pendiente'}
          </p>
        </div>
      </div>

      <article
        className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted"
        dangerouslySetInnerHTML={{ __html: content?.bodyHtml ?? '<p>Sin contenido web</p>' }}
      />
    </div>
  );
}
