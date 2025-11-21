import Link from 'next/link';
import { fetchJson, fetchWebContent, WebContent } from '../lib/public-fetch';

type Course = {
  id: string;
  name: string;
  code?: string;
  status?: string;
};

async function getCourses(): Promise<Course[]> {
  const data = await fetchJson<{ data?: Course[] }>('/api/admin/courses', undefined, { data: [] });
  return data.data ?? [];
}

async function enrichCourse(course: Course): Promise<{ course: Course; content: WebContent | null }> {
  const content = await fetchWebContent([
    `webcontent-curso-${course.id}`,
    'webcontent-curso'
  ]);
  return { course, content };
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const enriched = await Promise.all(courses.map((c) => enrichCourse(c)));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-primary">Cursos</p>
        <h1 className="text-3xl font-bold text-white">Oferta de cursos</h1>
        <p className="text-muted">Listado de cursos publicados desde el CMS.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {enriched.map(({ course, content }) => (
          <Link
            key={course.id}
            href={`/web/cursos/${course.id}`}
            className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/5 via-white/0 to-primary/10 p-5 shadow-lg transition hover:-translate-y-1 hover:border-primary/80 hover:shadow-primary/30"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-white">{course.name}</h2>
                {course.status && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {course.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">Código: {course.code ?? '—'}</p>
              {content?.subtitle && <p className="text-sm text-white/80">{content.subtitle}</p>}
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Ver detalle <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
        {enriched.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-white/5 p-6 text-sm text-muted">
            No hay cursos publicados o falta el `NEXT_PUBLIC_ADMIN_SECRET` para listar.
          </div>
        )}
      </div>
    </div>
  );
}
