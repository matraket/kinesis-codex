# Plan de dockerización del backend

Este documento describe la arquitectura propuesta para dockerizar el backend y la base de datos PostgreSQL, reutilizando los esquemas existentes en `scripts/sql` y los datos iniciales en `context/data-init/data-init.sql`.

## 1. Arquitectura de contenedores

- **Red y comunicación**: todos los servicios comparten la red por defecto de Docker Compose; el backend accede a PostgreSQL por el nombre de servicio `db` y el puerto `5432`.
- **Servicios**:
  - `api`: contenedor Node.js que ejecuta el backend (API + estáticos de `web/` y `cms/`). Expone el puerto `${PORT:-3000}` hacia el host y depende de la salud de `db`.
  - `db`: contenedor PostgreSQL oficial (`postgres:16` o similar) con volumen persistente para datos y volumen de solo lectura para scripts de inicialización.
- **Inicialización de la base**: los archivos `scripts/sql/01_init_core_schema.sql`, `scripts/sql/02_public_api_schema.sql` y `context/data-init/data-init.sql` se montan en `/docker-entrypoint-initdb.d/` para que el entrypoint de PostgreSQL ejecute primero el DDL y luego los datos de arranque.
- **Persistencia**: volumen `postgres_data` para `/var/lib/postgresql/data` que permite conservar la información entre reinicios locales.
- **Salud**: `db` expone un `healthcheck` (`pg_isready`) que `api` usa en `depends_on` para esperar hasta que PostgreSQL esté listo.

## 2. Archivos y rol dentro del setup

- **`Dockerfile`**: imagen del backend. Multi-stage (instalación de dependencias y build) y comando final `npm run start` leyendo `process.env.PORT` y las variables de base de datos.
- **`docker-compose.yml`**: orquesta `api` y `db`, define red compartida, monta volúmenes, expone puertos y pasa las variables de entorno desde `.env`.
- **`.env.example`**: valores de ejemplo (no secretos reales) para todas las variables requeridas por `api` y `db` en Compose, incluyendo `DATABASE_URL` ya construida.
- **`scripts/docker/db-init/README.md` (opcional)**: breve guía sobre el flujo de inicialización y el orden esperado de los scripts SQL montados en el contenedor.
- **`scripts/docker/entrypoint.sh` (opcional para `api`)**: wrapper ligero para esperar a PostgreSQL (con `pg_isready`) antes de lanzar `npm run start`, evitando fallas por arranque prematuro.

## 3. Variables de entorno existentes (Replit)

- `SESSION_SECRET`: clave para firmar/encriptar sesiones o cookies del backend. **Necesaria** en producción; debe mantenerse secreta.
- `DATABASE_URL`: cadena de conexión completa a PostgreSQL. **Necesaria** para el backend y CLI; debe apuntar al servicio `db` en Docker.
- `PGDATABASE`: nombre de la base cuando se usa la familia `PG*` (CLI o drivers). **Opcional** si solo se usa `DATABASE_URL`; útil para herramientas como `psql`.
- `PGHOST`: host de PostgreSQL para `psql` o drivers. En Docker debería ser `db`. **Opcional** si `DATABASE_URL` está presente.
- `PGPORT`: puerto de PostgreSQL. Valor por defecto `5432`. **Opcional** con `DATABASE_URL`.
- `PGUSER`: usuario de PostgreSQL. **Opcional** con `DATABASE_URL`, pero conveniente para CLI.
- `PGPASSWORD`: contraseña del usuario. **Opcional** con `DATABASE_URL`, aunque práctica para herramientas locales.
- `ADMIN_SECRET`: secreto administrativo usado por la API (por ejemplo, header `X-Admin-Secret`). **Necesario** si el flujo de autenticación actual lo requiere; debe mantenerse como secreto.

## 4. Variables requeridas para PostgreSQL en Docker (valores de ejemplo)

- `POSTGRES_USER`: usuario superusuario creado por la imagen (`kinesis_app`).
- `POSTGRES_PASSWORD`: contraseña de `POSTGRES_USER` (`changeMeSuperSecret!`).
- `POSTGRES_DB`: base inicial que ejecutará los scripts (`kinesis_db`).
- `DB_HOST`: host que usará el backend (`db`).
- `DB_PORT`: puerto expuesto por PostgreSQL (`5432`).
- `DB_NAME`: base de datos de aplicación (`kinesis_db`).
- `DB_USER`: usuario de aplicación (`kinesis_app`).
- `DB_PASSWORD`: contraseña del usuario (`changeMeAppPass!`).
- `DATABASE_URL`: `postgresql://kinesis_app:changeMeAppPass!@db:5432/kinesis_db` (preferida por el backend).
- `SESSION_SECRET`: clave aleatoria segura para sesiones (p. ej. `base64:...`).
- `ADMIN_SECRET`: clave administrativa (p. ej. `kinesis-admin-temp`).

## 5. Propuesta de configuración (resumen)

```
Servicios:
  db:
    image: postgres:16
    environment: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/sql/01_init_core_schema.sql:/docker-entrypoint-initdb.d/01_init_core_schema.sql:ro
      - ./scripts/sql/02_public_api_schema.sql:/docker-entrypoint-initdb.d/02_public_api_schema.sql:ro
      - ./context/data-init/data-init.sql:/docker-entrypoint-initdb.d/10_data_init.sql:ro
    healthcheck: pg_isready -d $POSTGRES_DB -U $POSTGRES_USER

  api:
    build: .
    depends_on:
      db: condition: service_healthy
    environment:
      - PORT=3000
      - DATABASE_URL
      - SESSION_SECRET
      - ADMIN_SECRET
    ports:
      - 3000:3000
    command: ["/bin/sh", "-c", "npm run start"]

volumes:
  postgres_data:
```

## 6. Variables finales listas para `.env`

| Variable | Propósito | Ejemplo seguro |
| --- | --- | --- |
| PORT | Puerto HTTP del backend | `3000` |
| SESSION_SECRET | Firma de sesiones/cookies | `base64:kinesis-session-secret` |
| ADMIN_SECRET | Secreto administrativo de API | `kinesis-admin-temp` |
| POSTGRES_USER | Usuario principal creado por la imagen | `kinesis_app` |
| POSTGRES_PASSWORD | Contraseña del usuario principal | `changeMeSuperSecret!` |
| POSTGRES_DB | Base inicial creada en el arranque | `kinesis_db` |
| DB_HOST | Host interno de PostgreSQL | `db` |
| DB_PORT | Puerto interno de PostgreSQL | `5432` |
| DB_NAME | Base usada por la app | `kinesis_db` |
| DB_USER | Usuario de aplicación | `kinesis_app` |
| DB_PASSWORD | Contraseña del usuario de aplicación | `changeMeAppPass!` |
| DATABASE_URL | Cadena completa para el backend/CLI | `postgresql://kinesis_app:changeMeAppPass!@db:5432/kinesis_db` |
