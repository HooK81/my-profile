## 6.1.2 (2026-09-06)

### 🩹 Fixes

- **portfolio:** replace blurred glow blobs with gradients to unfreeze safari ([42d76f7](https://github.com/HooK81/my-profile/commit/42d76f7))
- **portfolio:** stop navbar clicks from pushing hero particles ([8debe70](https://github.com/HooK81/my-profile/commit/8debe70))
- **portfolio:** center the about action buttons on mobile ([7c52966](https://github.com/HooK81/my-profile/commit/7c52966))

### ❤️ Thank You

- Claude Fable 5.1
- Julien Crochet

## 6.1.1 (2026-09-06)

### 🩹 Fixes

- **portfolio:** restore backdrop blur in production build ([6986abf](https://github.com/HooK81/my-profile/commit/6986abf))
- **portfolio:** disable zod jit to stop csp eval violation ([f3c8a7b](https://github.com/HooK81/my-profile/commit/f3c8a7b))

### ❤️ Thank You

- Claude Fable 5.1
- Julien Crochet

## 6.1.0 (2026-09-06)

### 🚀 Features

- **portfolio:** highlight contact message counter below min length ([0f37203](https://github.com/HooK81/my-profile/commit/0f37203))

### 🩹 Fixes

- **docker:** build portfolio with node 24 ([196786c](https://github.com/HooK81/my-profile/commit/196786c))

### ❤️ Thank You

- Claude Fable 5.1
- Julien Crochet

# 6.0.0 (2026-09-06)

### 🚀 Features

- harmonize commands around nx run-many targets ([abc77f7](https://github.com/HooK81/my-profile/commit/abc77f7))
- upgrade zod to 4.5 ([8a65a60](https://github.com/HooK81/my-profile/commit/8a65a60))
- migrate to esm module ([6a3f790](https://github.com/HooK81/my-profile/commit/6a3f790))
- auto generated logo ([4a30acf](https://github.com/HooK81/my-profile/commit/4a30acf))
- **api:** upgrade nestjs to 12 ([6b6b890](https://github.com/HooK81/my-profile/commit/6b6b890))
- **portfolio:** extract useSendMail with toasts in mutation callbacks ([af51e9b](https://github.com/HooK81/my-profile/commit/af51e9b))
- ⚠️  **portfolio:** redesign with the glass & glow theme ([20ac108](https://github.com/HooK81/my-profile/commit/20ac108))

### 🩹 Fixes

- security fix ([550aff0](https://github.com/HooK81/my-profile/commit/550aff0))
- fix nx depedencies ([07406de](https://github.com/HooK81/my-profile/commit/07406de))

### ⚠️  Breaking Changes

- **portfolio:** redesign with the glass & glow theme  ([20ac108](https://github.com/HooK81/my-profile/commit/20ac108))

### ❤️ Thank You

- Claude Fable 5
- Claude Opus 5 (1M context)
- Julien Crochet

## 5.4.0 (2026-07-25)

### 🚀 Features

- **api:** use a single 5m JWT TTL in every environment ([537290d](https://github.com/HooK81/my-profile/commit/537290d))
- **portfolio:** replace axios with native fetch client ([2a14774](https://github.com/HooK81/my-profile/commit/2a14774))
- **portfolio:** replace profile store with tanstack query ([e52e0ff](https://github.com/HooK81/my-profile/commit/e52e0ff))
- **portfolio:** migrate useProfileFileUrl to tanstack query ([2f2c653](https://github.com/HooK81/my-profile/commit/2f2c653))
- **portfolio:** use mutation for contact form send ([eda5100](https://github.com/HooK81/my-profile/commit/eda5100))
- **portfolio:** update stack list on the about this site page ([722ca2c](https://github.com/HooK81/my-profile/commit/722ca2c))

### 🩹 Fixes

- let nx release derive the bump from every commit ([5d283a5](https://github.com/HooK81/my-profile/commit/5d283a5))

### ❤️ Thank You

- Claude Fable 5
- Julien Crochet

## 5.3.1 (2026-05-22)

### 🩹 Fixes

- issue with external network connections ([2ec6f94](https://github.com/HooK81/my-profile/commit/2ec6f94))

### ❤️ Thank You

- Julien Crochet

## 5.3.0 (2026-05-22)

### 🚀 Features

- add portfolio components tests ([30b5e71](https://github.com/HooK81/my-profile/commit/30b5e71))
- refactor contact form with useActionState and useFormStatus ([09eb7e1](https://github.com/HooK81/my-profile/commit/09eb7e1))
- add portfolio components tests ([c6c249c](https://github.com/HooK81/my-profile/commit/c6c249c))
- add social links into about ([8f00e40](https://github.com/HooK81/my-profile/commit/8f00e40))
- add facts component ([bfd6495](https://github.com/HooK81/my-profile/commit/bfd6495))
- replace font-awesome cdn by react-icons ([b1ec1bb](https://github.com/HooK81/my-profile/commit/b1ec1bb))

### 🩹 Fixes

- fix about flaky test on profile bio ([f3473ba](https://github.com/HooK81/my-profile/commit/f3473ba))
- react-doctor fixes ([105eba3](https://github.com/HooK81/my-profile/commit/105eba3))
- fix about links behavior ([4978e5b](https://github.com/HooK81/my-profile/commit/4978e5b))
- duplicate keys for workitem and educationitem ([a0b5e69](https://github.com/HooK81/my-profile/commit/a0b5e69))

### ❤️ Thank You

- Julien Crochet

## 5.2.1 (2026-04-09)

### 🩹 Fixes

- fix hsts and vite config ([4471d3a](https://github.com/HooK81/my-profile/commit/4471d3a))

### ❤️ Thank You

- Julien Crochet

## 5.2.0 (2026-04-06)

### 🚀 Features

- packages upgrade ([5636243](https://github.com/HooK81/my-profile/commit/5636243))
- api packages upgrade ([3d4865e](https://github.com/HooK81/my-profile/commit/3d4865e))
- portfolio packages upgrade ([1f0c298](https://github.com/HooK81/my-profile/commit/1f0c298))
- improve vite code split and AboutSite lazy loading ([e4b845f](https://github.com/HooK81/my-profile/commit/e4b845f))
- portfolio package upgrade ([ced8a07](https://github.com/HooK81/my-profile/commit/ced8a07))

### ❤️ Thank You

- Julien Crochet

## 5.1.0 (2026-04-04)

### 🚀 Features

- add logo on navbar ([de7fa35](https://github.com/HooK81/my-profile/commit/de7fa35))
- hide scroll down on small height screen ([0da84d7](https://github.com/HooK81/my-profile/commit/0da84d7))
- setup tests for portfolio app ([a008968](https://github.com/HooK81/my-profile/commit/a008968))
- portfolio - add tests for api, hooks, stores, utils ([8a35edc](https://github.com/HooK81/my-profile/commit/8a35edc))
- security: change json token to http-only cookie ([a4c2b20](https://github.com/HooK81/my-profile/commit/a4c2b20))
- fix security findings ([4e8ddd7](https://github.com/HooK81/my-profile/commit/4e8ddd7))
- replace device hash with hmac ([f2c1e5d](https://github.com/HooK81/my-profile/commit/f2c1e5d))
- set message max length ([c698f90](https://github.com/HooK81/my-profile/commit/c698f90))

### ❤️ Thank You

- Julien Crochet

# 5.0.0 (2026-03-06)

### 🚀 Features

- ⚠️  redesign api with NestJS and NX ([31ba1f0](https://github.com/HooK81/my-profile/commit/31ba1f0))
- ⚠️  redesign front with React 19.2 ([8a6c2d4](https://github.com/HooK81/my-profile/commit/8a6c2d4))

### ⚠️  Breaking Changes

- redesign front with React 19.2  ([8a6c2d4](https://github.com/HooK81/my-profile/commit/8a6c2d4))
- redesign api with NestJS and NX  ([31ba1f0](https://github.com/HooK81/my-profile/commit/31ba1f0))

### ❤️ Thank You

- Julien Crochet