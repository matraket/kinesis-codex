## PRD T6 – Bootstrap del CMS y Autenticación

Estás trabajando en el monorepo **Kinesis Web + CMS**, un monolito modular en TypeScript que corre en Replit y que ya cuenta con las APIs públicas y admin (T2–T5). Ahora toca **FASE 3**: crear la base visual y lógica del **CMS** que vivirá en `/cms`, construido sobre **Next.js + Tailwind CSS + React Query + Zustand (o Context)** y consumiendo la API de la fase anterior.

T6 se centra en **bootstrap + autenticación** para que el panel sea utilizable, seguro y coherente con el diseño documentado en `context/kinesis-guia-de-implementacion.md`.

---

## 0. Restricciones y supuestos críticos

### 0.1. Monorepo y carpetas

* `cms/` es el workspace de Next.js. No muevas ni renombres `web/`, `api/`, `core/`, `shared/`, `docs/`, `scripts/`.
* `context/**` es documentación funcional. **Solo** se crea `context/prds/t6` bajo instrucción explícita (ya realizada). No modificar otros archivos del contexto sin pedido.
* Mantén la misma toolchain: `pnpm`, `turbo` (si aplica), `tsconfig.base.json`. Reutiliza scripts existentes (`pnpm dev`, `pnpm build`).

### 0.2. Dependencias compartidas

* Usa los componentes de `shared/ui` cuando sea viable; si hace falta crear nuevos atoms/molecules utilízalos allí para que Web y CMS puedan compartirlos.
* Tailwind config y design tokens deben respetar lo descrito en `context/kinesis-guia-de-implementacion.md` (tipografías, escalas de color, espaciados, sombras).
* Tipos compartidos para DTOs admin se deben declarar en `shared/types` o reutilizar los generados en `api` mediante `ts-paths` o `openapi` (si existe). Evita duplicar definiciones.

### 0.3. APIs disponibles

* Endpoints admin (`/api/admin/**`) ya existen para specialties, instructors, programs, pricing_tiers, business_models, page_content, faqs, legal_pages, settings, leads.
* Autenticación actual del backend: **header `X-Admin-Secret`**. No hay usuarios/roles reales todavía, pero debemos preparar el CMS para evolucionar a un sistema completo (token-based o session-based) sin reescribir todo.

### 0.4. UX/UI reference

* Toda la experiencia visual debe alinear con las guidelines del documento `kinesis-guia-de-implementacion.md`: layout en tarjetas, tipografía base, uso de imágenes, spacing 8px, look & feel corporativo.
* Evitar “bootstrap genérico”. Este PRD exige un CMS profesional, minimalista, oscuro-claro con acentos ámbar.

---

## 1. Objetivo

Crear los cimientos del **panel de administración** con:

1. **Infraestructura Next.js lista para producción** (app router recomendado) con SSR habilitado según necesidad, internacionalización preparada y build reproducible.
2. **Sistema de autenticación/guardado de sesión** compatible con el backend actual (X-Admin-Secret) pero extensible a futuros providers OAuth/JWT.
3. **Shell de la aplicación CMS**: rutas, layout general, navigation, estados de carga/errores, toasts, Theme provider, componentes base (sidebar, topbar, breadcrumbs, user menu).
4. **Primeros módulos conectados** al backend para validar el flujo (dashboard con resúmenes y vistas read-only básicas de leads/settings) reutilizando React Query.

T6 no entrega todos los CRUDs, pero sí deja una base sólida para poder construir T7/T8 sin re-trabajo.

---

## 2. Alcance

### 2.1. In Scope

* Configuración de Next.js 13+ con `app/` directory, TypeScript estricto, Tailwind, ESLint y Prettier alineados con el repo.
* Integración de React Query + fetcher común (`cms/lib/api-client.ts`) que agregue `X-Admin-Secret` desde un storage seguro en el cliente y soporte SSR.
* Sistema de autenticación mínimo:
  * Pantalla de login protegida (`/login`).
  * Almacenar el secret/token usando `httpOnly cookies` o, en su defecto, `Secure Storage` dentro de `localStorage` cifrado (p. ej. libs como `secure-ls`).
  * Guardas (middleware Next.js y hooks) para redirigir a login si no hay sesión.
  * Logout que borra credenciales.
* Layout base del CMS:
  * Sidebar responsivo con navegación principal (Dashboard, Leads, Contenido, Configuración, Sistema).
  * Header/topbar con title dinámico, Kinesis logo, tema claro/oscuro toggle, user menu.
  * Breadcrumbs o page header por vista.
  * Área principal con tarjetas, tablas, formularios.
* Dashboard inicial:
  * Widgets read-only: conteo de leads por estado (usando `/api/admin/leads?status=...`), resumen de páginas publicadas, alertas de settings incompletas.
  * Gráfica simple (puede usarse `react-chartjs` o librería liviana) para leads semanales.
* Vistas read-only iniciales (listas con filtros minimalistas):
  * `Leads`: tabla con columnas clave y filtros por estado/tipo.
  * `Settings`: listado de claves y últimos cambios.
  * Estas vistas solo necesitan lectura en T6, edición llegará en T7.
* Sistemas transversales:
  * Theming/Tokens (Tailwind config + CSS vars) para dark/light.
  * Estado global (Zustand o Context) para datos de sesión y layout.
  * Manejo centralizado de errores y toasts (ej. `@/components/ui/toast`).
  * Hooks de accesibilidad (focus traps en modales, skip links, etc.).

### 2.2. Out of Scope

* CRUDs completos de todos los recursos (se implementarán en T7+).
* Editor WYSIWYG, gestión de assets, analytics avanzados.
* Autenticación compleja con usuarios reales (solo base para migrar a ello).
* Tests E2E con Playwright (opcional para T6, aunque se puede crear scaffolding).

---

## 3. Arquitectura Frontend del CMS

### 3.1. Stack técnico

* **Next.js 13/14** con App Router, `app/layout.tsx`, `app/(auth)`, `app/(dashboard)`.
* **Tailwind CSS** + `@tailwindcss/typography` + plugin para forms.
* **React Query** para data fetching + caching.
* **Zustand** (recomendado) para estado de sesión/tema o `Context + Reducer` si se prefiere.
* **Headless UI** o componentes propios para menús/modales si `shared/ui` aún no cubre todo.
* Iconografía `lucide-react` para consistencia.

### 3.2. Organización de carpetas (cms/)

```
cms/
  app/
    (auth)/login/page.tsx
    (dashboard)/layout.tsx
    (dashboard)/page.tsx            # Dashboard principal
    leads/page.tsx
    settings/page.tsx
  components/
    layout/
    navigation/
    charts/
  features/
    auth/
      hooks.ts
      services.ts
    leads/
      api.ts
      components/
    settings/
      api.ts
  lib/
    api-client.ts
    server-fetcher.ts
  store/
    session.store.ts
  styles/
    globals.css
  tests/
```

* `features/` agrupa lógica por módulo (auth, leads, settings).
* `lib/api-client.ts` expone `apiClient(request, options)` que adjunta headers y maneja errores.
* `app/(auth)` no hereda el layout del dashboard.
* `middleware.ts` controla acceso; si la ruta es `/login` y ya hay sesión → redirigir al dashboard.

### 3.3. Integración con API

* Uso de fetch nativo con `next/server` helpers en SSR. En cliente, React Query con `fetcher` que lee token desde cookie.
* Mecanismo de revalidación incremental: revalidar queries criticás (leads summary) cada 30–60s.
* Abstracciones en `features/*/api.ts` que encapsulan endpoints (ej. `fetchLeadsSummary`, `fetchSettingsList`).

### 3.4. Theming y diseño

* Tailwind config extendido con paleta Kinesis (negros cálidos, blanco marfil, acento ámbar #F9B233 aprox.).
* CSS vars en `:root` + `.dark` para colores y tipografías; toggle guardado en `localStorage`.
* Layout responsive: sidebar colapsable en ≥1024px, drawer en mobile.
* Componentes clave:
  * `SidebarNav` con íconos y badges (número de leads nuevos).
  * `TopBar` con botón de logout, switch tema, breadcrumb.
  * `StatCard`, `TrendCard`, `DataTable` (puede basarse en shadcn/ui).
  * `StatusPill` con colores por `lead_status`.

---

## 4. Autenticación y seguridad

### 4.1. Modelo actual (fase puente)

* Backend espera `X-Admin-Secret`. En T6 se pedirá al usuario ingresar el secret en `/login` (junto con un alias o email). No almacenar el secret en texto plano.
* Estrategia recomendada:
  * Enviar `POST /api/internal/auth/proxy` (nuevo endpoint interno en `api` si se decide) que valide el secret y devuelva un JWT temporal.
  * **O**, si no se crea endpoint adicional, `cms` guardará el secret cifrado en cookie `admin_session` con `AES` simple (biblioteca `crypto-js`).
  * Guardar también metadata (timestamp, alias) para mostrar en UI.

### 4.2. Middleware y guards

* `middleware.ts` validará `admin_session`. Si no existe o expiró, redirige a `/login`.
* Hook `useAdminSession` expone `isAuthenticated`, `user`, `logout`.
* Para SSR (layouts y loaders) implementar `getSessionFromCookies(headers)`.

### 4.3. Storage y seguridad

* Cookies `httpOnly` preferibles (usando API Routes/Route Handlers para setearlas).
* Añadir flag `maxAge` (ej. 8h) y `SameSite=Strict`.
* Nunca loguear secret/token en consola ni analytics.
* Preparar interfaz para soportar OAuth/JWT en el futuro (p. ej. `AuthStrategy` interface con implementación `AdminSecretStrategy`).

### 4.4. Roles futuros

* Definir tipos `AdminRole = 'superadmin' | 'editor' | 'viewer'` aunque de momento todos sean `superadmin`.
* Layout y navegación deben soportar `feature flags` (ocultar módulos según rol).

---

## 5. Flujos de usuario

1. **Login**
   * Usuario llega a `/login` → formulario pide `email/alias` + `admin secret`.
   * Validaciones básicas (email válido, secret requerido).
   * Al enviar, se llama a `POST /api/admin/health` (o endpoint proxy) con header `X-Admin-Secret`.
   * Si respuesta OK → guardar sesión, redirigir a `/` (dashboard).
   * Si error → mostrar mensaje amigable y bloquear tras N intentos (rate limit local, ej. 5 intentos / 15 min).

2. **Dashboard inicial**
   * Tras login se monta layout `app/(dashboard)/layout.tsx` con sidebar.
   * React Query dispara `fetchLeadsSummary`, `fetchSettingsStatus`, `fetchLegalPagesStatus`.
   * Widgets muestran contadores, alerts (p. ej. “Falta completar Aviso Legal”).

3. **Leads list**
   * Vista `/leads` usa tabla con paginación y filtros (estado, tipo, rango de fechas).
   * Solo lectura: no hay edición. Cada fila puede abrir `Drawer` con detalles.

4. **Settings list**
   * Vista `/settings` muestra cards por categoría (`site`, `social`, `legal`).
   * Botón “Editar” puede estar deshabilitado (coming soon) pero mostrar wireframe.

5. **Logout**
   * Desde avatar menu o button en sidebar inferior.
   * Borra cookie/storage, invalidando React Query cache.

---

## 6. Requisitos no funcionales

* **Performance**: Layout debe cargar en <1s tras tener sesión (usar `Skeletons`).
* **Accesibilidad**: Soportar teclado completo, aria-labels en navegación, contraste AA.
* **Internacionalización**: Preparar `next-intl` o `@lingui` (al menos scaffolding). Idioma por defecto `es-ES` con posibilidad de `en-US`.
* **Observabilidad**: Integrar `@vercel/analytics` o wrapper que permita métricas básicas. Logs sensibles deshabilitados.
* **Error Boundaries**: Layout debe mostrar fallback cuando un módulo falla (p. ej. fetch leads).
* **Feature Flags**: Base simple (hook `useFeatureFlag`) leyendo de `settings` o env para habilitar futuras secciones.

---

## 7. Testing y QA

### 7.1. Tests unitarios/componentes

* Componentes core (`SidebarNav`, `TopBar`, `LoginForm`) con pruebas usando `@testing-library/react`.
* Hooks `useAdminSession`, `useApiClient` con tests para flujos feliz/error.
* Utilidades `api-client` (headers, parseErrors) con pruebas unitarias.

### 7.2. Tests de integración/UI

* `Login` happy path + error (puede ser test e2e ligero con Playwright o Cypress Headless, opcional pero recomendado).
* Snapshot o visual regression para layout base (Storybook + Chromatic si existe pipeline).
* React Query: usar `msw` para simular backend y probar `Dashboard` data fetching.

### 7.3. QA manual mínimo

* Verificar:
  * Redirecciones login → dashboard → logout.
  * Sidebar responsivo (desktop/mobile).
  * Dark mode toggle persistente.
  * Errores amigables cuando API responde 401/500.

---

## 8. Entregables y criterios de aceptación

T6 se considera completo cuando:

- [ ] Existe estructura Next.js en `cms/` con App Router, Tailwind y React Query configurados.
- [ ] Hay pantalla de login funcional que valida el `admin secret` contra la API y persiste sesión segura.
- [ ] Middleware/guards impiden acceder al dashboard sin sesión y redirigen adecuadamente.
- [ ] Layout principal (sidebar, topbar, breadcrumbs, tema claro/oscuro) está implementado y es responsive.
- [ ] Dashboard muestra widgets reales conectados a `api/admin/leads`, `api/admin/page-content`, `api/admin/settings`.
- [ ] Vista `/leads` y `/settings` permiten listar datos reales (read-only) con filtros básicos.
- [ ] Error handling global y toasts están operativos.
- [ ] Base de tests configurada (al menos 3 pruebas unitarias para componentes/hooks críticos) y scripts `pnpm test:cms` o similar.
- [ ] Documentación actualizada: `docs/CHANGELOG.md` (entrada T6) y, si aplica, `docs/cms/README.md` describiendo setup y auth.

Con T6 finalizado, el CMS queda listo para iterar sobre flujos CRUD avanzados (T7+) sin rehacer cimientos.
