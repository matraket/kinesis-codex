# PASOS_INIT

## Instalar dependencias
1. Abre la terminal.
2. Ve a la carpeta del proyecto: `cd /Applications/XAMPP/xamppfiles/htdocs/git-projects/Kinesis/kinesis-codex`.
3. Escribe: `pnpm install` y espera a que termine.
4. Entra en la carpeta del CMS: `cd cms`.
5. Escribe: `pnpm install` y espera a que termine (esto instala Next y el resto para el CMS).

## Arrancar solo el CMS
1. Desde la carpeta `cms`, escribe: `pnpm dev`.
2. Abre el navegador en `http://localhost:3000`.
3. Si todo va bien, verás la página de login o el panel (si ya guardaste sesión).

## Comprobar que TypeScript compila
1. Asegúrate de haber instalado dependencias en la raíz y en `cms/` (ver pasos arriba).
2. En la raíz, ve a la carpeta del CMS: `cd cms`.
3. Escribe: `pnpm build` (solo revisa el código del CMS).
4. Si todo está bien, el comando termina sin errores. Si ves mensajes de error, revisa los ficheros que indique y vuelve a ejecutar.

## Ver el panel de administración
1. Arranca el CMS (`pnpm dev` dentro de `cms`).
2. En el navegador abre `http://localhost:3000/admin`.
3. Deberías ver el layout con sidebar (Dashboard, Contenidos, Leads, Ajustes) y topbar con título y usuario.

## Configurar variables de entorno de AUTH (si hacen falta)
1. Ahora el login es ficticio: no llama al backend hasta que activemos la API real.
2. Si quieres dejar la URL del backend lista para más tarde, crea `cms/.env.local` y pon `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001` (ajusta el puerto si usas otro). Guárdalo sin comillas.
3. No tienes que tocar `ADMIN_SECRET` todavía para el CMS; solo lo usarás en el backend cuando conectemos la auth real.

## Probar el login ficticio
1. Arranca el CMS (`pnpm dev` dentro de `cms`).
2. Abre `http://localhost:3000/admin/login`.
3. Escribe cualquier email en el primer campo.
4. Escribe cualquier texto en el campo `X-Admin-Secret` (no se comprueba contra el backend aún).
5. Pulsa “Entrar”: irás al dashboard y verás tu email arriba a la derecha.
6. Pulsa “Cerrar sesión” en el topbar: volverás al login y se borra la sesión guardada en el navegador.
