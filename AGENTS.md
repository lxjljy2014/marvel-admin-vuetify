# marvel-admin-vuetify — Vue 3 admin dashboard

## Project

Vue 3 admin dashboard template (SoybeanAdmin fork), built on Vuetify 4 + UnoCSS (Wind4). pnpm monorepo with 8 workspace packages. Entry: `src/main.ts` → `registerPlugins(app)` → mounts `#app`.

- **Stack:** Vue 3.5 + TypeScript 6 + Vite 8 + Vuetify 4 + Pinia + Vue Router + Vue I18n
- **Styling:** UnoCSS (presetWind4 + custom `@sa/uno-preset`) for utility classes; Vuetify components for UI primitives
- **Package manager:** pnpm >=10.5, Node >=20.19

## Commands

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Dev server (test mode), port 3000    |
| `pnpm dev:prod`   | Dev server (prod mode)               |
| `pnpm build`      | Production build to `dist/`          |
| `pnpm build:test` | Test-mode build                      |
| `pnpm preview`    | Preview built app, port 3100         |
| `pnpm test`       | Run vitest once                      |
| `pnpm test:watch` | Vitest in watch mode                 |
| `pnpm lint`       | oxlint + eslint fix                  |
| `pnpm fmt`        | oxfmt                                |
| `pnpm typecheck`  | `vue-tsc --noEmit --skipLibCheck`    |
| `pnpm gen-route`  | Generate elegant-router types        |
| `pnpm mcp`        | `ruler apply` (Vuetify MCP)          |
| `pnpm commit`     | Interactive commit (`sa git-commit`) |

Pre-commit hook (via simple-git-hooks): `typecheck → lint → fmt → diff check`.

## Architecture

```
src/
├── main.ts                 Entry — createApp, registerPlugins, mount
├── App.vue                 Root — VDefaultsProvider → AppProvider → RouterView
├── plugins/                Plugin registration (vuetify, router, pinia, i18n, dayjs, nprogress, loading, app-version)
├── router/                 Vue Router + @elegant-router/vue (code-generated routes from views/ file structure)
│   ├── elegant/            Auto-generated route defs (imports.ts, routes.ts, transform.ts)
│   ├── routes/             Builtin routes (login, 403/404/500, iframe)
│   └── guard/              Auth + scroll + progress guards
├── stores/                 Pinia stores (app, auth, route, tab, theme)
├── layouts/                base-layout (sidebar+header+content), blank-layout
├── views/                  Route pages — file-based routing via elegant-router
│   ├── _builtin/           Login, errors, iframe
│   ├── home/               Dashboard
│   ├── manage/             CRUD pages (user, role, menu)
│   └── plugin/             Plugin demos (charts, maps, editor, etc.)
├── components/             Reusable components (common/, custom/, advanced/)
├── service/                HTTP layer — dual request stacks:
│   ├── request/index.ts    Axios-based (createFlatRequest from @sa/axios) — main API
│   └── service-alova/      Alova-based (alternative, with mock support)
├── hooks/                  Composable hooks (common/, business/)
├── utils/                  Helpers (storage, service URLs, icons, agent)
├── locales/                Vue I18n (zh-CN, en, dayjs locale)
├── constants/              App config, business rules, map SDK config
├── enum/                   Store IDs
├── typings/                TypeScript declarations (API, router, global)
├── theme/                  Vuetify theme tokens, breakpoints, CSS vars
├── styles/                 Global SCSS
└── test/setup.ts           Vitest setup (vuetify + pinia + stubs)
```

### Workspace packages (`packages/`)

| Package          | Purpose                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `@sa/axios`      | Axios wrapper — `createRequest`, `createFlatRequest`, retry, error handling |
| `@sa/alova`      | Alova (fetch-based) request client with mock support                        |
| `@sa/uno-preset` | Custom UnoCSS preset (shortcuts, theme)                                     |
| `@sa/hooks`      | Shared composables                                                          |
| `@sa/utils`      | Shared utilities                                                            |
| `@sa/materials`  | Shared UI materials                                                         |
| `@sa/color`      | Color palette utilities                                                     |
| `@sa/scripts`    | CLI scripts (commit, release, gen-route, etc.)                              |

## Conventions

- **Imports:** `@/` alias for `src/`, `~/` for root. Auto-imports for Vue, Vuetify components, and VueUse.
- **Component naming:** PascalCase in templates. Vuetify components use `V` prefix (auto-imported).
- **Views:** Each view is `src/views/<feature>/index.vue` with sub-components in `modules/` subfolder.
- **Stores:** Pinia setup stores (`defineStore(id, () => {…})`). Each store module in `src/stores/modules/<name>/index.ts`.
- **Styling:** Use UnoCSS utility classes, NOT Vuetify utility classes. Vuetify component props (`variant`, `density`, `color`, `size`) are fine. Custom shortcuts: `flex-center`, `flex-y-center`, `card-wrapper`, etc. See the UnoCSS shortcuts in `uno.config.ts`.
- **Formatting:** oxfmt + oxlint + eslint (config: `@soybeanjs/eslint-config-vue`). No semicolons, single quotes.
- **Testing:** Vitest + happy-dom. Tests in `src/**/*.test.ts`. Setup: `src/test/setup.ts` wires Vuetify + Pinia globally.
- **HTTP:** Main API via `@sa/axios` (`createFlatRequest`). Backend success code pattern: `VITE_SERVICE_SUCCESS_CODE` (default `0000`). Dual-stack with Alova for alternative/fetch-based requests.
- **Routing:** File-based via `@elegant-router/vue`. Run `pnpm gen-route` after adding views to regenerate. Auth mode: static or dynamic (`VITE_AUTH_ROUTE_MODE`).
- **i18n:** Keys use dot notation. Locale files in `src/locales/langs/`.

## Notes

<!-- keep for quick-adds -->
