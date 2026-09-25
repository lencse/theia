---
name: new-package
description: Scaffold a new internal TypeScript package in this turborepo (packages/<name>, published in-repo as @repo/<name>) with build, dev watch, type-check and Vitest test scripts wired into turbo, modeled on packages/wenger-pkg. Use this whenever the user wants a new package, library, shared module, workspace, or "lib" in the monorepo, or wants to extract code from an app (e.g. apps/wenger) into its own package, even if they don't say "package" explicitly.
---

# Create a new internal package

`packages/wenger-pkg` is the reference package. It is intentionally minimal: a placeholder function in `src/`, a test for it in `test/`, and the config that plugs it into turbo, pnpm, TypeScript and Vitest. Every new package starts from the same shape so `make build`, `make dev`, `make check-types` and `make test` pick it up with no `turbo.json` changes.

## 1. Settle the name

- Directory: `packages/<name>`. Package name: `@repo/<name>`. Use kebab-case. If the user says `@repo/foo`, the dir is `packages/foo`.
- Check that `packages/<name>` doesn't already exist. If it does, stop and ask. Don't overwrite someone's package.
- If the user didn't give a name, ask. The name ends up in every import, so it's worth getting right.

## 2. Create the files

Create exactly these five files, replacing `<name>`. They match `packages/wenger-pkg`. If that package has since diverged from what's below, prefer its current config files (not its `src`/`test` contents).

`packages/<name>/package.json`:

```json
{
   "name": "@repo/<name>",
   "version": "0.0.0",
   "private": true,
   "type": "module",
   "exports": {
      ".": {
         "types": "./dist/index.d.ts",
         "default": "./dist/index.js"
      }
   },
   "scripts": {
      "build": "tsc -p tsconfig.build.json",
      "dev": "tsc -p tsconfig.build.json --watch --preserveWatchOutput",
      "check-types": "tsc --noEmit",
      "test": "vitest run"
   },
   "devDependencies": {
      "@repo/typescript-config": "workspace:*"
   }
}
```

`packages/<name>/tsconfig.json` (type-checks sources and tests):

```json
{
   "extends": "@repo/typescript-config/base.json",
   "include": ["src", "test"]
}
```

`packages/<name>/tsconfig.build.json` (emits only `src` to `dist`):

```json
{
   "extends": "./tsconfig.json",
   "include": ["src"],
   "compilerOptions": {
      "rootDir": "src",
      "outDir": "dist"
   }
}
```

`packages/<name>/src/index.ts`: the package's public entry point. If the user described what the package is for, write a small real starting point for that. Otherwise use a placeholder like wenger-pkg's:

```ts
export function greet(name: string): string {
   return `Hello, ${name}!`
}
```

`packages/<name>/test/index.test.ts`: at least one test for whatever `src/index.ts` exports:

```ts
import { describe, expect, it } from 'vitest'
import { greet } from '../src/index.js'

describe('greet', () => {
   it('greets by name', () => {
      expect(greet('World')).toBe('Hello, World!')
   })
})
```

Why the details matter:

- **`.js` in relative imports** (`'../src/index.js'`) is required. The base config uses NodeNext resolution, which wants the emitted file's extension even in `.ts` sources.
- **Two tsconfigs.** `check-types` has to see the tests, but `build` must not emit them into `dist`.
- **`exports` points at `dist`.** Consumers get the compiled JS and `.d.ts` files. That's why turbo's `build` task has `dependsOn: ["^build"]` and `outputs: ["dist/**"]`, and why each package has a `dev` watcher.
- **`--preserveWatchOutput`** stops tsc from clearing the terminal, which would wipe other tasks' logs in turbo's TUI.
- **No `vitest` or `typescript` devDependencies.** They're root tooling, and their binaries resolve from the root. Add runtime dependencies to this package only (`pnpm add <dep> --filter @repo/<name>`).
- **Don't add** a `pnpm-lock.yaml`, a `pnpm-workspace.yaml` or a `"pnpm"` field. A nested workspace file makes pnpm treat the dir as its own root and breaks `pnpm run`.

If the package needs JSX, add `"jsx": "react-jsx"` under `compilerOptions` in its `tsconfig.json`, and add `react` as a peer dependency. Everything else stays the same.

## 3. Wire it up if another workspace uses it

If the user wants an app (e.g. `apps/wenger`) to use the package, add `"@repo/<name>": "workspace:*"` to that app's `dependencies` and import it by package name (`from '@repo/<name>'`). Never use a relative path into `packages/`.

## 4. Install

pnpm runs with a frozen lockfile, so a new workspace needs a lockfile entry first:

```sh
pnpm install --lockfile-only && pnpm install
```

Skipping this makes every turbo task fail with `ERR_PNPM_PACKAGE_MANAGER_NO_IMPORTER` or `ERR_PNPM_OUTDATED_LOCKFILE`.

## 5. Verify

```sh
node_modules/.bin/turbo run build check-types test --filter=@repo/<name> --ui=stream
node_modules/.bin/biome check packages/<name>
```

All three tasks should succeed, and `packages/<name>/dist/` should contain `index.js` and `index.d.ts`. If Biome only complains about formatting or import order, run `node_modules/.bin/biome check --write packages/<name>`.

If you wired the package into an app, also run `node_modules/.bin/turbo run build --filter=<app>...` to confirm the app builds against it.

## 6. Report

Tell the user:
- the package name and path, and what's in `src/`
- the verification results
- that `pnpm-lock.yaml` changed (so they see it in the diff)
- that nothing needed to change in `turbo.json`

Update `turbo.json` only if the package needs a new task or writes output somewhere other than `dist/`, and say so if you do.
