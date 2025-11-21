type WebConfigNoticeProps = {
  entityLabel: string;
  title?: string;
  intro?: string;
  bullets?: string[];
  note?: string;
};

export function WebConfigNotice({
  entityLabel,
  title = 'Configuración para la web',
  intro = 'Sección preparada para los campos públicos sin tocar el guardado actual.',
  bullets = [
    'Selector de imagen hero o galería principal.',
    'Título y subtítulo visibles en la web.',
    'Descripción extendida y puntos clave/CTA.',
    'Metadatos y ajustes específicos (SEO, etiquetas).'
  ],
  note = 'Estructura lista para conectar inputs y subida de medios más adelante.'
}: WebConfigNoticeProps) {
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-border bg-white/5 p-6 text-sm text-muted">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Vista web</span>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <p>
        {intro} Aquí definirás qué se muestra del <span className="font-semibold text-white">{entityLabel}</span> en el
        portal: textos, imágenes, CTAs y metadatos.
      </p>
      {bullets.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      <div className="rounded-lg border border-border bg-black/10 p-3 text-xs text-muted">
        {note}
      </div>
    </div>
  );
}
