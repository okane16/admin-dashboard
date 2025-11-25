## Development Workflow: Hot Reloading OLAP Models

With Moose's `on_reload_complete_script` configured, you have a simple workflow that doesn't require additional dependencies like `concurrently`.

### Recommended Approach: Using Moose Dev Server's `on_reload_complete_script`

**Configuration:**
Your `moose.config.toml` is configured with:

```toml
[http_server_config]
host = "localhost"
port = 4000
management_port = 5001
on_reload_complete_script = "tsc -p tsconfig.olap.json"
```

**How to use it:**

1. **Run Moose dev server** (in one terminal):

```bash
pnpm dev:moose
# or
pnpm moose dev
```

2. **Run Next.js dev server** (in another terminal):

```bash
pnpm dev:next
# or
pnpm dev  # (runs initial OLAP build, then Next.js)
```

**How it works:**

```
You edit olap/index.ts
    ↓
Moose dev server detects change in source_dir (olap/)
    ↓
Moose processes the change and completes reload
    ↓
Runs on_reload_complete_script: tsc -p tsconfig.olap.json
    ↓
Recompiles to dist/index.js (with Moose schema injection)
    ↓
Next.js detects change in dist/ folder
    ↓
Hot reloads your dashboard
```

**Pros:**

- ✅ No extra dependencies needed
- ✅ Integrated with Moose dev server
- ✅ Script runs after Moose has completed its reload cycle, ensuring consistency
- ✅ Simple workflow - just run two commands in separate terminals

**Workflow:**

1. Start Moose dev server: `pnpm dev:moose`
2. Start Next.js dev server: `pnpm dev:next` (or `pnpm dev` for initial build)
3. Edit `olap/index.ts` - Moose automatically recompiles, Next.js hot reloads

---

### Alternative: Running Both in a Single Terminal

If you prefer to run both in a single terminal, you can use your shell's background process feature:

**Bash/Zsh:**

```bash
pnpm dev:moose & pnpm dev:next
```

**Or create a simple script:**

```bash
# Run in background
pnpm dev:moose &
# Run in foreground (Ctrl+C will stop both)
pnpm dev:next
```

**Note:** The `dev` script runs an initial OLAP build then starts Next.js. This is useful if you're not running Moose dev server and just want to work on the Next.js app with pre-compiled OLAP models.

---

### Script Reference

- `pnpm build:olap` - One-time build of OLAP models
- `pnpm dev:moose` - Start Moose dev server (handles OLAP compilation on file changes)
- `pnpm dev:next` - Start Next.js dev server only
- `pnpm dev` - Build OLAP models once, then start Next.js (useful when not using Moose dev server)
