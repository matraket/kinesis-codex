# PRD T6 – Bootstrap del CMS y Autenticación

Monorepo **Kinesis Web + CMS**. T6 arranca la **FASE 3 Frontend (CMS)**: levantar el panel admin en `cms/` con Next.js + Tailwind + React Query, consumiendo las APIs T2–T5. Objetivo: base sólida de UI + autenticación para iterar en T7+.

---

## 1. RESTRICCIONES CLAVE
- Mantener estructura del monorepo (`api/`, `web/`, `cms/`, `shared/`, etc.). `context/**` solo lectura (excepto carpeta PRD creada).
- Stack CMS: Next.js 13+ (App Router), TypeScript estricto, Tailwind, React Query, Zustand/Context. Reutilizar `shared/ui` y tokens definidos en `context/kinesis-guia-de-implementacion.md`.
- Backend sigue autenticando con header `X-Admin-Secret`. Preparar capa que pueda migrar a JWT/OAuth sin reescribir UI.
- No romper scripts existentes (`pnpm dev`, `pnpm build`). Respetar diseño corporativo (paleta, tipografías, spacing).

---

## 2. ENTREGABLES PRINCIPALES
1. **Infraestructura Next.js** lista para prod:
   - App Router (`app/(auth)`, `app/(dashboard)`), Tailwind config, ESLint/Prettier alineados.
   - React Query + fetcher común (`cms/lib/api-client.ts`) que adjunta `X-Admin-Secret`.
2. **Autenticación puente**:
   - Pantalla `/login` que solicita alias/email + admin secret.
   - Validación llamando a endpoint admin existente (p.ej. `/api/admin/health`).
   - Guardar sesión en cookie segura (`httpOnly`, `SameSite=Strict`). Middleware y hooks (`useAdminSession`) para proteger rutas y manejar logout.
3. **Layout/base UX**:
   - Sidebar responsive, topbar con logo, toggle dark/light, user menu, breadcrumbs.
   - Theme provider + persistencia de preferencia. Componentes `StatCard`, `DataTable`, `StatusPill`, toasts globales.
4. **Primeros módulos conectados** (solo lectura):
   - Dashboard `/` con widgets reales: conteo de leads por estado, páginas publicadas, alertas settings.
   - Vista `/leads` con tabla + filtros básicos (tipo/estado/fecha).
   - Vista `/settings` listando claves y últimos cambios.
   - React Query + skeletons + error boundaries.
5. **Sistemas transversales**:
   - Estado global (Zustand/Context) para sesión, tema y feature flags.
   - Hooks para accesibilidad (skip links, focus traps).
   - Preparar i18n (es-ES default, scaffolding para en-US).
   - Observabilidad ligera (wrapper para analytics/logging sin datos sensibles).

---

## 3. ARQUITECTURA CMS PROPUESTA
```
cms/
  app/
    (auth)/login/page.tsx
    (dashboard)/layout.tsx
    (dashboard)/page.tsx
    leads/page.tsx
    settings/page.tsx
  components/
    layout/{SidebarNav,TopBar,Breadcrumbs}
    ui/{StatCard,TrendCard,DataTable,StatusPill}
    feedback/{ToastProvider,Skeletons}
  features/
    auth/{hooks.ts,services.ts}
    leads/{api.ts,components/}
    settings/{api.ts,components/}
  lib/{api-client.ts,server-fetcher.ts}
  store/{session.store.ts,theme.store.ts}
  styles/{globals.css}
  tests/*
```
- `middleware.ts` controla acceso. `getSessionFromCookies` disponible para SSR.
- `api-client` maneja headers, expiración, errores, logging. Compatible con SSR/ISR.

---

## 4. FLUJOS CRÍTICOS
1. **Login** → valida secret → guarda cookie → redirige a dashboard. Manejar errores (bloqueo tras N intentos).
2. **Dashboard** → dispara queries (`fetchLeadsSummary`, `fetchSettingsStatus`, `fetchLegalPagesStatus`). Mostrar skeletons/toasts.
3. **Leads List** → tabla paginada, filtros, drawer read-only para detalle.
4. **Settings List** → cards agrupadas por categoría (`site`, `social`, `legal`). Ediciones deshabilitadas (coming soon).
5. **Logout** → limpia cookie/storage, resetea React Query cache, redirige a login.

---

## 5. NO FUNCIONALES / QA
- Performance <1s tras sesión; usar suspense/skeletons.
- Accesibilidad AA (aria, focus management, teclado completo).
- Tests mínimos: componentes (`SidebarNav`, `LoginForm`), hooks (`useAdminSession`, `useApiClient`). Setup para React Testing Library + MSW. Opcional E2E login con Playwright.
- Error boundaries por módulo, toasts centralizados, logging sin secretos.
- Documentar en `docs/CHANGELOG.md` y `docs/cms/README.md` (setup, auth, tests).

---

## 6. CRITERIOS DE ACEPTACIÓN
- [ ] Next.js App Router + Tailwind + React Query configurados en `cms/`.
- [ ] Pantalla de login con validación real del `X-Admin-Secret`, persistencia segura y logout.
- [ ] Middleware/guards impiden acceso sin sesión.
- [ ] Layout completo (sidebar/topbar/breadcrumbs) responsive + tema claro/oscuro.
- [ ] Dashboard con widgets consumiendo `/api/admin` (leads, páginas, settings).
- [ ] Vistas `/leads` y `/settings` read-only con filtros básicos.
- [ ] Manejo global de errores/toasts y tema persistente.
- [ ] Base de tests (≥3 unit tests) y script `pnpm test:cms`.
- [ ] Documentación actualizada (Changelog + guía CMS).
