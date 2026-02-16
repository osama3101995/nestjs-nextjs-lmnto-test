# Monorepo Project: NestJS + Next.js + Prisma

This is a full-stack monorepo built with **NestJS** (Backend), **Next.js** (Frontend), and **Prisma** (Database/Shared). It utilizes a shared package architecture to maintain type safety and logic consistency across the entire stack.

---

## Project Structure

The project is organized using npm workspaces:

### `apps/api` (NestJS)

The backend service providing REST APIs, rule evaluation, and PDF generation.

* **Rule Evaluator**: Logic for processing assignment rules.
* **Modules**: Actions, Assignment, Cases, KPIs, PDF, and Rules.
* **Prisma Integration**: Uses `@repo/database` for persistence.

### `apps/web` (Next.js)

The frontend application built with the App Router, Tailwind CSS, and Shadcn UI.

* **React Query**: For state management and data fetching.
* **Zod**: For client-side form validation matching backend schemas.
* **Dynamic Routing**: Case management via `[id]` pages.

### `packages/database` (Prisma)

The database layer.

* **Schema**: Central `schema.prisma` file.
* **Migrations**: SQL migration history.
* **Client**: Exports a generated Prisma Client used by the API.

### `packages/shared` (Common)

Shared logic and types used by both the Frontend and Backend.

* **DTOs**: Zod schemas for request validation.
* **Types**: Shared TypeScript interfaces and enums.

---

## Prerequisites

* **Node.js**: v18 or higher
* **Docker & Docker Compose**: For running the database and containerized services.
* **npm**: v7 or higher (for workspace support).

---

## Setup & Installation

### 1. Environment Configuration

Create a `.env` file in the root directory. This file is used by Docker Compose and the local development environment.

**File: `.env**`

```env
# Application Settings
NODE_ENV=production
APP_PORT=5000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Database Configuration (Used by PostgreSQL Docker container)
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=collections
POSTGRES_USER=collections_user
POSTGRES_PASSWORD=collections_password

# Prisma Connection String
DATABASE_URL=postgresql://collections_user:collections_password@postgres:5432/collections

```

**Note:** For local development without Docker, change `POSTGRES_HOST` to `localhost`.

### 2. Install Dependencies

Run from the root directory:

```bash
npm install

```

### 3. Generate Database Client

Before building or running the apps, generate the Prisma client:

```bash
npm run generate --workspace @repo/database

```

---

## Development Commands

### Running with Docker (Recommended)

This will start the PostgreSQL database, the Backend API, and the Frontend Web application.

```bash
docker-compose up --build

```

### Local Development

To run services individually outside of Docker:

**Start Database (PostgreSQL):** Ensure you have a local instance running or use Docker to just start the DB.

**Run Backend:**

```bash
npm run start:dev --workspace backend

```

**Run Frontend:**

```bash
npm run dev --workspace web

```

---

## Database Management

Database commands should be run within the `packages/database` workspace:

* **Create Migration:** `npx prisma migrate dev`
* **Apply Migrations:** `npx prisma migrate deploy`
* **Seed Database:** `npx prisma db seed`

---

## Docker Deployment

The project includes a `Dockerfile` and `docker-entrypoint.sh` designed for production-ready deployments.

1. **Build Step**: Compiles all packages and apps.
2. **Prisma Generation**: Generates the client within the container.
3. **Migration Deployment**: Automatically runs `prisma migrate deploy` before the API starts to ensure the schema is up to date.

---

## Swagger UI

You can also access Swagger UI using the following link `http://localhost:5000/api/docs`

---

## Tech Stack

* **Backend**: NestJS, Prisma, Puppeteer (PDF), Zod.
* **Frontend**: Next.js 15+, Tailwind CSS, Shadcn UI, TanStack Query.
* **Language**: TypeScript (Strict Mode).
* **Monorepo**: NPM Workspaces.