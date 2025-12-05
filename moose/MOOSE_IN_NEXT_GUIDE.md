# How to Embed a Moose OLAP Project in Your Next.js App

This guide explains how to embed a [MooseStack](https://github.com/514-labs/moosestack) OLAP project directly inside your existing Next.js application.

## Prerequisites

- Node.js >= **v20** (recommended for native module compatibility)
- pnpm or npm

---

## 1. Install Dependencies

Add the Moose CLI, library, and build tools to your project:

**Update `package.json`:**

```json
{
  "scripts": {
    "build:moose:types": "tspc -p tsconfig.moose.json --declaration --emitDeclarationOnly",
    "build:moose": "pnpm build:moose:types && tspc -p tsconfig.moose.json",
    "dev:next": "next dev --turbopack",
    "dev:moose": "moose-cli dev",
    "dev": "pnpm build:moose && pnpm dev:next",
    "build": "pnpm build:moose && next build",
    "moose": "moose-cli"
  },
  "dependencies": {
    "@514labs/moose-lib": "^0.6.225",
    "ts-patch": "^3.3.0",
    "tsconfig-paths": "^4.2.0",
    "typia": "^9.6.1"
  },
  "devDependencies": {
    "@514labs/moose-cli": "^0.6.225",
    "ts-node": "^10.9.2"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["@confluentinc/kafka-javascript"]
  }
}
```

> **Note:** The build scripts use `tspc` (from `ts-patch`) instead of `tsc`. This is **required** for the Moose and Typia compiler plugins to run and inject schemas into your models.

**Install packages:**

```bash
pnpm install
# First build (generates dist/ for @/moose/* imports)
pnpm build:moose
```

---

## 2. Configure TypeScript

Set up TypeScript so Moose can run your OLAP TypeScript with `ts-node`, while Next.js consumes the compiled output in `dist/`.

### 2.1 Update `tsconfig.json`

Add the `ts-node` configuration block (required for `moose-cli dev` to work correctly), path mappings for compiled OLAP models, and exclude the source `moose` folder and `dist` output.

```json
{
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs",
      "moduleResolution": "node"
    }
  },
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/moose/*": ["dist/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "dist", "moose"]
}
```

> **Key points:**
>
> - The `ts-node` block ensures `moose-cli dev` uses CommonJS module resolution (required for directory imports like `./models` to work).
> - The `@/moose/*` path maps to `dist/*` where compiled models are output.
> - Both `dist` and `moose` are excluded so Next.js doesn't try to compile them; remember to rebuild after changing files in `moose/` so `dist/` stays in sync.

### 2.2 Create `tsconfig.moose.json`

This dedicated config extends your main tsconfig but overrides settings for compiling Moose OLAP models with the necessary plugins.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "noEmit": false,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "isolatedModules": false,
    "plugins": [
      {
        "transform": "typia/lib/transform"
      },
      {
        "transform": "./node_modules/@514labs/moose-lib/dist/compilerPlugin.js",
        "transformProgram": true
      }
    ],
    "strictNullChecks": true
  },
  "include": ["moose/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> **Key points:**
>
> - `noEmit: false` overrides the parent config to actually emit JS files.
> - `module: commonjs` ensures compatibility with Node.js runtime.
> - The `plugins` array includes both Typia (for validation) and the Moose compiler plugin (for schema injection).
> - Plugin order matters: Typia should come before the Moose plugin.

---

## 3. Configure Next.js

**Update `next.config.ts` (or `.mjs`):**

Handle server-side external packages to prevent bundling issues with native modules.

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@confluentinc/kafka-javascript',
    '@514labs/moose-lib'
  ]
  // ... other config
};

export default nextConfig;
```

---

## 4. Initialize Moose OLAP

### 4.1 Create Directory Structure

```
your-nextjs-app/
├── moose/
│   ├── index.ts          # Main export file
│   ├── models/
│   │   ├── index.ts      # Export all models
│   │   └── events.ts     # Example model
│   └── queries/
│       ├── index.ts      # Export all queries
│       └── my-query.ts   # Example query
├── dist/                 # Compiled output (auto-generated)
├── moose.config.toml
├── tsconfig.json
├── tsconfig.olap.json
└── package.json
```

### 4.2 Create `moose/index.ts`

This file re-exports everything from your models and queries:

```typescript
export * from './models';
export * from './queries';
```

### 4.3 Create `moose.config.toml`

Place this in your project root:

```toml
language = "Typescript"
source_dir = "moose"

[state_config]
storage = "clickhouse"

[clickhouse_config]
db_name = "local"
user = "panda"
password = "pandapass"
use_ssl = false
host = "localhost"
host_port = 18123
native_port = 9000

[http_server_config]
host = "localhost"
port = 4000
management_port = 5001
on_reload_complete_script = "pnpm build:olap"

[features]
streaming_engine = false
data_model_v2 = true
```

> **Note:** The reload script recompiles your OLAP models with the compiler plugins so that the models your Next.js app imports are always updated when you make a change during `moose-cli dev`.
> **Docker required for `pnpm dev:moose`:** Moose spins up ClickHouse via Docker; ensure Docker is running.

---

## 5. Configure Environment Variables

Set the environment variable to tell the Moose library to run in client-only mode.

**Create or update `.env` or `.env.local`:**

```bash
MOOSE_CLIENT_ONLY=true
```

This skips server initialization logic that isn't needed when Moose is embedded in Next.js.

---

## 6. Update `.gitignore`

Add the following to your `.gitignore`:

```gitignore
# Moose
dist/
.moose/
.ts-node/
```

---

## 7. Run the Project

### Development

**Option A: Run Next.js only (with pre-compiled models)**

```bash
pnpm dev        # assumes pnpm build:olap has been run at least once
```

This compiles your OLAP models once and starts Next.js. Use this when you're primarily working on the frontend.

**Option B: Run Moose dev server (for model development)**

```bash
pnpm dev:moose
pnpm dev   # in a second terminal
```

This starts the Moose development server which:

- Watches for changes in `moose/`
- Manages ClickHouse infrastructure
- Auto-recompiles models on change

> **Tip:** Run `pnpm dev:moose` in one terminal and `pnpm dev:next` in another for the full development experience.

### Production Build

```bash
pnpm build
```

---

## Troubleshooting

### "Module not found: Can't resolve '@/moose/...'"

1. Run `pnpm build:moose` to create `dist/`
2. Ensure `tsconfig.json` has the correct path mapping: `"@/moose/*": ["dist/*"]`
3. Keep `dist` out of Next.js compilation (it is excluded in `tsconfig.json`)

### "Supply the type param T so that the schema is inserted by the compiler plugin"

This usually means you're importing the raw source instead of the compiled output (the transformer never ran), so no schema was injected. Ensure:

1. Make sure your `package.json` has the correct build scripts to compile the Moose OLAP models:
   ```json filename="package.json"
   "scripts": {
     "build:moose:types": "tspc -p tsconfig.moose.json --declaration --emitDeclarationOnly",
     "build:moose": "pnpm build:moose:types && tspc -p tsconfig.moose.json"
   }
   ```
2. The `ts-patch` package is installed
   ```bash
   pnpm install ts-patch
   ```
3. The compiler plugins are correctly configured in `tsconfig.moose.json`
   ```json filename="tsconfig.moose.json"
   "plugins": [
     {
       "transform": "typia/lib/transform"
       },
       {
         "transform": "./node_modules/@514labs/moose-lib/dist/compilerPlugin.js",
         "transformProgram": true
       }
     ]
   ```
4. Next.js imports from `dist/` via the `@/moose/*` path alias, not directly from the source folder
   ```typescript filename="next.config.ts"
   export default {
     paths: {
       '@/moose/*': ['dist/*']
     }
   };
   ```

**IMPORTANT:** Double check your imports in your Next.js components are using the `@/moose/*` path alias, not directly from the source folder.

### "ERR_UNSUPPORTED_DIR_IMPORT" when running `moose-cli dev`

This happens when `ts-node` uses ESM module resolution. Ensure your `tsconfig.json` has the `ts-node` configuration block:

```json
{
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs",
      "moduleResolution": "node"
    }
  }
}
```

### Native module version mismatch (NODE_MODULE_VERSION)

This occurs when switching Node.js versions. Fix by:

1. Ensuring you're on Node.js v20
2. Running `pnpm install` to rebuild native modules (e.g., `@confluentinc/kafka-javascript`)
3. If issues persist, delete `node_modules` and reinstall

---

## Example Model

Here's an example that mirrors the real `olap/models/events.ts`:

```typescript
// olap/models/events.ts
import { OlapTable } from '@514labs/moose-lib';

export interface EventModel {
  transaction_id: string;
  event_type: string;
  product_id: number;
  customer_id: string;
  amount: number;
  quantity: number;
  event_time: Date;
  // Denormalized fields for simpler analytics queries without joins in this demo
  customer_email: string;
  customer_name: string;
  product_name: string;
  status: string; // e.g. 'completed', 'active', 'inactive'
}

export const Events = new OlapTable<EventModel>('events', {
  orderByFields: ['event_time']
});
```

## Client Initialization

```typescript
import { getMooseClients, Sql } from '@514labs/moose-lib';

const globalForMoose = globalThis as unknown as {
  mooseClient: Awaited<ReturnType<typeof getMooseClients>> | undefined;
};

export const getMoose = async () => {
  if (globalForMoose.mooseClient) return globalForMoose.mooseClient;

  const client = await getMooseClients({
    database: process.env.MOOSE_CLICKHOUSE_CONFIG__DB_NAME,
    host: process.env.MOOSE_CLICKHOUSE_CONFIG__HOST,
    port: process.env.MOOSE_CLICKHOUSE_CONFIG__PORT,
    username: process.env.MOOSE_CLICKHOUSE_CONFIG__USER,
    password: process.env.MOOSE_CLICKHOUSE_CONFIG__PASSWORD,
    useSSL: process.env.MOOSE_CLICKHOUSE_CONFIG__USE_SSL === 'true'
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForMoose.mooseClient = client;
  }
  return client;
};
```

## Example Query

```typescript
// olap/queries/overview-metrics.ts
import { sql } from '@514labs/moose-lib';
import { Events } from '../models/events';
import { executeQuery } from './client';
import { DateRange } from './revenue-over-time';

export const getOverviewMetrics = async (dateRange?: DateRange) => {
  const startDate = dateRange?.start.toISOString().split('T')[0];
  const endDate = dateRange?.end.toISOString().split('T')[0];

  const dateFilter = dateRange
    ? sql`AND event_time >= toDate(${startDate!}) AND event_time <= toDate(${endDate!})`
    : sql``;

  const revenue = await executeQuery<{ total_revenue: number }[]>(
    sql`SELECT sum(amount) as total_revenue FROM ${Events} WHERE event_type = 'purchase' ${dateFilter}`
  );

  const sales = await executeQuery<{ total_sales: number }[]>(
    sql`SELECT count(*) as total_sales FROM ${Events} WHERE event_type = 'purchase' ${dateFilter}`
  );

  const activeUsers = await executeQuery<{ active_users: number }[]>(
    sql`SELECT uniq(customer_id) as active_users FROM ${Events} WHERE event_time > now() - interval 1 hour`
  );

  return {
    totalRevenue: revenue[0]?.total_revenue || 0,
    totalSales: sales[0]?.total_sales || 0,
    activeNow: activeUsers[0]?.active_users || 0
  };
};
```

---

## Summary

| File                  | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `tsconfig.json`       | Main Next.js config with `ts-node` block and path mappings |
| `tsconfig.moose.json` | Moose-specific config with compiler plugins                |
| `moose.config.toml`   | Moose CLI configuration                                    |
| `moose/`              | Source directory for models and queries                    |
| `dist/`               | Compiled output imported by Next.js                        |
