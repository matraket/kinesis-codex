# Autenticación CMS – notas rápidas

- **Estado actual (mock)**: el login de `/admin/login` guarda `{ email, secret }` en `localStorage` y el guard (`features/auth/auth-context.tsx`) solo revisa ese flag. No hay llamadas reales a la API aún.
- **Dónde enchufar la API real**: usa `lib/api/auth.ts`. Sustituye las funciones `login` y `validateSession` para llamar al backend con `X-Admin-Secret` en el header (ejemplo: `GET /api/admin/health` o `GET /api/admin/dashboard`). URL base desde `NEXT_PUBLIC_API_BASE_URL`.
- **Storage futuro**: mover el secret a cookie httpOnly (`admin_session`), con `SameSite=Strict`, `secure` en prod y expiración (~8h). El handler podría ser `/api/auth/login` (Next Route Handler) que setea/borra cookie y hace proxy al backend.
- **Logout real**: cuando exista endpoint, hacer `POST /api/admin/logout` o borrar la cookie en el handler. Ahora solo limpia el flag local.
- **Pendientes de endurecer**: cifrar el secret si se mantiene en el cliente, rate limit local (5 intentos/15m), y añadir `middleware.ts` para redirigir si no hay cookie válida.
