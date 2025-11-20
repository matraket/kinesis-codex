# CMS (Next.js)

Base del panel admin de Kinesis (FASE 3). Incluye App Router, Tailwind, React Query, Zustand y toasts globales.

## Setup

1. `cd cms`
2. `pnpm install`
3. `pnpm dev` (usa `API_BASE_URL` o `NEXT_PUBLIC_API_BASE_URL` para apuntar a la API).

## Pasos rápidos para iniciar sesión

1. Arranca el backend que expone `/api/admin/**` y toma nota de su URL (p. ej. `http://localhost:3000`).
2. Exporta en tu terminal:
   - `export API_BASE_URL=http://localhost:3000` (o `NEXT_PUBLIC_API_BASE_URL` con la misma URL).
   - `export ADMIN_SECRET="<el mismo secret que usa el backend>"` (opcional `X_ADMIN_SECRET`).
3. Desde `cms/`, ejecuta `pnpm dev` y espera a que Next.js quede listo (usará 3000 o el puerto libre siguiente).
4. Abre `http://localhost:3000/login` (o el puerto que muestre la consola si 3000 está ocupado).
5. Ingresa solo el `X-Admin-Secret` en el formulario; si coincide con el backend o con `ADMIN_SECRET`, se creará la cookie `kinesis_admin_session` y entrarás al dashboard.
6. Si el login falla, verifica que el backend responda `200` en `/api/admin/health` y que el valor de `ADMIN_SECRET` coincida en backend y frontend.

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
