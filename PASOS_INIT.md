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

## 5. PROBAR LOGIN BÁSICO
1. Backend encendido (`PORT=5001`) y CMS en `pnpm dev` como se explicó arriba.
2. Abre `http://localhost:3000` (te llevará al login si no tienes sesión, y al dashboard si ya la tienes guardada en el navegador).
3. Aparece un único campo llamado “Contraseña de admin”. Escribe exactamente el secreto del backend (`ADMIN_SECRET`). Con la plantilla actual es `Kinesis2025*#`.
4. Pulsa “Entrar”.
   - **Si la contraseña es correcta:** la API responde 200, la sesión se guarda en `localStorage` y se muestra el dashboard mínimo con el botón “Salir”.
   - **Si la contraseña es incorrecta (401/403):** el formulario muestra `Contrasena incorrecta` y sigues en la pantalla de login.
   - **Si la API está caída o no responde:** verás `No se puede conectar con la API. Asegurate de que el backend este corriendo.` y el login no avanzará hasta que levantes el backend.
5. Desde el dashboard pulsa “Salir” para borrar la sesión y volver automáticamente al login.
