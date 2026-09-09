# API — CLAUDE.md

NestJS 12 REST API. NX package name: `my-profile-api`. Native ESM (`"type": "module"`, relative imports use `.js` extensions), Node.js 24, TypeScript compiled with `tsc` via the Nest CLI.

## Architecture

NestJS modular architecture with domain modules:

- **`auth/`** — JWT authentication with device-fingerprint verification (passport-jwt). `POST /api/v1/auth/token` sets an HTTP-only cookie (`access_token`) containing the JWT (POST, not GET: issuing a token is a mutation, so the Origin check applies). The JWT strategy extracts the token from the cookie (not the Authorization header). Cookie flags (`auth/cookies.ts`): `httpOnly`, `secure` from `COOKIE_SECURE`, `sameSite: strict`, `path: /api`. Token expiry: 5m everywhere. Device fingerprint is `HMAC-SHA256(server-secret, userAgent + acceptLanguage + acceptEncoding)` — computed server-side only, opaque to the client. `origin.guard.ts` is the CSRF guard, registered as a global `APP_GUARD` in `app.module.ts`: every non-safe method (anything but GET/HEAD/OPTIONS) must carry `Origin === new URL(PUBLIC_APP_URL).origin`, else 403. It runs before the controllers' `JwtAuthGuard`.
- **`profiles/`** — Profile data, file serving (images/PDFs), vCard generation. Routes: `GET /v1/:locale/profiles/:id`.
- **`mail/`** — Contact email sending via Nodemailer with Pug templates. `nest-cli.json` copies `mail/templates/` to dist. Request body validated against the shared Zod contract via `@Body({ schema: emailValidationSchema })` and the global `StandardSchemaValidationPipe` (`APP_PIPE` in `app.module.ts`).
- **`locale/`** — Locale detection interceptor (REQUEST-scoped), extracts locale from route params, falls back to EN.
- **`config/`** — Environment validation with Zod schemas (`env.validation.ts`). In `NODE_ENV=production` the schema refuses to start unless `PUBLIC_APP_URL` is `https:` and `COOKIE_SECURE=true`.
- **`response/`** — Response interceptor (adds `X-App-Version` header in non-prod) and headers service.
- **`init/`** — `setup-app.ts` (global `/api` prefix, URI versioning, cookie-parser, Helmet — shared by `main.ts` and the test helpers so tests hit the production URLs) and Pino logging bootstrap (header redaction in prod).
- **`health/`** — Terminus health check endpoint (`GET /api/v1/health`).

Every route lives under `/api/v1/...` (global prefix + URI versioning). The browser only ever sees one origin: nginx (prod) and the Vite proxy (dev) forward `/api` to this app, so there is no CORS configuration. All profile endpoints require JWT auth. Profile data is cached for 2 hours.

## Directory Structure

```
src/
  app.module.ts              # Root module, global guard, interceptors + validation pipe
  main.ts                    # Bootstrap (Pino, setupApp, listen)
  auth/                      # JWT auth (controller, service, strategy, guard), cookie options, OriginGuard (CSRF)
  config/                    # Env validation (Zod)
  constants/                 # Shared constants (time.ts)
  health/                    # Health check (Terminus)
  init/                      # Bootstrap helpers (setup-app, Pino)
  locale/                    # Locale detection interceptor
  mail/                      # Email sending (Nodemailer + Pug templates/)
  profiles/                  # Profile data, files, vCard
    entities/                # class-validator entity classes
  response/                  # Response interceptor + headers service
test_utils/
  access-token.ts            # initTestApp(), getAuthToken(), TEST_PUBLIC_APP_URL
  stream-to-string.ts        # StreamableFile → buffer utility
```

## Testing

- **Framework**: Vitest + supertest
- **Config**: `vitest.config.ts` — globals enabled, path aliases (`src`, `test_utils`, `my-profile-shared` → `libs/shared/src`, so tests run against shared source without a build)
- **Colocated tests**: `*.spec.ts` next to source files
- **Controller tests**: integration-style — boot full `AppModule`, call `initTestApp(app)` (runs the same `setupApp` as `main.ts`), use `supertest` for HTTP assertions against the real URLs (`/api/v1/...`). Every mutating request must `.set('Origin', TEST_PUBLIC_APP_URL)` or it gets a 403 from the OriginGuard
- **Service tests**: unit-style — `Test.createTestingModule` with mocked dependencies via `useValue`
- **Test utilities**: `test_utils/access-token.ts` provides `initTestApp()`, `getAuthToken()` (fetches the JWT cookie via `POST /api/v1/auth/token`) and `TEST_PUBLIC_APP_URL` (same value as `PUBLIC_APP_URL` in `.env.test`)
- **Fixtures**: import from `my-profile-shared/fixtures/profile.fixtures` (Fishery factories)

### Mock policy
Use mock `vi.mock`, `vi.hoisted` ONLY when it's strictly needed.

### Constraints
Prefer test behavior instead of implementation.
NEVER do assert to logs.

## Commands

```bash
npm run test              # Single run (vitest run)
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run serve             # Dev server, watch mode (port 3000)

# Single test file
npm run test -- src/auth/auth.service.spec.ts
```

## Environment

Files: `.env.development`, `.env.test`

Required variables: `NODE_ENV`, `APP_ENV`, `PORT`, `PUBLIC_APP_URL` (origin the SPA is served from; `https:` mandatory in production), `COOKIE_SECURE` (`true` mandatory in production), `JWT_SECRET`, `DEVICE_FINGERPRINT_SECRET`, `USERS_FOLDER`, `MAILER_TRANSPORT`, `MAILER_SENDER`, `MAILER_TEAM_ADDRESS`
