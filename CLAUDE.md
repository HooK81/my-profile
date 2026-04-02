# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio / digital CV web application. NX monorepo with three packages:

- **`apps/api`** — NestJS 11 REST API (Node.js 22, TypeScript, SWC)
- **`apps/portfolio`** — React 19 + Vite 7 SPA (TypeScript, SCSS, Zustand)
- **`libs/shared`** — Shared API contracts (Zod schemas, TypeScript types)

NX package names: `my-profile-api`, `my-profile-portfolio`, `my-profile-shared`.

## Common Commands

```bash
# Development
npm run dev:api              # Start API in watch mode (port 3000)
npm run dev:portfolio        # Start portfolio dev server (Vite, port 5174)

# Build
npm run build                # Build all projects via NX
npm run build:shared         # Build shared lib (must run before API build)
npm run build:api            # Build API only
npm run build:portfolio      # Build portfolio only

# Test
npm run test                 # Run all tests (Vitest)
npm run test:api             # API tests only
npm run test:api:cov         # API tests with coverage
npm run test:portfolio       # Portfolio tests only

# Single test file (run from app directory)
cd apps/api && npm run test -- src/auth/auth.service.spec.ts
cd apps/portfolio && npm run test -- src/stores/app.store.spec.ts

# Lint & type-check
npm run lint                 # ESLint all projects (with --fix)
npm run tsc                  # Type-check all projects (no emit)

# NX utilities
npx nx affected -t test      # Test only affected projects
npx nx affected -t build     # Build only affected projects
npx nx graph                 # Visualize dependency graph

# Release
npm run release              # Bump version, update changelog, create git tag
npm run release:dry          # Preview release without making changes
```

## Versioning & Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint + Husky.

**Format:** `type(scope): description`

- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`, `build`
- **Scopes** (optional): `api`, `portfolio`, `shared`, `docker`
- **Breaking changes:** add `!` after type/scope (e.g., `feat(api)!: remove v1 endpoints`) or include `BREAKING CHANGE:` in the commit body

**Version bumps** (determined automatically by NX Release from commit history):
- `fix:` → patch (1.0.0 → 1.0.1)
- `feat:` → minor (1.0.0 → 1.1.0)
- `BREAKING CHANGE` → major (1.0.0 → 2.0.0)

**Release workflow:** `npm run release` bumps all package.json versions, generates `CHANGELOG.md`, commits, and creates a git tag. Docker images read the version directly from `package.json` at build/runtime.

## Architecture

### API (`apps/api`)

NestJS modular architecture with domain modules:

- **`auth/`** — JWT authentication with device-hash verification (passport-jwt). `GET /v1/auth/token` sets an HTTP-only cookie (`access_token`) containing the JWT. The JWT strategy extracts the token from the cookie (not the Authorization header). Cookie flags: `httpOnly`, `secure` (prod only), `sameSite: lax`, `path: /`. Token expiry: 24h (dev) / 5m (prod). Device hash is `SHA-256(User-Agent)` — no shared secret, purely for browser-binding.
- **`profiles/`** — Profile data, file serving (images/PDFs), vCard generation. Routes: `GET /v1/:locale/profiles/:id`.
- **`mail/`** — Contact email sending via Nodemailer with Pug templates.
- **`locale/`** — Locale detection middleware, extracts locale from route params.
- **`config/`** — Environment validation with Zod schemas.
- **`response/`** — Response interceptors and headers service.
- **`init/`** — CORS and Pino logging bootstrap.

API uses URI versioning (`/v1/`). All profile endpoints require JWT auth. Profile data is cached for 2 hours.

Test utilities in `apps/api/test_utils/` use Fishery factories. Tests use Vitest + supertest.

### Portfolio (`apps/portfolio`)

React SPA with client-side routing (`react-router-dom`). Two pages sharing a common layout (Navbar + Footer):

- **`/`** — Home page: single scrollable page with sections (Hero, About, Resume, Techs, Hobbies, Contact).
- **`/about-this-site`** — Static page describing the project's technology stack.

Directory structure:

- **`pages/`** — Page components: `Home/`, `AboutThisSite/`.
- **`components/layout/`** — Layout shell (`Layout`), `Navbar`, `Footer`, `Section`, `ScrollToTop`.
- **`components/sections/`** — Home page sections: Hero, About, Resume, Techs, Hobbies, Contact.
- **`stores/`** — Zustand stores: `app.store` (locale, loading, errors), `profile.store` (profile data, image blob URL).
- **`api/`** — Axios client wrapper (`withCredentials: true`) with automatic device-hash generation. Auth cookie is managed by the browser via HTTP-only cookie set by the API.
- **`hooks/`** — Custom hooks (e.g., `useScrollSpy`).
- **`styles/`** — Global SCSS. Components use SCSS modules (`.module.scss`).

Vite config includes manual chunks for `tsparticles` and `react-markdown`.

### Shared Library (`libs/shared`)

Zod schemas defining API contracts, used by both API and portfolio:
- `profile.schemas.ts` — Profile, User, Work, Education, Skills, Hobbies, Techs
- `auth.schemas.ts` — Authentication DTOs
- `email-validation.schemas.ts` — Contact form validation

Imported as `my-profile-shared` (npm workspace resolution). Must be built (`npm run build:shared`) before API build.

## Code Style

- **ESLint 9** with `simple-import-sort` enforced (externals → internals → relative)
- **Prettier**: 80 char line width, 2-space indent, single quotes, trailing commas
- **TypeScript**: Strict mode, no implicit `any`
- API uses CommonJS modules; portfolio uses ESM (`"type": "module"`)
- **CSS units (portfolio)**: `rem` for font-sizes, spacing, dimensions, border-radius (base: 16px = 1rem). `px` only for borders, box-shadows, transforms, letter-spacing, breakpoints, and tightly-coupled decorative positioning. `em` only for parent-relative values (e.g., paragraph margin, list indent). Design tokens in `_variables.scss`.

## Docker Deployment

```bash
cp .env.dist .env
cp docker/api/.env.production.local.dist docker/api/.env.production.local
cp docker/api/.secrets.production.local.dist docker/api/.secrets.production.local
cp docker/nginx/.env.production.local.dist docker/nginx/.env.production.local
docker compose build
docker compose up -d
```

API runs in Node.js 22-slim container. Portfolio is served via Nginx 1.23-alpine which also proxies API requests. The whole stack runs behind an upstream Nginx reverse proxy that sets `X-Real-IP`. The Docker Nginx includes two-layer rate limiting (per-IP + global) per endpoint (auth, mail, general API) via `rate-limit.conf`. User profile data (JSON + files) is mounted read-only from `docker/users/`.

## User Profile Data

Stored in `docker/users/{UUID}/`:
- `profile.{locale}.json` — Profile data per language (en, fr)
- `files/` — Profile image (`profile.jpg`), locale-specific resume PDFs
