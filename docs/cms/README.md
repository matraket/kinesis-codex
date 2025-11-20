# CMS (Next.js)

Base del panel admin de Kinesis (FASE 3). Incluye App Router, Tailwind, React Query, Zustand y toasts globales.

## Setup

1. `cd cms`
2. `pnpm install`
3. `pnpm dev` (usa `API_BASE_URL` o `NEXT_PUBLIC_API_BASE_URL` para apuntar a la API).

## Autenticación puente

- Formulario en `/login` pide solo el `X-Admin-Secret`.
- Valida contra `/api/admin/health` vía ruta interna `app/api/admin/login`.
- Si defines `ADMIN_SECRET` (o `X_ADMIN_SECRET`) en tu entorno, el login lo usará como fallback local.
- Cookie `kinesis_admin_session` httpOnly, `SameSite=Strict`, `secure` en prod.
- Middleware protege todas las rutas salvo `/login` y APIs públicas.

## Rutas clave

- `/` Dashboard con widgets de leads/páginas/settings.
- `/leads` tabla con filtros básicos y skeletons.
- `/settings` vista agrupada por categoría.
- `app/api/admin/proxy/[...path]` proxifica al backend adjuntando `X-Admin-Secret`.

## Testing

- `pnpm test` dentro de `cms/` ejecuta Vitest + Testing Library.
- Cobertura inicial: `SidebarNav`, `LoginForm`, `useAdminSession`.
