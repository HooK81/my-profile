# Portfolio design « Glass & glow » (light / dark)

Design brief for the `apps/portfolio` redesign shipped in September 2026, rewritten to match the implementation. The original handoff (HTML prototype, assets, copy of the profile payload) lived in `design_handoff_portfolio_redesign/` and is preserved in git history at commit `c19b775`. Where this document and the code disagree, the code wins; keep both in sync when the design moves.

## Overview

Same sections, same data, same behaviours as before; new look: translucent glass cards, coral→gold primary gradient, soft coloured glows, light/dark theme switch, floating pill navbar. Stack unchanged: React 19 + Vite, SCSS modules, react-i18next (EN/FR), tsparticles, typed.js, react-markdown.

Hard rules kept from the brief:

- **No new profile data.** Every section renders the fields it rendered before. The `01…05` section numbers are decorative.
- **FR/EN i18n.** New UI strings were added to both locale files (`navbar.toggleTheme`, `about.downloadVcard`, and the previously missing French `hobbies.desc`).
- **Behaviours kept**: resume PDF download, vCard download, contact form (`api.sendMail`), scroll-spy active nav link, `/about-this-site` route.

## Theming

Colours are CSS custom properties switched by `data-theme` on `<html>`, declared in `src/styles/global.scss`. Bare `:root` carries the dark set so nothing flashes before the store applies the stored choice.

| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg` | `#0a0d13` | `#f2f4f9` | Base section background (Hero, Facts, Techs, Contact) |
| `--bg-elevated` | `#0f131b` | `#ffffff` | Alternating section background (About, Resume, Hobbies, footer), form inputs, tech logo wells |
| `--surface` | `rgba(255,255,255,.045)` | `rgba(255,255,255,.7)` | Glass card fill |
| `--surface-strong` | `rgba(255,255,255,.08)` | `rgba(255,255,255,.95)` | Chips, hover fills, skill track |
| `--border` | `rgba(255,255,255,.09)` | `rgba(15,23,42,.08)` | Every 1px border |
| `--text` | `#e8ecf4` | `#0f172a` | Body text |
| `--muted` | `#98a3b8` | `#56627a` | Secondary text, labels |
| `--primary` | `#fb8a70` | `#c2410c` | Highlight used alone: links, active nav, dates, chips, status text |
| `--primary-soft` | `#f5d06a` | `#d99a1a` | Gradient end; small accents (error-cloud tears) |
| `--primary-glow` / `--primary-soft-glow` | `.35` / `.30` alpha of the two above | `.20` / `.18` | Blurred halos, lift shadows |
| `--nav` | `rgba(10,13,19,.55)` | `rgba(242,244,249,.6)` | Navbar pill and mobile panel |
| `--shadow` | `0 20px 60px rgba(0,0,0,.45)` | `0 20px 60px rgba(15,23,42,.12)` | Prominent cards |
| `--on-primary` | `#071018` | `#ffffff` | Text on the primary gradient |
| `--particle` | `255,255,255` | `15,23,42` | Kept for reference; tsparticles reads the hex directly |

Theme logic:

- `stores/app.store` holds `theme` and `toggleTheme`. Initial value: `localStorage['portfolio-theme']`, else `prefers-color-scheme`, else dark. Toggling persists.
- `hooks/useTheme` returns `{ theme, toggleTheme }` for components; `hooks/useThemeSync` mirrors the theme to `<html data-theme>` once from `App`, so loader and error screens are themed too.
- `ThemeToggle` (sun in dark, moon in light) has `aria-pressed` and is placed in the navbar pill on desktop and in the mobile panel footer on small screens.
- `html` and `body` transition `background-color` and `color` over `.4s`.
- tsparticles colour follows the theme (`#ffffff` dark, `#0f172a` light) via the `paint.color` option (tsparticles v4 API); the canvas remounts on theme change.

Recipes (mixins in `src/styles/_mixins.scss`):

- **Glass card** `glass($blur)`: `background: var(--surface); border: 1px solid var(--border); backdrop-filter: blur(14–18px)`, radius 18–24px, `box-shadow: var(--shadow)` only on prominent cards.
- **Primary gradient** `primary-gradient`: `linear-gradient(135deg, var(--primary), var(--primary-soft))`, text `var(--on-primary)`, `box-shadow: 0 10px 30px var(--primary-glow)`; buttons lift `-2px` on hover.
- **Icon chip** `icon-chip($size, $radius, $surface)`: 36–48px square, radius 10–14px, `color: var(--primary)`, `--surface` or `--surface-strong` fill, 1px border.
- **Hover lift** `hover-lift`: `translateY(-4px)`, `border-color: var(--primary)`, `box-shadow: 0 20px 50px var(--primary-glow)`, `.3s`. Used by Techs, Education tiles and Hobbies.
- **Glow blob** `glow-blob($size, $color)`: absolute circle, `radial-gradient(circle closest-side, $color, transparent)` — never `filter: blur`, an animated blur on a viewport-sized element freezes Safari — `pointer-events: none`, `z-index: -1` inside a Section (sections are `isolation: isolate`).
- **Section header** (in `Section`): row `align-items: baseline; gap: 16px` → decorative index (Sora 13px/600, `letter-spacing: .18em`, uppercase, `--primary`) + `h2` Sora `clamp(32px, 4.5vw, 52px)` 700, `letter-spacing: -.03em`, `line-height: 1.05`; 56px below, or 16px when a description follows (description `--muted` 17px, max 640px, 48px below).
- Section padding `110px 24px`, container `max-width: 1120px`. `Section` has two variants: `primary` (`--bg`) and `secondary` (`--bg-elevated`). Scroll margin is tuned so a nav click lands the title ~12px under the pill.

## Typography

- Display: **Sora** 600/700/800 — h1–h4, numbers, logo.
- Body: **Instrument Sans** 400/500/600 — everything else, 16px, `line-height: 1.6`.
- Both from Google Fonts in `index.html`.

## Components

**Button** (`ui/Button`): required `variant`, `primary` = gradient pill, `secondary` = glass pill (`--surface`, `--border`, hover `--surface-strong` + `--primary` text). `padding: 14px 24px`, 15px/600, radius 999px. `isLoading` keeps the size, fades the content, shows a spinning `LuLoaderCircle`, sets `aria-busy` and swallows clicks without the dimmed `disabled` look; `disabled` remains a separate state.

**Logo** (`ui/Logo`): 34px square, radius 10px, primary gradient, initials Sora 14px/700, `0 0 18px var(--primary-glow)`. The favicon is generated at runtime from the same initials (`utils/favicon`, inline SVG data URL); `public/favicon.svg` is the letterless fallback.

**LocaleSwitcher** (`ui/LocaleSwitcher`): `layout="dropdown"` is a 36px pill (flag + code + caret) in the desktop navbar; `layout="inline"` is a row of chips in the mobile panel. `onChange` lets the navbar close the panel after a pick.

**SocialLinks** (`ui/SocialLinks`): squares with radius 12px, `--surface-strong` fill; hover `--primary` text + `0 0 16px var(--primary-glow)`. Sizes `sm` 36px (footer, `--muted`), `md` 40px (About), `lg` 48px.

**ScrollDown**: uppercase 11px `letter-spacing: .2em` `--muted`, chevron bouncing 8px / 1.6s, hover `--primary`.

## Sections

### Navbar
Fixed, `padding: 14px 24px`, z-index 50. Pill: `max-width: 1160px`, radius 999px, `padding: 10px 12px 10px 16px`, `--nav` fill, 1px border, blur 18px + saturate 1.4 (on a `::before` layer so the mobile panel can blur the page itself), `0 8px 30px rgba(0,0,0,.12)`. Links 14px/500, `padding: 8px 14px`, pill radius; hover/active `--surface-strong` + `--primary`. Right: locale dropdown, theme toggle, hamburger (≤ `$breakpoint-lg`).
Mobile (≤ 900px): links and desktop controls hidden; hamburger opens a glass panel below the pill (radius 20px, padding 10px) with stacked links (`padding: 12px 16px`, radius 12px) and a footer row holding the inline locale switcher (left) and the theme toggle (right). The panel closes on link click, on locale pick and on any click outside the pill.

### Hero
`min-height: 100vh`, centred, `overflow: hidden`. Two drifting glow blobs (55vw max 720px `--primary-glow` top-left, 45vw max 600px `--primary-soft-glow` bottom-right; `drift` 18s / 22s reverse). tsparticles: 80 dots (hard limit 160), size 1–6, links 150px at .4 opacity, repulse 200, push 4 — `detectsOn: 'canvas'`, so only pointer events on the hero itself count, not navbar clicks, **`move.speed: 2`** (the brief said 6; lowered on review), `fpsLimit: 60`. Content `max-width: 960px`, `padding: 120px 24px 100px`: `I'm a <typed>` (`clamp(15px,1.6vw,19px)` 500 `--muted`, typed span `--primary` 600, own 2px caret blinking 1s, typed.js cursor disabled), `h1` Sora 800 `clamp(48px,8.5vw,112px)` with `--text → --muted` vertical text gradient (≤ 768px `clamp(44px,12vw,72px)`), markdown description in a glass pill (`padding: 18px 28px`, radius 20px, `--muted`, `<strong>` → `--text` 600). Entrance `fadeUp` .8s / .9s +.15s / 1s +.3s.

### About (`--bg-elevated`)
Grid `340px minmax(0,1fr)`, gap 56px, one column ≤ 768px. Left: glass card radius 28px, padding 10px, `--shadow`, blurred radial glow behind; photo `aspect-ratio: 4/5`, radius 20px; `SocialLinks` md below. Right: bio `clamp(17px,1.6vw,20px)` `line-height: 1.75`; detail tiles `repeat(auto-fit, minmax(220px,1fr))` gap 12px (label 12px uppercase `.12em` `--muted`, value 600; email and phone are links, **the name is plain text**). Actions row: `Button primary` "Download Resume" (`LuDownload`) and `Button secondary` "Save contact" (`LuContact`) that downloads the vCard.

### Facts (`--bg`, `padding: 90px 24px`)
**No background image** (dropped on review). Grid `repeat(auto-fit, minmax(220px,1fr))` gap 16px. Card: glass blur 18px, `padding: 32px 24px`, radius 24px, centred, `--shadow`, hover `translateY(-4px)` only. Icon chip 48px (`--surface-strong`, `0 0 20px var(--primary-glow)`), number Sora 700 `clamp(34px,3.6vw,44px)` tabular, label 13px uppercase `.14em` `--muted`. Count-up 1.8s ease-out cubic, `toLocaleString(locale)`, trailing `+`.

### Resume (`--bg-elevated`)
`--primary-soft-glow` blob 600px on the right. Column titles `h3` Sora 22px/600 with a 36px chip; 32px below; blocks 80px apart.
- **Experience timeline**: `padding-left: 36px`, 2px rail `linear-gradient(180deg, var(--primary), var(--border))`. Item: 20px dot at `left: -36px; top: 22px`, 2px `--primary` border, ring `0 0 0 4px var(--bg-elevated)`; card glass `padding: 24px 28px`, radius 20px. **Active** while the item's top is above 55 % of the viewport and its bottom below 15 % (`useInView` with `rootMargin: '-15% 0px -45% 0px'`, inactive by default): dot fills `--primary` + `0 0 18px var(--primary-glow)`, card border `--primary` + `0 16px 50px var(--primary-glow)`; `.4s`. Header: `h4` Sora 18px/600 + date 13px/600 `--primary` tabular (`Feb 2025 – Present (1 year 7 months)`); meta 14px `--muted` with company `--text` 600 `· city`; markdown 15px `--muted` `line-height: 1.7`.
- **Education**: `repeat(auto-fill, minmax(250px,1fr))` gap 14px; glass tile `padding: 20px 22px`, radius 18px, hover-lift; date 12px/600 `.1em` `--primary`, degree 600 `line-height: 1.35`, school · city 13px `--muted`.
- **Skills**: subtitle `--muted` indented 48px; `repeat(auto-fill, minmax(280px,1fr))` gap `14px 32px`; name 15px/600, `level%` 13px/600 `--primary` (hidden when `showLevel: false`); track 6px pill `--surface-strong` + border; fill `linear-gradient(90deg, var(--primary), var(--primary-soft))` + `0 0 12px var(--primary-glow)`, width 0 → level once in view, `1.2s cubic-bezier(.2,.8,.2,1)`.

### Techs (`--bg`)
Header with description. Grid `repeat(auto-fill, minmax(250px,1fr))` gap 16px. Card glass `padding: 26px`, radius 22px, hover-lift. Logo well 56px, radius 16px, `--bg-elevated` + border, image 32px; `h4` Sora 17px/600; description 14px `--muted` `line-height: 1.65`.

### Hobbies (`--bg-elevated`)
Header with description. Grid `repeat(auto-fill, minmax(200px,1fr))`, rows 220px, gap 14px; first and last tiles `grid-column: span 2` (reset ≤ 460px). Tile radius 22px, `overflow: hidden`, border; image cover with `scale(1.06)` on hover (`.6s cubic-bezier(.2,.8,.2,1)`); overlay `linear-gradient(180deg, transparent 40%, rgba(0,0,0,.75))`; caption bottom-left: `Icon` 18px + Sora 17px/600 white; tile hover-lift.

### Contact (`--bg`, `padding: 110px 24px 90px`)
`--primary-glow` blob 700px bottom-left. Grid `minmax(0,1fr) minmax(0,1.4fr)` gap 24px, one column ≤ 768px. Info column: three glass rows `padding: 20px 22px`, radius 18px, 42px chip (`LuMapPin`, `LuSmartphone`, `LuMail`), `h4` 12px uppercase `.12em` `--muted` 600, value 500.
Form: glass card `padding: 24px`, radius 24px, `--shadow`, gap 12px. Inputs 50px tall, `padding: 0 18px`, radius 14px, `--bg-elevated` fill, border, `--text`, 15px; textarea `rows=6`, `padding: 14px 18px`; focus `border-color: var(--primary)` + `0 0 0 3px var(--primary-glow)`. Footer row: left slot shows the character counter while typing, or the **inline status** (`role="status"`, 14px `--primary` 500) for sending / success / error — **there is no toast**; right: `Button primary` "Send Message" with `LuSend`, `isLoading` while the request is pending. Typing again clears the status.

### Footer (`--bg-elevated`)
`padding: 32px 24px`, top border; flex space-between wrap; `SocialLinks` sm (`--muted`, hover `--primary`); copyright 13px `--muted`.

### Loader / error screens
`AppLoader` dots use the primary gradient with a glow. `AppError` shows the crying cloud in `--primary` with `--primary-soft` tears and a `--primary-glow` drop shadow, and a `Button primary` retry.

## Motion

- `fadeUp` hero entrance (.8–1s, staggered .15s); `drift` glow blobs 18s/22s; caret `blink` 1s step-end; scroll chevron `bounceDown` 1.6s.
- Hover lifts (Techs, Education, Hobbies): `translateY(-4px)` + primary border + `0 20px 50px var(--primary-glow)` `.3s`; Facts lifts only; buttons `-2px` `.2s`; theme toggle rotates 20°.
- Theme change `.4s`; count-up 1.8s; skill bars 1.2s; timeline active state `.4s`; button loader spins .8s.
- `prefers-reduced-motion: reduce` collapses every animation and transition and disables smooth scrolling.

## Responsive

Existing SCSS breakpoints only: `$breakpoint-sm` 460px (hobby span reset), `$breakpoint-md` 768px (About and Contact one column, smaller hero name), `$breakpoint-lg` 900px (burger menu, desktop controls hidden). Every other grid is `auto-fit` / `auto-fill`.

## Deviations from the original brief

| Brief | Implemented | Why |
|---|---|---|
| Tokens `--accent`, `--accent2`, `--glow1/2`, `--onaccent`, `--bg2`, `--surface2` | `--primary`, `--primary-soft`, `--primary-glow`, `--primary-soft-glow`, `--on-primary`, `--bg-elevated`, `--surface-strong` | Role-based names instead of numbered suffixes |
| Particle `move.speed: 6` | `2` | Felt too fast in review |
| Facts background image with vertical fade | Removed | Not visible enough to justify a 378 kB asset |
| vCard download on the name in About | Plain name + secondary "Save contact" CTA | Discoverability; the name looked like a link to nowhere |
| Success/error toasts on the contact form | Inline `role="status"` text in the form footer | Matches the prototype's footer row |
| Submit button disabled while sending | `isLoading` state (spinner, `aria-busy`, clicks swallowed) | A pending CTA should not read as disabled |
| Theme toggle in the pill on mobile | In the mobile panel footer, right of the locale switcher | Keeps the mobile pill to logo + burger |
| Static `JC` favicon | Generated from the profile initials at runtime | Same source as the navbar logo |
| `Section` variants `primary` / `secondary` / `darkest` | `primary` / `secondary` | `darkest` only served the removed Facts background |
