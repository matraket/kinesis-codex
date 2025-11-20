# CMS

Panel de administración de Kinesis construido con Next.js (App Router), Tailwind CSS y React Query. Incluye flujo de autenticación basado en header `X-Admin-Secret` (cookie httpOnly), layout responsivo (sidebar + topbar + breadcrumbs), dashboards iniciales y vistas read-only de leads y settings.

## Scripts

- `pnpm dev` (dentro de `cms/`): inicia Next.js en modo desarrollo.
- `pnpm build`: genera el bundle de producción.
- `pnpm start`: sirve el build generado.
- `pnpm lint`: ejecuta ESLint con reglas alineadas a Next.
- `pnpm test`: ejecuta la suite de Vitest + Testing Library.

## Configuración de entorno

- Define `API_BASE_URL` o `NEXT_PUBLIC_API_BASE_URL` apuntando al backend que expone `/api/admin/**`.
- Exporta `ADMIN_SECRET` (o `X_ADMIN_SECRET`) en tu shell para validar el login de manera local; si coincide con el secret del backend, el flujo se autenticará.

## Estructura destacada

- `app/(auth)/login`: pantalla de login y rutas públicas.
- `app/(dashboard)`: layout protegido + dashboard principal.
- `app/leads`, `app/settings`: vistas modulares conectadas vía React Query.
- `app/api/admin/*`: rutas internas que validan sesión y proxifican al backend (`X-Admin-Secret`).
- `features/*`: APIs y hooks por dominio (auth, leads, settings).
- `components/layout|ui|feedback`: piezas reutilizables (sidebar, toasts, skeletons, tablas).
- `store/*`: Zustand stores para sesión y tema.
