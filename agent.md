### Kinesis Web + CMS Project Guide for Codex Agent

#### Overview
Este proyecto es un **monolito modular** que combina un sitio web público (`web/`), un backoffice CMS (`cms/`) y una API unificada (`api/`), todo construido en **TypeScript**. La arquitectura está diseñada para una futura transición a microservicios. El objetivo es reflejar la filosofía de negocio de Kinesis: precisión, innovación y flujos estructurados, mediante una implementación técnica profesional y limpia.

#### Reglas de Operación del Agente

Las acciones del Agente se rigen por las siguientes reglas:

| Acceso a Carpetas | Regla | Propósito |
| :--- | :--- | :--- |
| **Escritura permitida** | `core/`, `web/`, `cms/`, `api/`, `shared/`, `scripts/`, `docs/`, `tests/` | Se permite crear, modificar y eliminar archivos. |
| **Solo lectura** | `context/`, `config/`, archivos de configuración de plataforma (por ejemplo, `.replit`, `Dockerfile`, manifiestos de infraestructura) | **No modificar ni eliminar archivos en `context/`** (documentación de negocio) ni archivos de configuración principales, salvo instrucción explícita. |

**`agent.md` es el contrato principal para este proyecto cuando trabajas con Codex. SOLO puedes agregar nuevas notas o secciones que mantengan la coherencia y actualización del archivo. NO debes eliminar, renombrar ni refactorizar secciones globalmente salvo instrucción explícita del usuario.**

#### Enfoque Arquitectónico

* No mezclar capas (por ejemplo, no lógica de dominio en presentación, ni llamadas directas a base de datos en `domain/`).
* `web/` y `cms/` solo deben comunicarse con `api/` vía HTTP; no deben acoplarse directamente.
* Todos los cambios significativos (nuevos módulos, refactorizaciones mayores, actualizaciones de contratos de API) **deben documentarse** en `docs/CHANGELOG.md`.

#### Convenciones de Código y Nomenclatura

* **Clases, Interfaces, Tipos, Componentes React:** **PascalCase**
* **Funciones, Variables, Propiedades, Métodos:** **camelCase**
* **Constantes, Variables de Entorno:** **UPPER_SNAKE_CASE**
* **Archivos y Rutas:** **kebab-case**
* **Campos de Base de Datos/Esquemas Externos:** **snake_case** (solo al mapear esquemas externos; internamente usar modelos `camelCase` en `infrastructure/`)

#### Guía de Estilo

* Usar TypeScript con tipado explícito en todos los bordes.
* Preferir componentes funcionales de React con hooks.

#### Pruebas y Garantía de Calidad

* **No introducir nuevas funcionalidades significativas sin crear o actualizar las pruebas correspondientes**.
* Si se eliminan pruebas existentes (solo permitido si la funcionalidad se elimina por completo), este cambio **debe documentarse en `docs/CHANGELOG.md`**.

#### Arquitectura del Sistema

El proyecto sigue principios de Clean Architecture y Domain-Driven Design:

* **`domain/`**: Puro OO + DDD, contiene Entidades, Value Objects, Aggregates, lógica de negocio y Domain Events. Agnóstico de frameworks.
* **`application/`**: Orquesta casos de uso, define interfaces (Ports) para repositorios y servicios externos, y publica eventos.
* **`infrastructure/`**: Implementa interfaces de repositorio, adapta servicios externos (DB, auth, storage) y gestiona el mapeo de modelos a esquemas.
* **`presentation/` (web/cms) & `interfaces/` (api)**: Gestiona UI, rutas, controladores HTTP y validación Zod para DTOs, orquestando la lógica de UI llamando casos de uso.

#### Decisiones de UI/UX

* **Estilos:** Principalmente **Tailwind CSS**, con **shadcn/ui** para componentes.
* **Estructura de Componentes:** `shared/ui` para componentes reutilizables entre `web/` y `cms/`.
* **Mobile:** Enfoque **Mobile First** con diseño responsivo.

#### Ejecución y Despliegue

* Corre como un **monolito modular** en un solo despliegue Node.js (un único punto de entrada HTTP público) o entorno de hosting equivalente.
* Los scripts principales de **desarrollo** y **producción** están definidos en `package.json`. No cambiar nombres ni comportamiento sin instrucción explícita del usuario.
* El servidor Node.js en `api/` debe servir tanto la **API** (`/api/**`) como los assets estáticos de `web/` y `cms` desde un **único puerto público** (`process.env.PORT`).
* **Desarrollo (`dev` script):** Inicia backend y frontends en modo desarrollo mediante un solo servidor Node o setup coordinado.
* **Producción (`start` script):** Genera los bundles estáticos y luego inicia el servidor Node para servir API y bundles estáticos.
* **Variables de Entorno:** Usar siempre `process.env.PORT` para el puerto HTTP y nunca hardcodear números de puerto.

#### Alcance de Pruebas

* **Unit Tests:** Requeridos para casos de uso clave en `api/domain/` y `api/application/`.
* **Integration Tests:** Deben cubrir flujos críticos como creación de leads y principales workflows del CMS.
* **Ubicación de Pruebas:** Unit tests cerca del código o en `__tests__`; Integration/E2E tests en `/tests`.

#### Dependencias Externas

Todo acceso a infraestructura externa está encapsulado en `api/infrastructure/`.

* **Base de Datos:** PostgreSQL (servicio gestionado o equivalente). El modelo conceptual está en `context/kinesis-database-schema.sql`. Este archivo es solo referencia conceptual; las tablas reales se gestionan vía migraciones o tooling elegido.
* **Autenticación:** Autenticación a nivel de aplicación (por ejemplo, JWT/sesiones). En etapas iniciales, se puede usar un header tipo `X-Admin-Secret` como backdoor admin, pero debe estar encapsulado detrás de adaptadores de infraestructura y nunca hardcodeado en presentación o dominio.
* **Almacenamiento de Archivos:** Almacenamiento externo de archivos/objetos (o storage provisto por la plataforma), abstraído detrás de adaptadores en `api/infrastructure/`.
* **Secrets:** Todos los valores sensibles se proveen vía variables de entorno (por ejemplo, `DATABASE_URL`, `ADMIN_SECRET`, claves de storage). No hardcodear secrets; siempre leerlos del entorno y documentar nuevos secrets en `docs/CHANGELOG.md` al introducir nuevas integraciones.
