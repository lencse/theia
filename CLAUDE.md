# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use the Makefile targets (`make build`, `make dev`, `make lint`, `make format`, `make check-types`, `make verify`). The root `package.json` has no scripts on purpose, so don't add any. The Makefile is the entry point.

- Tests use Vitest. Put them in each package's `test/` dir as `*.test.ts` (Vitest's default glob, so no config is needed); `@repo/wenger-pkg` is the reference setup. wenger has no `test` or `check-types` scripts yet, so `make test` / `make check-types` only cover packages that define them.
- pnpm runs with a frozen lockfile. After adding a workspace or changing dependencies, run `pnpm install --lockfile-only` and then `pnpm install`.
- `make lint` / `make format` run Biome once from the root, not through turbo. `make format` only formats; import sorting and safe lint fixes need `biome check --write`. Generated `*.gen.ts` files are excluded in `biome.json`.
- Biome is the only formatter and linter. Don't use prettier, even though it is still a root devDependency.
- Routes are generated: never hand-edit `apps/wenger/src/routeTree.gen.ts`. Regenerate with `pnpm --filter wenger generate-routes`.

## Turborepo

- **Tasks live in workspaces.** turbo runs a workspace's `package.json` script with the same name as the task. To add a task, add the script to each workspace that needs it and register the task in `turbo.json`. Don't put task logic in root scripts.
- **Declare `outputs` for anything that produces files.** On a cache hit turbo restores only the declared `outputs`, so an undeclared build artifact silently disappears. `build` uses `dist/**` (wenger's Vite/TanStack Start build writes `dist/client` and `dist/server`). If a new package builds somewhere else, add that path. Tasks with no file outputs (lint, check-types, test) need no `outputs`.
- **Use `^` in `dependsOn` for dependency order.** `"dependsOn": ["^build"]` builds workspace dependencies first. Use a plain `"build"` without `^` only for a same-package prerequisite.
- **Long-running tasks** (dev servers, watchers) need `"cache": false, "persistent": true`. Nothing may depend on a persistent task.
- **Env vars must be declared.** turbo 2 runs in strict env mode. A variable that affects a task's output has to be listed in that task's `env` (or in `globalEnv`). Otherwise the task can't see it and the cache key ignores it. `.env*` files are already in `build.inputs`. Do the same for other tasks that read them.
- **Scope runs with filters.** Use `turbo run build --filter=wenger` for one workspace and `--filter=...[origin/main]` for workspaces affected by the current changes. For one-off scripts that aren't turbo tasks, use `pnpm --filter <name> <script>`.
- **Debug caching** with `turbo run <task> --dry` (shows the hash inputs), `--summarize`, or `--force` (skips the cache). `.turbo/` is gitignored.

## Workspace conventions

- Install dependencies in the workspace that uses them (`pnpm add <dep> --filter wenger`). Root devDependencies are only for repo-wide tooling (turbo, Biome, TypeScript, Vitest).
- Internal packages go in `packages/` and are named `@repo/<name>`. Depend on them with `"@repo/<name>": "workspace:*"`. Import them by package name, never by relative paths into another workspace.
- A new internal package must expose its entry point via `main` and `types` in its `package.json`. It must also define the scripts (`build`, `check-types`, `test`, ...) that turbo should run for it. Use the `new-package` skill (`.claude/skills/new-package`) to scaffold one. It copies the layout of `packages/wenger-pkg`: `tsconfig.json` covers `src` and `test` for type checking, and `tsconfig.build.json` emits only `src` to `dist`. Packages override the preset with `module: "ESNext"` and `moduleResolution: "bundler"`, so relative imports have no file extension. The emitted `dist` therefore only works through a bundler (Vite, Vitest), not plain Node.
- Internal packages point `main` and `types` at `dist/`, so consumers (TypeScript, Vite, Node) all read the built output. Run the build or the `dev` watcher before a consumer will see changes, including type changes.

## Shared TypeScript config

`@repo/typescript-config` is the source of shared compiler options. Every workspace's `tsconfig.json` should extend it rather than repeat strictness or target settings.

- Add it as a devDependency (`"@repo/typescript-config": "workspace:*"`) and use `"extends": "@repo/typescript-config/base.json"`.
- `base.json` is currently the only preset. It targets NodeNext module resolution, which fits libraries and Node code. Bundled apps like wenger must override `module: "ESNext"`, `moduleResolution: "bundler"`, and `noEmit: true` (and set `jsx`, `types`, `paths` locally). If several apps need the same overrides, add a new preset (e.g. `vite-react.json`) in the package instead of copying them.
- Put only workspace-specific settings (`include`, `paths`, `types`, `jsx`) in the workspace's own `tsconfig.json`. Compiler strictness changes go in the shared preset.
- wenger does not extend it yet; its `tsconfig.json` is still the standalone TanStack scaffold.

## Code style

Biome (`biome.json`) is authoritative: 3-space indent, single quotes, semicolons only where needed, 100-column width.

## Workspace gotchas

- `apps/wenger` is a TanStack Start app (React 19, Tailwind 4). It uses the `#/*` import alias (package.json `imports`) and has its own TypeScript version, separate from the root.
- Never add a `pnpm-workspace.yaml` or `pnpm-lock.yaml` inside a workspace. pnpm would treat that dir as its own workspace root, check its own lockfile before `pnpm run`, and fail. The root lockfile and workspace file are the only ones. Build-script approval goes in the root `pnpm-workspace.yaml` (`allowBuilds`), not in a package's `pnpm` field (pnpm ignores it).
- `README.md` is an unmodified create-turbo leftover. Don't treat it as describing this repo.
