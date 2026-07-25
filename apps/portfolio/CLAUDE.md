# Portfolio — CLAUDE.md

React 19 + Vite 8 SPA. NX package name: `my-profile-portfolio`. ESM (`"type": "module"`), TypeScript, SCSS modules, Zustand 5, TanStack Query 5.

## Architecture

React SPA with client-side routing (`react-router-dom`). Two pages sharing a common layout (Navbar + Footer):

- **`/`** — Home page: single scrollable page with sections (Hero, About, Resume, Techs, Hobbies, Contact).
- **`/about-this-site`** — Static page describing the project's technology stack (lazy-loaded with Suspense).

### Component Categories

- **`pages/`** — Page components: `Home/`, `AboutThisSite/`.
- **`components/layout/`** — Layout shell (`Layout`), `Navbar`, `Footer`, `Section`, `ScrollToTop`.
- **`components/sections/`** — Home page sections: Hero, About, Resume, Techs, Hobbies, Contact.
- **`components/ui/`** — Reusable UI: AppLoader, AppError (boot failure screen; it receives `onRetry` as a prop — calling `useProfile` there would mount a second observer on the errored query and refetch-loop), Button (polymorphic with CSS vars), LocaleSwitcher, ScrollDown, SocialLinks, Spinner.

### State Management

Client state lives in Zustand, server state in TanStack Query — never both.

- **`stores/app.store`** — locale, i18nReady, activeSection + actions (changeLocale, setActiveSection)
- **`query/client`** — QueryClient defaults: `retry: false`, `staleTime: Infinity`, no refetch on window focus (profile data is immutable for a session; recovery is the explicit retry on `AppError`)
- **`query/keys`** — query key factories. Keep them here, not in the hooks: `test-utils` imports them, and reaching into a hook would pull `app.store` → `utils/i18n`, whose module body runs `i18n.init()`

### API Layer

Native `fetch` wrapper (`FetchApi`) with `credentials: 'include'`; the auth cookie is an HTTP-only cookie managed by the browser. Because fetch doesn't throw on HTTP errors, `FetchApi` normalizes every failure into `ApiError` and handles the 401 → `/v1/auth/token` → single-retry flow explicitly (guarded by an `x-no-retry` header, single-flight so concurrent 401s share one refresh). Bodies are parsed empty-safe: 204s return `undefined`, non-JSON bodies (a gateway's HTML error page) come back as raw text.

Errors either toast (`showError`, the default — used by `getFile`/`getVcard`) or stay silent for callers that render their own UI (`loadProfile` → `AppError`, `sendMail` → form toast).

### Hooks

- `useProfile` — profile query keyed by locale; a locale switch refetches, switching back is served from cache
- `useAppReady` — boot gate: `i18nReady && profile loaded`
- `useMenuScrollSpy` — Intersection Observer for active nav section tracking
- `useInView` — Intersection Observer hook returning `{ ref, inView }` (with `once` option)
- `useProfileFileUrl` — caches the file *blob* per locale+file; each consumer derives its own object URL via `useMemo` and revokes it on unmount. The URL is not cached (a shared URL would outlive its owner) and not set from an effect (`react-hooks/set-state-in-effect`)

### Build

Vite config injects `VITE_APP_VERSION` from `package.json`. Code splitting via Rolldown `codeSplitting.groups` with a vendor chunk (node_modules, minSize 250kB). `my-profile-shared` included in `optimizeDeps`.

## Directory Structure

```
src/
  App.tsx, main.tsx
  api/                 # fetch client (Api, FetchApi, ApiError)
  assets/locales/      # i18n JSON (en.json, fr.json)
  components/
    layout/            # Layout, Navbar, Footer, Section, ScrollToTop
    sections/          # Hero, About, Resume, Techs, Hobbies, Contact
    ui/                # AppLoader, AppError, Button, LocaleSwitcher, ScrollDown, SocialLinks, Spinner
  hooks/               # useProfile, useAppReady, useMenuScrollSpy, useInView, useProfileFileUrl
  pages/               # Home, AboutThisSite
  query/               # TanStack Query client + key factories
  stores/              # app.store
  styles/              # Global SCSS (_variables, _mixins, _reset, _typography, global)
  utils/               # i18n, date, phone, console-greeting
  test-utils.tsx       # renderWithQueryClient / createQueryWrapper
__mocks__/
  zustand.ts           # Auto-reset mock for Zustand stores
  react-i18next.ts     # Auto-mock for useTranslation / Trans
```

One component per directory with colocated test (`*.spec.tsx`) + SCSS module (`*.module.scss`).

## Testing

- **Framework**: Vitest + Testing Library + jest-dom, jsdom environment
- **Config**: `vitest.config.ts` — jsdom, globals, setup file `src/test-setup.ts`, CSS modules with `classNameStrategy: 'non-scoped'`
- **Setup**: `test-setup.ts` imports `@testing-library/jest-dom`
- **Colocated tests**: `*.spec.tsx` / `*.spec.ts` next to source
- **Fixtures**: import from `my-profile-shared/fixtures/profile.fixtures`

### Testing components that read server state (`test-utils.tsx`)

Anything rendering a component that calls `useProfile`/`useProfileFileUrl`, or a mutation, needs a provider: use `renderWithQueryClient(ui, { profile })` (or `createQueryWrapper` for `renderHook`). Each call builds a **fresh** `QueryClient`, so the cache can't bleed between tests, and seeds `['profile', locale]` via `setQueryData` — the replacement for the old `useProfileStore.setState({ profile })`.

Seeded specs stay network-free because they mock `utils/i18n` (`isInitialized: false`), leaving `i18nReady` false so the query is `enabled: false` while cached data is still returned. **If a spec sets `i18nReady: true`, mock `api/Api` too** or the real `queryFn` will run.

### Global Mocks (`__mocks__/`)

Located at project root (`apps/portfolio/__mocks__/`), these are activated by a bare `vi.mock()` call — no factory argument needed:

- **`zustand.ts`** — Wraps `create()` to track initial state and auto-reset all stores in `afterEach`. Activate with `vi.mock('zustand')`.
- **`react-i18next.ts`** — Auto-mock for `useTranslation` and `Trans`. Activate with `vi.mock('react-i18next')`.

### Mock policy
Use mock `vi.mock`, `vi.hoisted` ONLY when it's strictly needed.

### Constraints
- Prefer test behavior instead of implementation.
NEVER do assert to logs.
- Always check typescript and code style of test files.
- A test must be able to fail for a reason in `src/`. If the only way to break it is editing a fixture, a mock, or third-party config (e.g. asserting TanStack Query serves a cached key, when `staleTime` comes from `test-utils`), it tests the library, not us — delete it. Assertions anchored to our own choices are fine even when a library sits in the path: "a locale change refetches" guards the locale being in the query key.
- Verify with `npm run test` **and** `npm run tsc`: a type-only import is erased at runtime, so a wrong path can pass every test and still fail to type-check.

## ESLint

**Version**: ESLint 10 — flat config (`eslint.config.js`), TypeScript-ESLint with type-aware linting.

**Config file**: `eslint.config.js`

**Plugins**: `typescript-eslint`, `react-hooks`, `react-refresh`, `simple-import-sort`, `prettier`

**Key rules**:
- Type-safe: `no-explicit-any`, `no-floating-promises`, `no-misused-promises`, `no-unsafe-argument`, `await-thenable` (all `error`)
- Style: `curly`, `prefer-template`, `prefer-destructuring` (object only)
- Import ordering: `simple-import-sort/imports` + `simple-import-sort/exports`
- React: `react-refresh/only-export-components` (`warn`)

**Ignored**: `dist/`, `coverage/`

## TypeScript

**Version**: TypeScript 6 — strict mode, `noEmit`.

**Config files**:
- `tsconfig.json` — Solution-style root (references `tsconfig.app.json` + `tsconfig.node.json`)
- `tsconfig.app.json` — App source (`src/`, `__mocks__/`): target ES2020, `react-jsx`, bundler resolution, `verbatimModuleSyntax`, `vitest/globals` types
- `tsconfig.node.json` — Tooling configs (`vite.config.ts`, `vitest.config.ts`): target ES2022, bundler resolution

**Strict flags**: `strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`

## Commands

```bash
npm run lint              # ESLint (eslint .)
npm run tsc               # Type-check (tsc -b)
npm run test              # Single run (vitest run)
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run start:dev         # Dev server (Vite, port 5174)

# Single test file
npm run test -- src/stores/app.store.spec.ts
```

## CSS Units Policy

- **`rem`** for font-sizes, spacing, dimensions, border-radius (base: 16px = 1rem)
- **`px`** only for borders, box-shadows, transforms, letter-spacing, breakpoints, and tightly-coupled decorative positioning
- **`em`** only for parent-relative values (e.g., paragraph margin, list indent)

Design tokens in `styles/_variables.scss`.

## Styling

SCSS modules (`.module.scss` per component). Global styles and design tokens in `styles/`.

### Design Tokens (`_variables.scss`)

- **Palette** (Nord-inspired): backgrounds (`$bg-primary: #434c5e`, `$bg-secondary: #4c566a`, `$bg-darkest: #2e3440`), text (`$text-primary: #d8dee9`, `$text-secondary: #8fbcbb`, `$text-tertiary: #88c0d0`)
- **Fonts**: Open Sans (body), Poppins (headings)
- **Breakpoints**: `$breakpoint-sm: 460px`, `$breakpoint-md: 768px`, `$breakpoint-lg: 900px`, `$breakpoint-h-sm: 600px`
- **Transitions**: fast (0.2s), normal (0.3s), slow (0.5s)
- **Mixins** (`_mixins.scss`): `respond-below()`, `respond-above()`, `respond-below-height()`, `container()`
