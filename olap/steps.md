1. Have your nextjs app
2. Install moose cli and lib in your project.
3. add the following to your package.json:

```json filename="package.json"
{
  "scripts": {
    "build:olap": "tsc -p tsconfig.olap.json",
    "dev": "pnpm build:olap && next dev",
    "build": "pnpm build:olap && next build",
    "moose": "moose-cli"
  },
  "dependencies": {
    "@514labs/moose-lib": "latest",
    "typia": "^9.6.1",
    "ts-patch": "^3.3.0",
    "tsconfig-paths": "^4.2.0"
  },
  "devDependencies": {
    "@514labs/moose-cli": "latest",
    "@types/node": "^20.12.12"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["@confluentinc/kafka-javascript"]
  }
}
```

To install the dependencies, run the following command:

```bash
pnpm install
```

4. Create a folder in your code for your olap models (olap). Create index.ts file in the folder.

5. IN project root, create a moose.config.toml file.

6. In moose.config.toml, add the following:

```toml filename="moose.config.toml"
language = "Typescript"
source_dir = "olap"

[state_config]
storage = "clickhouse"
```

7. Update your `tsconfig.json` to include the Moose compiler plugins and map the path:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    // ... existing options
    "paths": {
      // Map your olap folder to the built files
      "@/olap/*": ["dist/*"]
    },
    "plugins": [
      {
        "name": "next"
      },
      {
        "transform": "./node_modules/@514labs/moose-lib/dist/compilerPlugin.js",
        "transformProgram": true
      },
      {
        "transform": "typia/lib/transform"
      }
    ]
  }
}
```

8. Create a `tsconfig.olap.json` file to handle the separate build of OLAP models (necessary for runtime schema injection):

```json filename="tsconfig.olap.json"
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "noEmit": false,
    "module": "commonjs",
    "moduleResolution": "node",
    "declaration": true,
    "emitDeclarationOnly": false,
    "isolatedModules": false
  },
  "include": ["olap/index.ts"]
}
```

9. Update your `next.config.ts` (or .js) to handle server external packages:

```typescript filename="next.config.ts"
export default {
  serverExternalPackages: [
    '@confluentinc/kafka-javascript',
    '@514labs/moose-lib'
  ]
  // ... other config
};
```

10. Start your dev server:

```bash
pnpm dev
```

This setup ensures that your OLAP models are compiled with the necessary Moose schema injections before your Next.js app starts, avoiding runtime errors when querying the models.
