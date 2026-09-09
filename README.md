# My Profile

Personal profile / digital CV web application. NX monorepo with two apps:
- **API** (`apps/api`) — NestJS REST API
- **Portfolio** (`apps/portfolio`) — React + Vite SPA

## Prerequisites

- Node.js 24 (enforced via [Volta](https://volta.sh/))

## Installation

```shell
git clone git@github.com:HooK81/my-profile.git
cd my-profile
cp .env.dist .env
npm install
npm run build
```

## Development

### Start API + portfolio in parallel
```shell
npm run serve
```

### Start a single app
```shell
npx nx serve my-profile-api        # API (port 3000)
npx nx serve my-profile-portfolio  # Portfolio (Vite, port 5173)
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

All projects expose the same targets: `serve`, `build`, `test`, `test:cov`, `lint`, `tsc`.

```shell
npx nx graph                   # Visualize project dependency graph
npx nx run-many -t serve       # Start all dev servers
npx nx run-many -t build       # Build all apps
npx nx run-many -t lint        # Lint all apps
npx nx run-many -t tsc         # Type-check all apps
npx nx run-many -t test        # Run tests
npx nx run-many -t test:cov    # Run tests with coverage
npx nx test my-profile-api     # Run one target for one project
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

API endpoints are protected by JWT tokens with server-side device fingerprinting:

1. Client requests a token from `POST /api/v1/auth/token` (no client-side hash needed)
2. Server computes an HMAC-SHA256 fingerprint from multiple request headers (User-Agent, Accept-Language, Accept-Encoding) using a server secret, and embeds it in the JWT
3. Every authenticated request recomputes the fingerprint and verifies it against the JWT payload

The fingerprint algorithm is opaque to the client — it binds tokens to a specific browser to prevent token theft across devices.

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

### CSRF

The browser only ever sees one origin: the API is served under `/api` of the SPA's origin (Nginx in production, the Vite proxy in development), so there is no CORS and no cross-site cookie.

- **`SameSite=Strict`** cookie, `HttpOnly`, scoped to `Path=/api`, `Secure` when `COOKIE_SECURE=true`
- **Origin check**: every mutating request (anything but GET/HEAD/OPTIONS, `POST /api/v1/auth/token` included) must carry an `Origin` header equal to the origin of `PUBLIC_APP_URL`, otherwise `403`
- **Boot guards**: in `NODE_ENV=production` the API refuses to start unless `PUBLIC_APP_URL` is `https:` and `COOKIE_SECURE=true` (a `Secure` cookie is never sent back over http)

### Other protections

- **Helmet.js**: security headers (frameguard, CORP)
- **JWT expiry**: 5 minutes

## Deployment

### Configuration

```shell
cp .env.dist .env
cp docker/api/.env.production.local.dist docker/api/.env.production.local
cp docker/api/.secrets.production.local.dist docker/api/.secrets.production.local
cp docker/nginx/.env.production.local.dist docker/nginx/.env.production.local
```

In `docker/api/.env.production.local`, set `PUBLIC_APP_URL` to the exact origin the site is served from (scheme + host, no path, e.g. `https://www.domain.tld`) and keep `COOKIE_SECURE=true`: the API refuses to start otherwise. The upstream reverse proxy must forward the `Origin` header untouched and must not rewrite `/api/`.

### Build & Start

```shell
docker compose build
docker compose up -d
```
