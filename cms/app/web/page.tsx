import Link from 'next/link';

export default function WebHomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/20 via-purple-500/10 to-secondary/20 p-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-secondary/30 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-sm uppercase tracking-wide text-primary">Kinesis</p>
          <h1 className="text-4xl font-bold text-white">Portal público de la escuela</h1>
          <p className="max-w-2xl text-base text-white/80">
            Explora los programas, cursos, instructores y modelos de negocio publicados desde el CMS. Un escaparate
            consistente con los datos reales de la escuela.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/web/programas"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20"
            >
              Ver programas
            </Link>
            <Link
              href="/web/cursos"
              className="rounded-full bg-white/0 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/10"
            >
              Cursos disponibles
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/web/programas"
          className="group relative overflow-hidden rounded-2xl border border-border bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary hover:shadow-primary/30"
        >
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
          <h2 className="text-2xl font-semibold text-white">Programas</h2>
          <p className="mt-2 text-sm text-muted">Ficha pública de cada programa con hero e información extendida.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver más <span aria-hidden>→</span>
          </span>
        </Link>
        <Link
          href="/web/cursos"
          className="group relative overflow-hidden rounded-2xl border border-border bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary hover:shadow-primary/30"
        >
          <div className="absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-secondary/10 blur-2xl" />
          <h2 className="text-2xl font-semibold text-white">Cursos</h2>
          <p className="mt-2 text-sm text-muted">Oferta viva, con estados y contenido web configurado en el CMS.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver más <span aria-hidden>→</span>
          </span>
        </Link>
        <Link
          href="/web/instructores"
          className="group relative overflow-hidden rounded-2xl border border-border bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary hover:shadow-primary/30"
        >
          <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <h2 className="text-2xl font-semibold text-white">Instructores</h2>
          <p className="mt-2 text-sm text-muted">Perfiles públicos enriquecidos con biografía, imágenes y CTA.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver más <span aria-hidden>→</span>
          </span>
        </Link>
        <Link
          href="/web/modelos"
          className="group relative overflow-hidden rounded-2xl border border-border bg-white/5 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary hover:shadow-primary/30"
        >
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-secondary/10 blur-2xl" />
          <h2 className="text-2xl font-semibold text-white">Modelos de negocio</h2>
          <p className="mt-2 text-sm text-muted">Modalidades publicadas (regulares, bonos, bodas, etc.).</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver más <span aria-hidden>→</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
