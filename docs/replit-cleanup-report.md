# Replit auto-added artifacts vs PRDs

## PNPM vs npm
- El PRD de la tarea T0 exige configurar **pnpm** y generar `pnpm-lock.yaml` para el tooling base.
- Se eliminó `package-lock.json`, se añadió `replit.nix` con pnpm y `.replit` ahora ejecuta `pnpm run dev`.
- **Pendiente por limitación del entorno:** la generación de `pnpm-lock.yaml` falla por errores 403 al acceder a `registry.npmjs.org` (ver logs); queda por reintentar cuando el registro sea accesible.

## Dependencias marcadas como runtime
- El PRD indica que TypeScript y los tipos deben ir como **devDependencies**.
- `package.json` ahora coloca `typescript`, `@types/node`, `@types/pg`, `vitest` y `tsx` en `devDependencies`, dejando solo `fastify`, `pg` y `zod` en `dependencies`.
