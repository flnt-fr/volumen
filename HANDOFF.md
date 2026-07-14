# Volumen — handoff notes

Astro + Preact app for building a strength training program aligned with the
2026 ACSM recommendations. Fully client-side (no backend), state persisted in
`localStorage`. This file summarizes the current state so a new session can
pick up directly, ideally with the `playwright` MCP server available for
direct browser interaction.

## Current architecture

- **Framework**: Astro 7 + **Preact** (via `@astrojs/preact`). The only
  hydrated island for the program builder is `<ProgramBuilder client:load />`,
  mounted on **`/app`**. Other pages hydrate small islands too (see below).
- **Styling**: **Tailwind CSS v4 + daisyUI**. Two custom daisyUI themes in
  `src/styles/theme.css`: `volumenlight` / `volumendark`, carrying the
  green identity (`primary #1d6b4a` light / `#3ecf8e` dark). Both themes
  define the full base palette (`base-100/200/300/content`).
- **Routes**:
  - `/` — static marketing homepage (hero, "how it works" 4-step explainer,
    CTA to `/app` and `/about`). No hydrated app logic, just the shared
    nav/footer islands.
  - `/app` — the program-builder app (`src/pages/app.astro`), rendering
    `<ProgramBuilder client:load />`, which owns its own `AppHeader`/
    `AppFooter` (Preact, Context-based i18n) inside the hydrated tree.
  - `/about`, `/legal`, `/404` — static pages, daisyUI-styled, using shared
    `src/components/site/NavBar.astro` + `SiteFooter.astro`.
  - **Every route has a footer**, including `/404` — `/app` via
    `AppFooter.tsx`, the other four via `SiteFooter.astro`.
- **Static-page header**: `src/components/site/NavBar.astro` renders the nav
  chrome as plain static markup (translated in place via `data-i18n-key`,
  like the rest of the page), except for the locale `<select>`, which is a
  genuinely interactive leaf hydrated as its own island:
  `src/components/site/LocaleSelect.tsx` (`client:load`). `/app` can't reuse
  `NavBar.astro` directly (it's already inside a hydrated Preact tree with
  its own Context-based i18n), so `AppHeader.tsx` mirrors its markup/classes
  instead — the two are kept in sync by hand, per the doc comments in both
  files.
- **FOUC fix**: `src/components/site/LocaleFOUCScript.astro` renders a
  blocking, non-module inline `<script>` at the end of `<body>` on every
  static page, which resolves and applies the locale synchronously before
  hydration (avoiding a flash of English before the post-hydration French
  correction lands). It duplicates a minimal version of
  `localeStore.ts`'s resolution logic by hand (kept in sync manually,
  documented in the file). `astro check` flags `Could not find name
  'locales'` in this file as a hint — false positive: `locales` is bound via
  the script's `define:vars`, which the type checker doesn't model.
- **i18n core** (`src/i18n/`):
  - `t.ts` / `strings.en.ts` / `strings.fr.ts` — the hand-rolled `t(locale,
    key, params)` lookup system (no i18n library), with an English fallback
    for anything untranslated.
  - `context.tsx` — `LocaleProvider`/`useTranslation()`, used inside the
    `/app` hydrated tree.
  - `localeStore.ts` — single source of truth for locale resolution, shared
    by `context.tsx` and the static-page mechanism (`applyStaticLocale.ts` +
    `LocaleSelect.tsx`): `getStoredLocale()`, `setStoredLocale()`,
    `detectBrowserLocale()`, `resolveInitialLocale()` = stored choice →
    browser language → `DEFAULT_LOCALE`. Only persists on an *explicit* user
    choice, not on the initial browser-language auto-resolve (regression
    covered by `context.test.tsx` and `localeStore.test.ts`).
  - `applyStaticLocale.ts` — walks `[data-i18n-key]` elements on a static
    page and swaps their `innerHTML` (not `textContent`, to preserve inline
    links) via `t()`; called from `LocaleSelect.tsx` on mount and on every
    manual locale switch.
- **A11y**: RGAA/WCAG AA audit done — `@axe-core/playwright` +
  `tests/e2e/a11y.spec.ts` scans all 5 routes × light/dark. Critical/serious
  violations fail the test; minor/moderate ones are attached to the report
  but non-blocking (documented rationale in the spec file).
- **Muscle-group volume radar chart**: `MuscleGroupVolumeTable.tsx` renders a
  Chart.js (`chart.js/auto`) radar chart of sets-per-muscle, shown only when
  `goal.id === 'hypertrophy'` (other goals just get the table). Colors are
  read from the active daisyUI theme's CSS custom properties at render time
  so it follows light/dark automatically. The chart's max size is capped at
  `max-w-xl` (576px, roughly half its original unconstrained width) via a
  wrapper `<div>`, with a `ResizeObserver` (resize deferred through
  `requestAnimationFrame`) keeping the canvas correctly sized across browser
  window resizes without re-triggering itself. The detailed table sits below
  the chart, collapsed by default inside a `<details>` (`collapse-arrow
  collapse`), same pattern as the per-session muscle tables.
- **Scrollable-table keyboard accessibility**: the four tables in the app
  that can overflow horizontally and scroll via a shared `theme.css` rule
  (`display: block; overflow-x: auto; contain: paint;`, keyed off each
  table's `data-testid`) — `muscle-group-volume-table`,
  `muscle-volume-table`, `exercise-table`, `muscle-contribution-table` — all
  have `tabIndex={0}` + an `aria-label` so keyboard-only users can focus and
  arrow-key-scroll them. This was added after a live accessibility review
  caught that CSS-only scrolling left the content unreachable without a
  mouse. Known minor gap: `muscle-contribution-table`'s `aria-label` doesn't
  interpolate the session name the way its two siblings do, and it's missing
  the `sr-only <caption>` the other three have — cosmetic drift from
  applying the same fix by hand at four call sites, not yet cleaned up.
- **Tests** (run 2026-07-14): **Vitest 65/65** (`src/lib/**`, `src/i18n/**`),
  **Playwright 32/32** (`tests/e2e/*.spec.ts`, up from 31 — a new keyboard-
  reachability regression test for the muscle-group-volume table).
  `tests/e2e/helpers.ts#gotoApp` navigates to `/app`.

## How this was built

Built conversationally with Claude Code across several sessions/phases (see
`README.md`'s "How it was actually built" for the full narrative aimed at
outside readers). In short: domain modeling → core program-builder loop →
i18n → session time estimation → bug-fix passes → a React → Preact +
Tailwind/daisyUI migration with the multi-page split (`/`, `/app`, `/about`,
`/legal`, `/404`) → i18n extended to static pages → an RGAA/a11y audit →
review-pipeline-driven UI/UX polish (nav/CTA consistency, footer on every
page, input visibility/alignment, collapsible sections, the hypertrophy-only
radar chart).

**Latest pass (this session)**: whole-project audit and cleanup —
- Verified `astro check` (0 errors/warnings, 4 hints, all confirmed
  false-positive/no-fix-available — see the A11y/i18n notes above and the
  `TargetedEvent` note below), Vitest (65/65), Playwright (31/31 at the
  time — see the 32/32 count in "Tests" above from the later pass below),
  and `npm run build` all pass cleanly.
- `JSX.TargetedEvent` deprecation hints in `ExercisePicker.tsx` /
  `ExportImportBar.tsx`: confirmed there is no actual replacement type in
  the installed Preact version (10.29.7) — the `@deprecated` tag ("import
  from the Preact namespace instead") is forward-looking; no such namespace
  exports these types yet. Left as-is.
- Fixed several stale doc comments referencing a `SiteNav.tsx` file that
  never existed under that name (the real files are `NavBar.astro` +
  `LocaleSelect.tsx`) in `applyStaticLocale.ts`, `AppHeader.tsx`,
  `localeStore.ts`, and `context.test.tsx`.
- Deleted three untracked, unreferenced debug screenshots left at the repo
  root from a prior review session (`mobile-app.png`, `mobile-app-table.png`,
  `mobile-home.png`).
- Rewrote `README.md`'s stack section (Preact/Tailwind/daisyUI instead of
  React/blades, added Chart.js and @axe-core/playwright) and extended its
  build history with the migration/polish phases; rewrote this file.

**Latest pass (2026-07-14, later same day)**: radar chart resized (halved)
and its table moved into a collapsed `<details>` below it, per a follow-up
request; the review loop this ran through caught and fixed a mobile table-
clipping regression, a chart-resize-stuck bug, and — the one that took an
extra iteration — a keyboard-accessibility gap where the newly-scrollable
table was unreachable without a mouse, fixed across all four tables sharing
that scroll pattern app-wide (see "Scrollable-table keyboard accessibility"
above). Docs (`README.md`, this file) updated accordingly; the full-project
code audit/cleanup itself (stray debug screenshots, `astro check` re-run,
etc.) was intentionally left for a separate pass and not re-run here.

**Doc-sync verification (2026-07-14)**: re-checked every architectural
claim in this file against the actual working tree (not against prior doc
text) since multiple sessions had touched the repo in parallel. Re-ran the
suites fresh: Vitest **65/65**, Playwright **32/32**, `astro check` **0
errors / 0 warnings / 4 hints** (same four false-positive hints described
above), `npm run build` clean (5 pages, same chunk-size warning as noted
below). No code, component, or i18n-architecture drift found beyond what's
already described above. One thing *is* out of sync with the "cleanup"
note above: a new batch of ~27 untracked debug screenshots (e.g.
`stuck-repro.png`, `375-table-scrolled.png`, `focus-summary.png`,
`dark-collapsed2.png`, numbered files like `01_initial_fr.png`) has
reappeared at the repo root, left behind by whatever session ran the
chart-resize/table-collapse/keyboard-a11y review loop described above.
Same pattern as the `mobile-app*.png` files removed in the earlier pass —
harmless (untracked, gitignored or not, don't affect the app) but stray;
left for a cleanup pass since this doc-sync task is documentation-only.

## Running it

```bash
npm install
astro dev --background     # dev server on http://localhost:4321
astro dev status
astro dev logs
astro dev stop

npx vitest run                 # unit tests
npx playwright test            # e2e tests (spins up its own build+preview server on :4323)
npx astro check                # type check
npx astro build                # production build
```

## Known non-blocking items (accepted, not fixed)

- **Exercise-name French coverage is ~19% (168/873)**, by design — English
  fallback is the tested, intended behavior for untranslated exercises. Run
  `python3 scripts/list_missing_translations.py` for the current gap list.
- `<input list>`/`<datalist>` accessibility behavior varies across
  browser/screen-reader combos (accepted native-HTML tradeoff).
- No adapter/SSR — static output only, everything is client-side.
- No URL routing for locale (no `/en/`, `/fr/`) — intentional,
  `localStorage`-driven toggle, consistent with the rest of the app's state.
- `npm run build` prints a Vite "chunks larger than 500 kB" warning (mainly
  Chart.js). Not an error; left un-code-split since it's a small
  client-only app and this wasn't in scope for this pass.
