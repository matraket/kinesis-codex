# PASOS_INIT

## 1. Instalar dependencias
1. Abre una terminal.
2. Ve a la raíz del repo: `cd c:\xampp\htdocs\git-projects\Hackathon-ViveCoding\Codex`.
3. Instala dependencias comunes: `pnpm install`.
4. Entra al CMS: `cd cms`.
5. Instala dependencias del CMS: `pnpm install`.

## 2. Variables de entorno del CMS
1. Dentro de `cms/` crea (o edita) `.env.local`.
2. Añade la URL del backend que expone `/api/admin/**` sin arrastrar barra final:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
   ```
   Cambia el puerto si decides levantar la API en otro (el ejemplo usa `5001` para no chocar con el dev server de Next en `3000`).
3. El CMS usa esta variable para construir todas las llamadas reales y enviar el header `X-Admin-Secret`.

## 3. Levantar el backend/API
1. En otra terminal vuelve a la raíz del repo.
2. Asegúrate de que la variable `ADMIN_SECRET` de `.env` tenga el valor que quieres (por defecto `Kinesis2025*#`).
3. Levanta la API en el puerto `5001` para no pelear con Next:
   - Con Docker: edita `.env` y pon `PORT=5001` o exporta la variable en la terminal (`$env:PORT=5001` en PowerShell) antes de correr `docker compose up api`.
   - Sin Docker: `set PORT=5001` (Windows) o `PORT=5001` (Unix) y luego `pnpm dev`.
4. Comprueba que Fastify imprime `Server listening on 0.0.0.0:5001` y que los logs no muestran errores de base de datos.

## 4. Arrancar el CMS
1. En la carpeta `cms`, ejecuta `pnpm dev` (usa el puerto 3000 por defecto).
2. Abre `http://localhost:3000` en el navegador.
3. El root te redirigirá solo al login (`/admin/login`) cuando no haya sesión.

## Cómo probar el login de administrador
1. Variables necesarias:
   - En el backend `.env`: `ADMIN_SECRET=Kinesis2025*#` (o el valor que quieras usar).
   - En el CMS `cms/.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` y, si quieres precargar el secreto en el cliente HTTP, `NEXT_PUBLIC_ADMIN_SECRET=Kinesis2025*#` (o el mismo valor que `ADMIN_SECRET`).
2. Arranca la API (puerto 5001) con las variables anteriores y deja que imprima `Server listening on 0.0.0.0:5001`.
3. Arranca el CMS: `cd cms && pnpm dev`. Abre `http://localhost:3000`.
4. Flujo esperado:
   - Si no tienes sesión → el root te lleva a `/admin/login`. Verás un único campo de contraseña y el botón “Entrar”.
   - Escribe exactamente la contraseña configurada en `ADMIN_SECRET` (por ejemplo `Kinesis2025*#`) y pulsa “Entrar”.
   - **Contraseña correcta:** entrarás al dashboard y se guardará la sesión en `localStorage`.
   - **Contraseña incorrecta (401/403):** verás “Contrasena incorrecta” y seguirás en el login.
   - **API apagada o inalcanzable:** verás “No se puede conectar con la API. Asegurate de que el backend este corriendo.” y no pasarás del login.
5. Si ya estás logueado y visitas `/admin/login` o `/`, la app te redirige automáticamente al dashboard. Usa “Salir” en el dashboard para limpiar la sesión y regresar al login.
6. Navegación del CMS (una vez logueado):
   - Sidebar con enlaces: Dashboard (`/admin`), Contenidos (`/admin/content`), Leads (`/admin/leads`) y Ajustes (`/admin/settings`).
   - Contenidos (`/admin/content`) trabaja contra `/api/admin/programs`:
     - Listado con filtros (buscar por nombre/código, estado, visibilidad), tabla con Nombre, Código, Activo, Visible web y acciones Editar/Borrar.
     - Botón “Añadir programa” abre `/admin/content/new` con formulario dedicado.
     - Acción Editar abre `/admin/content/{id}/edit`; en ambas pantallas puedes guardar o cancelar (vuelve al listado).
     - Borrar pide confirmación y elimina vía API.
     - Estados: “Cargando programas...” mientras trae datos; mensaje de error si falla; “No hay programas disponibles” si la API responde vacío.
