### Kinesis Web + CMS Project Guide for Codex Agent

#### Overview
This project is a **modular monolith** combining a public-facing website (`web/`), a Content Management System (CMS) backoffice (`cms/`), and a unified API (`api/`), all built in **TypeScript**. The architecture is designed for future transition to microservices. The project aims to reflect Kinesis's business philosophy of precision, innovation, and structured flows through a professional and clean technical implementation.

#### Agent Operating Rules

The Agent's actions are governed by the following rules:

| Folder Access | Rule | Purpose |
| :--- | :--- | :--- |
| **Writable** | `core/`, `web/`, `cms/`, `api/`, `shared/`, `scripts/`, `docs/`, `tests/` | Creation, modification, and deletion are allowed. |
| **Read-Only** | `context/`, `config/`, platform configuration files (e.g. `.replit`, `Dockerfile`, infra manifests) | **Do not modify or delete files in `context/`** (business documentation) or core configuration files, unless explicitly instructed. |

**`codex.md` is the main contract for this project when working with Codex. You MAY only append new notes or sections that keep it consistent and up to date. You MUST NOT delete sections, rename sections, or refactor this file globally unless explicitly requested by the user.**

#### Architectural Enforcement

* Do not mix layers (e.g., no domain logic in presentation, no direct database calls in `domain/`).
* `web/` and `cms/` must only communicate with `api/` via HTTP; they must **not** be coupled directly.
* All significant changes (new modules, major refactors, API contract updates) **must be documented** in `docs/CHANGELOG.md`.

#### Coding Conventions & Naming Standards

* **Classes, Interfaces, Types, React Components**: **PascalCase**
* **Functions, Variables, Properties, Methods**: **camelCase**
* **Constants, Environment Variables**: **UPPER_SNAKE_CASE**
* **Files and Routes**: **kebab-case**
* **Database Fields/External Schemas**: **snake_case** (only when mapping to external schemes; map to internal `camelCase` models in `infrastructure/`)

#### Style Guidelines

* Use TypeScript with explicit typing at all borders.
* Prefer functional React components with hooks.

#### Testing & Quality Assurance

* **Do not introduce new significant features without creating or updating related tests**.
* If existing tests are deleted (only allowed if functionality is entirely removed), this change **must be documented in `docs/CHANGELOG.md`**.

---

#### System Architecture

The project adheres to Clean Architecture and Domain-Driven Design principles:

* **`domain/`**: Pure OO + DDD, containing Entities, Value Objects, Aggregates, business logic, and Domain Events. Framework-agnostic.
* **`application/`**: Orchestrates Use Cases, defines interfaces (Ports) for repositories and external services, and publishes events.
* **`infrastructure/`**: Implements repository interfaces, adapts external services (DB, auth, storage), and handles model-to-schema mapping.
* **`presentation/` (web/cms) & `interfaces/` (api)**: Manages UI, routes, HTTP controllers, and **Zod validation** for DTOs, orchestrating UI logic by calling Use Cases.

#### UI/UX Decisions

* **Styling:** Primarily **Tailwind CSS**, with **shadcn/ui** for components.
* **Component Structure:** `shared/ui` for reusable components across `web/` and `cms/`.
* **Mobile:** **Mobile First** approach with responsive design.

---

#### Execution & Deployment Flow

* Runs as a **modular monolith** within a single Node.js deployment (one public HTTP entrypoint) or equivalent hosting environment.
* The main **development** and **production** scripts are defined in `package.json`. Do not change their names or behavior without explicit instruction from the user.
* The Node.js server in `api/` must serve both the **API** (`/api/**` routes) and static assets for `web/` and `cms/` from a **single public port** (`process.env.PORT`).
* **Development (`dev` script):** Starts backend and frontends in development mode via a single Node server or coordinated dev setup.
* **Production (`start` script):** Generates static bundles and then starts the Node server to serve API and static bundles.
* **Environment Variables:** Always use `process.env.PORT` for the HTTP port and never hard-code port numbers.

#### Testing Scope

* **Unit Tests:** Required for key Use Cases in `api/domain/` and `api/application/`.
* **Integration Tests:** Must cover critical flows like lead creation and main CMS workflows.
* **Test Location:** Unit tests near the code or in `__tests__`; Integration/E2E tests in `/tests`.

---

#### External Dependencies

All external infrastructure access is encapsulated within `api/infrastructure/`.

* **Database:** PostgreSQL database (managed service or equivalent). The conceptual data model is defined in `context/kinesis-database-schema.sql`. This file is a **conceptual reference only**; actual tables must be managed via migrations or the chosen DB tooling.
* **Authentication:** Application-level authentication (e.g., JWT/session-based). In early stages, an `X-Admin-Secret` (or similar) header may be used as an admin backdoor, but it must be encapsulated behind infrastructure/adapters and never hard-coded in presentation or domain layers.
* **File Storage:** External file/object storage (or platform-provided storage) for assets, abstracted behind adapters in `api/infrastructure/`.
* **Secrets:** All sensitive values are provided via environment variables (e.g., `DATABASE_URL`, `ADMIN_SECRET`, storage keys). The Agent must not hard-code secrets in the codebase; always read them from the environment and document new secrets in `docs/CHANGELOG.md` when new integrations are introduced.
