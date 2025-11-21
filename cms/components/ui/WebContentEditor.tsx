import { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type WebContentValue = {
  title: string;
  subtitle?: string;
  heroUrl?: string;
  bodyHtml: string;
};

type WebContentEditorProps = {
  entityLabel: string;
  storageKey?: string;
  initialValue?: WebContentValue;
  onChange?: (value: WebContentValue) => void;
};

const defaultValue: WebContentValue = {
  title: '',
  subtitle: '',
  heroUrl: '',
  bodyHtml: ''
};

export function WebContentEditor({ entityLabel, initialValue, onChange }: WebContentEditorProps) {
  const [value, setValue] = useState<WebContentValue>(initialValue ?? defaultValue);
  const [draftStatus, setDraftStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const storageKey = initialValue
    ? undefined
    : `webcontent-${entityLabel}`;

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const updateValue = (next: Partial<WebContentValue>) => {
    setValue((prev) => {
      const merged = { ...prev, ...next };
      onChange?.(merged);
      return merged;
    });
  };

  const loadFromApi = async () => {
    if (!entityLabel) return;
    setIsLoading(true);
    setDraftStatus('');
    const key = storageKey ?? `webcontent-${entityLabel}`;
    try {
      const res = await fetch(`/api/web-content?key=${encodeURIComponent(key)}`);
      if (res.status === 404) {
        setDraftStatus('No hay contenido web guardado todavía');
      } else if (!res.ok) {
        setDraftStatus('Error cargando contenido web');
      } else {
        const payload = (await res.json()) as { data?: WebContentValue | null };
        if (payload?.data) {
          setValue(payload.data);
          onChange?.(payload.data);
          setDraftStatus('Contenido web cargado');
        }
      }
    } catch (error) {
      setDraftStatus('Error cargando contenido web');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistToApi = async () => {
    if (!entityLabel) return;
    setIsSaving(true);
    setDraftStatus('');
    const key = storageKey ?? `webcontent-${entityLabel}`;
    try {
      const res = await fetch('/api/web-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (!res.ok) {
        setDraftStatus('Error guardando contenido web');
      } else {
        setDraftStatus('Contenido web guardado');
      }
    } catch (error) {
      setDraftStatus('Error guardando contenido web');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white/5 p-6 text-sm text-muted">
      <h4 className="text-lg font-semibold text-white">Contenido web ({entityLabel})</h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs text-muted">Título público</label>
          <input
            className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={value.title}
            onChange={(e) => updateValue({ title: e.target.value })}
            placeholder="Ej. Formación anual contemporáneo"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted">Subtítulo / claim</label>
          <input
            className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={value.subtitle ?? ''}
            onChange={(e) => updateValue({ subtitle: e.target.value })}
            placeholder="Ej. Técnica, repertorio y creación"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs text-muted">URL imagen hero</label>
          <input
            className="w-full rounded-lg border border-border bg-black/20 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            value={value.heroUrl ?? ''}
            onChange={(e) => updateValue({ heroUrl: e.target.value })}
            placeholder="https://...jpg"
          />
          <p className="text-xs text-muted">Usa una imagen de ancho completo para la portada.</p>
        </div>
        {value.heroUrl ? (
          <div className="flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value.heroUrl}
              alt="Vista previa hero"
              className="max-h-36 w-full rounded-lg object-cover"
            />
          </div>
        ) : (
          <div className="flex min-h-[144px] items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
            Vista previa hero
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Editor
          apiKey="bi2vz1715etxqba9ow12bovm4aqrie9xdao5y0a5pvox459k"
          init={{
            height: 420,
            menubar: true,
            statusbar: false,
            skin: 'oxide-dark',
            content_css: 'dark',
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'help',
              'wordcount',
              'image'
            ],
            toolbar:
              'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | preview fullscreen',
            branding: false,
            automatic_uploads: false,
            convert_urls: false,
            placeholder: 'Escribe aquí el contenido público...',
          }}
          value={value.bodyHtml}
          onEditorChange={(content) => updateValue({ bodyHtml: content })}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={persistToApi}
            className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar contenido web'}
          </button>
          <button
            type="button"
            onClick={loadFromApi}
            className="rounded-md border border-border px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Cargar guardado'}
          </button>
          {draftStatus && <span className="text-xs text-muted">{draftStatus}</span>}
        </div>
        <p className="text-xs text-muted">
          Editor TinyMCE con formato completo (títulos, listas, links, imágenes por URL) y guardado en /api/web-content
          (filesystem local de la app).
        </p>
      </div>
    </div>
  );
}
