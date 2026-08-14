# API — CLAUDE.md

NestJS 11 REST API. NX package name: `my-profile-api`. CommonJS modules, Node.js 24, TypeScript, SWC compiler.

## Architecture

NestJS modular architecture with domain modules:

- **`auth/`** — JWT authentication with device-fingerprint verification (passport-jwt). `GET /v1/auth/token` sets an HTTP-only cookie (`access_token`) containing the JWT. The JWT strategy extracts the token from the cookie (not the Authorization header). Cookie flags: `httpOnly`, `secure` (prod only), `sameSite: lax`, `path: /`. Token expiry: 24h (dev) / 5m (prod). Device fingerprint is `HMAC-SHA256(server-secret, userAgent + acceptLanguage + acceptEncoding)` — computed server-side only, opaque to the client.
- **`profiles/`** — Profile data, file serving (images/PDFs), vCard generation. Routes: `GET /v1/:locale/profiles/:id`.
- **`mail/`** — Contact email sending via Nodemailer with Pug templates. `nest-cli.json` copies `mail/templates/` to dist.
- **`locale/`** — Locale detection interceptor (REQUEST-scoped), extracts locale from route params, falls back to EN.
- **`config/`** — Environment validation with Zod schemas (`env.validation.ts`).
- **`response/`** — Response interceptor (adds `X-App-Version` header in non-prod) and headers service.
- **`init/`** — CORS + Helmet setup and Pino logging bootstrap (header redaction in prod).
- **`health/`** — Terminus health check endpoint (`GET /health`).

API uses URI versioning (`/v1/`). All profile endpoints require JWT auth. Profile data is cached for 2 hours.

## Directory Structure

```
src/
  app.module.ts              # Root module, global interceptors
  main.ts                    # Bootstrap (CORS, cookie-parser, Pino)
  auth/                      # JWT auth (controller, service, strategy, guard)
  config/                    # Env validation (Zod)
  constants/                 # Shared constants (time.ts)
  health/                    # Health check (Terminus)
  init/                      # Bootstrap helpers (CORS, Pino)
  locale/                    # Locale detection interceptor
  mail/                      # Email sending (Nodemailer + Pug templates/)
  profiles/                  # Profile data, files, vCard
    entities/                # class-validator entity classes
  response/                  # Response interceptor + headers service
test_utils/
  access-token.ts            # initTestApp() + getAuthToken() helpers
  stream-to-string.ts        # StreamableFile → buffer utility
```

## Testing

- **Framework**: Vitest + supertest
- **Config**: `vitest.config.ts` — SWC plugin, globals enabled, path aliases (`src`, `test_utils`, `my-profile-shared`)
- **Colocated tests**: `*.spec.ts` next to source files
- **Controller tests**: integration-style — boot full `AppModule`, call `initTestApp(app)` for cookie-parser, use `supertest` for HTTP assertions
- **Service tests**: unit-style — `Test.createTestingModule` with mocked dependencies via `useValue`
- **Test utilities**: `test_utils/access-token.ts` provides `initTestApp()` (adds cookie-parser) and `getAuthToken()` (fetches JWT cookie via `/auth/token`)
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

Required variables: `NODE_ENV`, `APP_ENV`, `PORT`, `JWT_SECRET`, `DEVICE_FINGERPRINT_SECRET`, `USERS_FOLDER`, `MAILER_TRANSPORT`, `MAILER_SENDER`, `MAILER_TEAM_ADDRESS`
