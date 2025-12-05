<div align="center"><strong>Next.js 15 Admin Dashboard with MooseStack Analytics</strong></div>
<div align="center">Real-time OLAP analytics powered by ClickHouse</div>
<br />

## Overview

An admin dashboard demonstrating **embedded OLAP analytics** using [MooseStack](https://github.com/514-labs/moosestack) within a Next.js application.

### Tech Stack

| Layer                  | Technology                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| **Framework**          | [Next.js 15](https://nextjs.org) (App Router)                                                 |
| **Language**           | [TypeScript](https://www.typescriptlang.org)                                                  |
| **Auth**               | [NextAuth.js](https://authjs.dev) (GitHub OAuth)                                              |
| **CRUD Database**      | [PostgreSQL](https://vercel.com/postgres) (Neon) + [Drizzle ORM](https://orm.drizzle.team)    |
| **Analytics Database** | [ClickHouse](https://clickhouse.com) via [MooseStack](https://github.com/514-labs/moosestack) |
| **Styling**            | [Tailwind CSS](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com)                |

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Complete guide to the codebase structure
- **[olap/MOOSE_IN_NEXT_GUIDE.md](./olap/MOOSE_IN_NEXT_GUIDE.md)** — How to set up Moose in Next.js

---

## Quick Start

### Prerequisites

- **Node.js v20** (required for native module compatibility)
- **Docker** (for ClickHouse via Moose)
- **pnpm** (recommended)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local` and configure:

```bash
# PostgreSQL (Neon)
POSTGRES_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Moose
MOOSE_CLIENT_ONLY=true
```

### 3. Start Development Servers

**Terminal 1 — Moose (manages ClickHouse):**

```bash
pnpm dev:moose
```

**Terminal 2 — Next.js:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## NPM Scripts

| Script            | Description                               |
| ----------------- | ----------------------------------------- |
| `pnpm dev`        | Build OLAP models + start Next.js         |
| `pnpm dev:next`   | Start Next.js only (Turbopack)            |
| `pnpm dev:moose`  | Start Moose dev server                    |
| `pnpm build:olap` | Compile OLAP models with schema injection |
| `pnpm build`      | Production build                          |

---

## Project Structure

```
admin-dashboard/
├── app/                    # Next.js pages & API routes
│   └── (dashboard)/        # Dashboard pages (/, /analytics, /products)
├── components/             # React components
│   ├── ui/                 # Generic UI primitives
│   └── analytics/          # Analytics charts & tables
├── lib/                    # PostgreSQL + auth utilities
├── olap/                   # MooseStack OLAP layer ⭐
│   ├── models/             # ClickHouse table definitions
│   └── queries/            # Analytics query functions
└── dist/                   # Compiled OLAP output (generated)
```

---

## Database Setup

### PostgreSQL (Products)

Create the products table:

```sql
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  available_at TIMESTAMP NOT NULL
);
```

Seed with: `GET /api/seed`

### ClickHouse (Analytics)

Moose automatically manages ClickHouse. The `events` table is created based on `olap/models/events.ts`.

---

## Learn More

- [MooseStack Documentation](https://github.com/514-labs/moosestack)
- [Next.js App Router](https://nextjs.org/docs/app)
- [ClickHouse SQL Reference](https://clickhouse.com/docs/en/sql-reference)
