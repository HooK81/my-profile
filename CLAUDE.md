# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio / digital CV web application. NX monorepo with three packages:

- **`apps/api`** — NestJS 11 REST API (Node.js 24, TypeScript, SWC)
- **`apps/portfolio`** — React 19 + Vite 8 SPA (TypeScript, SCSS, Zustand)
- **`libs/shared`** — Shared API contracts (Zod schemas, TypeScript types)

NX package names: `my-profile-api`, `my-profile-portfolio`, `my-profile-shared`.

Each package has its own `CLAUDE.md` with architecture and testing details.

## Common Commands

```bash
# Development
npm run dev                  # Start API + portfolio in parallel
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
npm run test:cov:api         # API tests with coverage
npm run test:portfolio       # Portfolio tests only
npm run test:cov:portfolio   # Portfolio tests with coverage

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

## Code Style

- **ESLint 10** with `simple-import-sort` enforced (externals → internals → relative)
- **Prettier**: 80 char line width, 2-space indent, single quotes, trailing commas
- **TypeScript**: Strict mode, no implicit `any`

## Docker Deployment (Production Only)

```bash
cp .env.dist .env
cp docker/api/.env.production.local.dist docker/api/.env.production.local
cp docker/api/.secrets.production.local.dist docker/api/.secrets.production.local
cp docker/nginx/.env.production.local.dist docker/nginx/.env.production.local
docker compose build
docker compose up -d
```

Docker is not used for local development — run `npm run dev` or `npm run dev:api` / `npm run dev:portfolio` instead.

API runs in Node.js 24-alpine container. Portfolio is served via Nginx stable-alpine which also proxies API requests. The whole stack runs behind an upstream Nginx reverse proxy that sets `X-Real-IP`. The Docker Nginx includes two-layer rate limiting (per-IP + global) per endpoint (auth, mail, general API) via `rate-limit.conf`. User profile data (JSON + files) is mounted read-only from `docker/users/`.

## User Profile Data

Stored in `docker/users/{UUID}/`:
- `profile.{locale}.json` — Profile data per language (en, fr)
- `files/` — Profile image (`profile.jpg`), locale-specific resume PDFs
