# My Profile

Personal profile / digital CV web application. NX monorepo with two apps:
- **API** (`apps/api`) — NestJS REST API
- **Portfolio** (`apps/portfolio`) — React + Vite SPA

## Prerequisites

- Node.js 22 (enforced via [Volta](https://volta.sh/))

## Installation

```shell
git clone git@github.com:HooK81/my-profile.git
cd my-profile
cp .env.dist .env
npm install
```

## Development

### Start API server
```shell
npm run dev:api
```

### Start portfolio dev server
```shell
npm run dev:portfolio
```

### Run all builds
```shell
npm run build
```

### Run all tests
```shell
npm run test
npm run test:cov
```

### Lint all apps
```shell
npm run lint
```

### Type-check all apps
```shell
npm run tsc
```

## NX Commands

```shell
npx nx graph                   # Visualize project dependency graph
npx nx run-many -t build       # Build all apps
npx nx run-many -t lint        # Lint all apps
npx nx run-many -t tsc         # Type-check all apps
npx nx run-many -t test        # Run tests
npx nx affected -t build       # Build only affected projects
npx nx affected -t test        # Test only affected projects
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/), enforced by [commitlint](https://commitlint.js.org/) via a Husky `commit-msg` hook.

```
type(scope): description
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`, `build`
**Scopes** (optional): `api`, `portfolio`, `shared`, `docker`

Examples:
```
feat(portfolio): add dark mode toggle
fix(api): handle missing profile image
chore: update dependencies
```

## Releasing

```shell
npm run release:dry   # Preview version bump and changelog
npm run release       # Bump versions, generate CHANGELOG.md, create git tag
```

Version bumps are determined automatically from commit history:
- `fix:` → patch (1.0.0 → 1.0.1)
- `feat:` → minor (1.0.0 → 1.1.0)
- Breaking change → major (1.0.0 → 2.0.0)



## Security

### Authentication

API endpoints are protected by JWT tokens with device-hash binding:

1. Client computes `SHA-256(User-Agent)` and sends it as `x-device-hash` header
2. Server validates the hash, issues a short-lived JWT (5 min) embedding the device hash
3. Every authenticated request re-validates `x-device-hash` against the User-Agent

The device hash is not a secret — it binds tokens to a specific browser to prevent token theft across devices.

### Rate Limiting

Nginx enforces two layers of rate limiting on all API endpoints:

| Endpoint | Per-IP limit | Per-IP burst | Global limit | Global burst |
|----------|-------------|-------------|-------------|-------------|
| General API (`/api/`) | 10 req/s (1 every 100ms) | 20 | 50 req/s (1 every 20ms) | 100 |
| Auth (`/api/v1/auth/`) | 2 req/s (1 every 500ms) | 5 | 10 req/s (1 every 100ms) | 20 |
| Mail (`/api/v1/mails`) | 1 req/min (1 every 60s) | 0 | 5 req/min (1 every 12s) | 5 |

- **Per-IP**: keyed on the real client IP (via `X-Real-IP` from the upstream reverse proxy)
- **Global**: shared across all IPs, protects against distributed attacks

Configuration: `docker/nginx/rate-limit.conf`

### Other protections

- **CORS**: origin restricted to production domain (regex pattern)
- **Helmet.js**: security headers (frameguard, CORP)
- **JWT expiry**: 5 minutes in production

## Deployment

### Configuration

```shell
cp .env.dist .env
cp docker/api/.env.production.local.dist docker/api/.env.production.local
cp docker/api/.secrets.production.local.dist docker/api/.secrets.production.local
cp docker/nginx/.env.production.local.dist docker/nginx/.env.production.local
```

### Build & Start

```shell
docker compose build
docker compose up -d
```
