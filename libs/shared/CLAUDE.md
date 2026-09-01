# Shared Library — CLAUDE.md

Zod schemas and Fishery fixtures shared between API and portfolio. NX package name: `my-profile-shared`. ESM-only runtime output; types consumed from source.

## Quick Reference

- Consumed via npm workspace resolution (`"my-profile-shared": "*"`)
- Types resolve from `src/` directly (`exports` `types` conditions point at source): `tsc`, lint, IDE, and both vitest suites (aliased to `src/` in each app's `vitest.config.ts`) never need a build
- The Vite build (`dist/` ESM only, no `.d.ts`) is needed only at **runtime**: API serve/build and portfolio serve/build resolve the `import` condition to `dist/`, rebuilt automatically via NX `^build`
- No tests of its own — schemas are validated through API and portfolio tests

## Export Paths

```
"my-profile-shared"                            → Schemas + types
"my-profile-shared/fixtures"                   → All fixtures re-exported
"my-profile-shared/fixtures/profile.fixtures"  → ProfileFactory + sub-factories
```

## Schemas

- **`profile.schemas.ts`** — Profile, User, Resume, Work, WorkDate, Education, Skill, Tech, Hobby, Network, Address
- **`auth.schemas.ts`** — AccessToken, AuthResponse
- **`email-validation.schemas.ts`** — EmailValidation (from, message, subject) + length constants (`MESSAGE_MIN_LENGTH`, `MESSAGE_MAX_LENGTH`, `SUBJECT_MAX_LENGTH`)

All schemas export both the Zod schema object and the inferred TypeScript type (`z.infer<typeof schema>`).

## Fixtures

Built with Fishery + Faker.js. `ProfileFactory` is the top-level factory; delegates to sub-factories:

`UserFactory`, `WorkFactory`, `WorkDateFactory`, `EducationFactory`, `SkillFactory`, `ResumeFactory`, `TechFactory`, `HobbyFactory`, `NetworkFactory`

```typescript
import { ProfileFactory } from 'my-profile-shared/fixtures/profile.fixtures';

ProfileFactory.build();                          // single profile
ProfileFactory.buildList(3);                     // list of profiles
ProfileFactory.build({ user: { name: '...' } }); // with overrides
```

## Directory Structure

```
src/
  index.ts                          # Re-exports schemas
  schemas/
    profile.schemas.ts
    auth.schemas.ts
    email-validation.schemas.ts
  fixtures/
    index.ts                        # Re-exports profile.fixtures
    profile.fixtures.ts             # All Fishery factories
```

## Commands

```bash
npm run build    # tsc -noEmit && vite build
npm run tsc      # Type-check only
npm run lint     # ESLint
```

## Build Notes

- Vite library mode with three entry points (index, fixtures/index, fixtures/profile.fixtures)
- ESM output only (`.mjs`) — no CJS, no `.d.ts`: everything consuming it is ESM, and type resolution goes through `src/`
- Zod 4 (package `zod@^4.5.0`)
- External deps (zod, @faker-js/faker, fishery) are not bundled
