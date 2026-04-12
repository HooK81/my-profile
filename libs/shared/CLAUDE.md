# Shared Library — CLAUDE.md

Zod schemas and Fishery fixtures shared between API and portfolio. NX package name: `my-profile-shared`. Dual CJS + ESM output.

## Quick Reference

- Output built via Vite library mode (`vite-plugin-dts` for type declarations)
- Consumed via npm workspace resolution (`"my-profile-shared": "*"`)
- Must be built (`npm run build:shared` from root, or `npm run build` locally) before API build
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
- `vite-plugin-dts` generates `.d.ts` alongside `.mjs` / `.cjs` outputs
- Zod 4 (package `zod@^4.3.6`)
- External deps (zod, @faker-js/faker, fishery) are not bundled
