# Puesta en marcha con Docker Compose

Esta guía explica cómo levantar el backend y PostgreSQL usando los archivos listos en el repo.

## Archivos clave
- `docker-compose.yml`: orquesta los servicios `api` (backend Node.js) y `db` (PostgreSQL). Monta los DDL de `scripts/sql/` y los datos de `context/data-init/data-init.sql` en la ruta de inicialización de PostgreSQL.
- `Dockerfile`: imagen del backend; instala dependencias, expone `PORT` y ejecuta `npm run start`.
- `.env.example`: referencia de variables. Cópiala a `.env` antes de levantar los contenedores.

## Pasos para levantar el entorno
1) **Crear el archivo `.env`**
   ```bash
   cp .env.example .env
   # Edita .env y cambia contraseñas/secrets por valores seguros
   ```

2) **Construir e iniciar los servicios**
   ```bash
   docker compose build
   docker compose up -d
   ```
   El servicio `db` inicializa esquemas y datos con los SQL montados; `api` espera a que `db` esté sano antes de arrancar.

3) **Verificar estado y logs**
   ```bash
   docker compose ps
   docker compose logs -f api
   ```

4) **Probar la API y la conexión a la base**
   - Salud general: http://localhost:${PORT:-3000}/health
   - Mensaje raíz: http://localhost:${PORT:-3000}/

5) **Detener y limpiar**
   ```bash
   docker compose down        # Detiene servicios
   docker compose down -v     # También borra el volumen de datos de PostgreSQL
   ```

## Variables de entorno principales
- `PORT`: puerto HTTP que expone el backend (mapeado al host en `docker-compose.yml`).
- `SESSION_SECRET`, `ADMIN_SECRET`: secretos de aplicación (sustituye por valores propios en `.env`).
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: credenciales usadas por la imagen oficial de PostgreSQL al inicializar.
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: parámetros individuales usados para construir `DATABASE_URL` si no se define explícitamente.
- `DATABASE_URL`: cadena de conexión consumida por el backend; por defecto apunta al servicio `db` en Docker.
