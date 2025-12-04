# How to Embed a Moose OLAP Project in Your Next.js App

This guide explains how to embed a [MooseStack](https://github.com/514-labs/moosestack) OLAP project directly inside your existing Next.js application.

## Prerequisites

- Node.js **v20** (recommended for native module compatibility)
- pnpm, npm, or yarn

> ⚠️ **Important:** Use Node.js v20 for both `dev:moose` and `dev:next` to avoid native module version mismatches with `@confluentinc/kafka-javascript`.

---

## 1. Install Dependencies

Add the Moose CLI, library, and build tools to your project.

**Update `package.json`:**

```json
{
  "scripts": {
    "build:olap:types": "tspc -p tsconfig.olap.json --declaration --emitDeclarationOnly",
    "build:olap": "pnpm build:olap:types && tspc -p tsconfig.olap.json",
    "dev:next": "next dev --turbopack",
    "dev:moose": "moose-cli dev",
    "dev": "pnpm build:olap && pnpm dev:next",
    "build": "pnpm build:olap && next build",
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
```

---

## 2. Configure TypeScript

Set up TypeScript to handle Moose models separately from your Next.js app.

### 2.1 Update `tsconfig.json`

Add the `ts-node` configuration block (required for `moose-cli dev` to work correctly), path mappings for compiled OLAP models, and exclude the source `olap` folder and `dist` output.

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
      "@/olap/*": ["dist/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "dist", "olap"]
}
```

> **Key points:**
>
> - The `ts-node` block ensures `moose-cli dev` uses CommonJS module resolution (required for directory imports like `./models` to work).
> - The `@/olap/*` path maps to `dist/*` where compiled models are output.
> - Both `dist` and `olap` are excluded so Next.js doesn't try to compile them.

### 2.2 Create `tsconfig.olap.json`

This dedicated config extends your main tsconfig but overrides settings for compiling OLAP models with the necessary plugins.

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
  "include": ["olap/**/*"],
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

## 4. Initialize Moose

### 4.1 Create Directory Structure

```
your-nextjs-app/
├── olap/
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

### 4.2 Create `olap/index.ts`

This file re-exports everything from your models and queries:

```typescript
export * from './models';
export * from './queries';
```

### 4.3 Create `moose.config.toml`

Place this in your project root:

```toml
language = "Typescript"
source_dir = "olap"

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
on_reload_complete_script = "tspc -p tsconfig.olap.json"

[features]
streaming_engine = false
data_model_v2 = true
```

> **Note:** The `on_reload_complete_script` uses `tspc` to recompile models with plugins when files change during `dev:moose`.

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
pnpm dev
```

This compiles your OLAP models once and starts Next.js. Use this when you're primarily working on the frontend.

**Option B: Run Moose dev server (for model development)**

```bash
pnpm dev:moose
```

This starts the Moose development server which:

- Watches for changes in `olap/`
- Manages ClickHouse infrastructure
- Auto-recompiles models on change

> **Tip:** Run `pnpm dev:moose` in one terminal and `pnpm dev:next` in another for the full development experience.

### Production Build

```bash
pnpm build
```

---

## Troubleshooting

### "Supply the type param T so that the schema is inserted by the compiler plugin"

This error means the compiler plugin didn't run. Ensure:

1. You're using `tspc` (not `tsc`) in your build scripts
2. The `ts-patch` package is installed
3. The plugins are correctly configured in `tsconfig.olap.json`

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
2. Running `pnpm install` to rebuild native modules
3. If issues persist, delete `node_modules` and reinstall

### "Module not found: Can't resolve '@/olap/...'"

Ensure:

1. The `dist/` folder exists (run `pnpm build:olap`)
2. Your `tsconfig.json` has the correct path mapping: `"@/olap/*": ["dist/*"]`
3. The `dist` folder is not in your `exclude` array for Next.js compilation

---

## Example Model

Here's an example of a Moose OLAP table model:

```typescript
// olap/models/events.ts
import { OlapTable } from '@514labs/moose-lib';

interface Event {
  transaction_id: string;
  event_type: string;
  product_id: number;
  customer_id: string;
  amount: number;
  quantity: number;
  event_time: Date;
  customer_email: string;
  customer_name: string;
  product_name: string;
  status: string;
}

export const Events = new OlapTable<Event>('events', {
  orderByFields: ['event_time']
});
```

## Example Query

```typescript
// olap/queries/overview-metrics.ts
import { Events } from '../models';

export async function getOverviewMetrics() {
  const result = await Events.select({
    columns: ['sum(amount) as total_revenue'],
    where: "event_type = 'purchase'"
  });
  return result;
}
```

---

## Summary

| File                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `tsconfig.json`      | Main Next.js config with `ts-node` block and path mappings |
| `tsconfig.olap.json` | OLAP-specific config with compiler plugins                 |
| `moose.config.toml`  | Moose CLI configuration                                    |
| `olap/`              | Source directory for models and queries                    |
| `dist/`              | Compiled output imported by Next.js                        |
