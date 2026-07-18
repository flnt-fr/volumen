# Volumen

Volumen is a small, fully client-side web app for building a strength-training
program aligned with the [ACSM 2026 resistance-training
recommendations](https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx).
Pick a training goal (strength, hypertrophy, power, general health), build out
your weekly sessions from a database of 800+ exercises, and the app checks
your sets/volume against the recommended targets per muscle group, estimates
how long each session will actually take, and lets you export/import your
program as JSON. Everything lives in `localStorage` — no backend, no
accounts, no tracking.

## ⚠️ This project is a vibe-coding experiment

This entire codebase — every line, every test, every design decision — was
written by **prompting Claude** (via [Claude Code](https://claude.com/claude-code)),
not by hand. There was no spec-driven-development framework, no ticket
system, no formal design doc, no scaffolding harness of any kind. Just a
back-and-forth conversation: a feature request in plain English (often in
French), Claude reading the existing code, writing the implementation,
running the tests, and reporting back. Bugs got described the same way a
user would describe them ("the import doesn't work") rather than filed with
a root-cause diagnosis.

The goal was to see how far pure conversational prompting could carry a
real, working, tested app — not to demonstrate a polished engineering
process. Take the code with that in mind: it's the product of an experiment
in AI-driven ("vibe") coding, not a reference architecture.

## How it was actually built

1. **Bootstrap** — started from the standard Astro minimal template
   (`npm create astro@latest -- --template minimal`) with a React
   integration added for interactive components (later migrated to Preact,
   see step 9).
2. **Domain data first** — dropped in two source datasets (see
   [Sources](#sources) below) and asked Claude to model the domain: training
   goals, exercises, and the `Program`/`Session`/`ProgramExercise` shape.
3. **Core loop, iteratively prompted** — goal selection → session/exercise
   editing → per-muscle volume calculation → compliance checking against the
   ACSM rules → export/import as JSON, each added as its own prompt/feature
   request, with Claude reading the current code before extending it.
4. **i18n pass** — a follow-up prompt asked for English/French support, which
   Claude implemented as a small hand-rolled `t()` lookup system (no i18n
   library) plus a hand-translated subset of exercise names, with a tested
   English fallback for anything untranslated.
5. **Session time estimation** — a later feature request ("show me how long
   each session/exercise will take, plus a time margin input") was
   implemented, then deliberately run through a multi-agent review loop in
   the same conversation: one agent implemented the feature, then three
   more ran in parallel against the diff — one re-reviewing the code for
   correctness, one driving a real browser via Playwright to validate the
   UI, and one independently re-deriving the time-estimation math by hand
   to check it against the implementation. Their findings were fed back
   into another round of fixes.
6. **Bug fixes from plain-English reports** — e.g. "the import feature
   doesn't work" was investigated from scratch (reproducing the export →
   import round trip in a real browser) rather than assumed; the actual
   defect (a new field silently dropped from the exported JSON schema) was
   found and fixed with regression tests added after the fact.
7. **Tuning by feel** — later prompts adjusted the time-estimation model
   itself (tempo assumption, equipment-change overhead) purely based on the
   requester's intuition of what felt realistic, not a formal study.
8. **Whole-project review pass** — once the feature set felt complete, a
   dedicated review/fix/validate loop ran across the *entire* codebase (not
   just the latest diff): one agent audited everything from scratch and
   flagged concrete bugs (e.g. a silent-data-loss edge case where an
   unclamped numeric input could wipe the whole stored program on reload),
   a second agent fixed each finding with regression tests, and a third
   independently re-drove the fixed app through real user journeys in a
   browser via Playwright before signing off.
9. **Preact + Tailwind/daisyUI migration and multi-page split** — a later,
   larger pass moved the framework from React to **Preact**
   (`@astrojs/preact`) and the styling from a classless CSS framework to
   **Tailwind CSS v4 + daisyUI**, with two custom themes (`volumenlight` /
   `volumendark`, see `src/styles/theme.css`). The single-page app was split
   into a multi-page site: a static marketing homepage on `/`, the program
   builder moved to `/app`, plus `/about`, `/legal`, and a custom `/404`,
   all sharing the same header/footer. The hand-rolled i18n system was
   extended from the app to these static pages (locale persisted in
   `localStorage`, resolved from stored choice → browser language →
   English default). An RGAA/WCAG AA accessibility audit followed, adding
   `@axe-core/playwright` and an automated a11y test scanning every route in
   both light and dark themes.
10. **Review-pipeline-driven UI/UX polish** — a further pass, run through a
    multi-agent implement-then-review loop, tightened consistency across the
    app: unified nav/CTA styling and behavior between the static pages and
    `/app`, put a footer on every page (including `/404`), fixed input
    visibility/alignment issues, made some sections collapsible, and added a
    Chart.js radar chart (sets-per-muscle in "Muscle group volume") shown
    only when the hypertrophy goal is selected.
11. **Chart sizing and table collapse, with a keyboard-accessibility fix
    found along the way** — a follow-up request shrank the radar chart to
    half its original max size and moved the "Muscle group volume" table
    into a collapsible section below the chart, matching the pattern already
    used elsewhere. The review loop this ran through caught two regressions
    before they shipped (a mobile layout where the table's rightmost columns
    were clipped, and the chart getting stuck at the wrong size after a
    browser resize), then a third: making the table scrollable by CSS had
    left it unreachable via keyboard, a real accessibility gap. The fix
    (`tabindex`/`aria-label` on the scrollable element) was applied
    consistently across all four tables in the app that share the same
    scroll-on-overflow pattern, not just the one that was reported.

12. **Guided tour** — a request to introduce first-time visitors to `/app`
    was implemented with **driver.js**: a tour covering only the parts of the
    interface guaranteed to be visible on a first visit (deliberately
    skipping conditional UI that doesn't exist yet, like the per-session
    exercise editor), auto-started once per visitor via a `localStorage`
    flag and replayable through a header button. A multi-agent review loop
    caught a real bug live in the browser — clicking through the tour
    quickly left a previous step's element still interactive underneath the
    popover — fixed and pinned with a regression test. A follow-up prompt
    trimmed the tour down to skip the header/footer steps.
13. **Whole-project audit, second pass** — another dedicated review across
    the entire codebase and its `.md` docs: fixed a case-sensitive exercise-
    name matching bug, hardened `localStorage` writes that could throw
    unhandled in private browsing, deduplicated a repeated locale-name
    constant and a numeric-input clamp helper copied three times, added a
    missing `aria-label` on the radar chart's canvas, and removed stray
    leftover files (an empty file accidentally committed at the repo root,
    an empty test directory) — plus refreshing this file and `HANDOFF.md` to
    reflect the guided tour and current test counts.

14. **Build-size fix** — a request to fix Vite's "chunks larger than 500 kB"
    build warning was implemented by code-splitting `chart.js`, `driver.js`,
    and `zod` behind dynamic `import()`s, and by discovering — rather than
    assuming a library was to blame — that the actual biggest contributor was
    the exercise database's unused `instructions` field (~70% of that file's
    size), now stripped from the copy the app actually bundles. Validating
    the fix against a real production build (not just the dev server) caught
    a regression: dynamically importing driver.js's CSS specifically broke
    in that build (a 404'ing, never-emitted chunk), silently disabling the
    guided tour; fixed by keeping that one import static.
15. **Type-check hints, actually resolved** — a request to fix `astro
    check`'s remaining hints (accepted as false positives in earlier passes)
    found real fixes for both: a deprecated Preact event type had an
    undeprecated equivalent already available from a different import path,
    and an inline script's `define:vars`-injected bindings just needed
    declaring as ambient globals for the type checker to see them. Zero
    hints now, instead of four accepted ones.

Testing throughout was Vitest for the domain logic and i18n
(`src/lib/*.test.ts`, `src/i18n/*.test.ts`) and Playwright for end-to-end
flows and accessibility (`tests/e2e/*.spec.ts`), both driven by Claude, with
the human in the loop reviewing behavior rather than diffs line by line.

## Stack & credits

- **[Astro](https://astro.build/)** — static-first site framework, hosting
  a handful of Preact islands (the program builder and small interactive
  pieces like the locale selector) across a multi-page static site.
- **[Preact](https://preactjs.com/)** (via `@astrojs/preact`) — the
  interactive program builder and other islands.
- **[Tailwind CSS](https://tailwindcss.com/) v4 + [daisyUI](https://daisyui.com/)**
  — utility-first styling with two custom themes (`volumenlight` /
  `volumendark`) in `src/styles/theme.css`.
- **[Chart.js](https://www.chartjs.org/)** — the sets-per-muscle radar
  chart shown for the hypertrophy goal.
- **[driver.js](https://driverjs.com/)** — the guided tour introducing
  `/app`'s interface on a visitor's first visit (replayable any time).
- **[Zod](https://zod.dev/)** — schema validation for the localStorage
  program shape and the export/import JSON file format.
- **[Vitest](https://vitest.dev/)** — unit tests for the domain logic and
  i18n.
- **[Playwright](https://playwright.dev/)** + **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)**
  — end-to-end browser tests and automated accessibility (RGAA/WCAG AA)
  scans.
- **[TypeScript](https://www.typescriptlang.org/)** throughout.
- **[Claude](https://www.anthropic.com/claude) (Anthropic)**, via
  **[Claude Code](https://claude.com/claude-code)** — wrote the entire
  application, tests, and this README, from natural-language prompts.

## Sources

- **Training-goal rules** (`src/data/acsm-2026.json`) — summarized from the
  American College of Sports Medicine's 2026 position stand, *"Resistance
  Training Prescription for Muscle Function, Hypertrophy, and Physical
  Performance in Healthy Adults: An Overview of Reviews"*, published in
  *Medicine & Science in Sports & Exercise* (April 2026), an umbrella review
  of 137 systematic reviews (~30,000 participants). Full text:
  https://journals.lww.com/acsm-msse/fulltext/2026/04000/american_college_of_sports_medicine_position.21.aspx
- **Exercise database** (`src/data/exercices.json`) — from
  [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)
  (~870 entries: name, force type, level, mechanic, equipment,
  primary/secondary muscles, step-by-step instructions, category), itself
  restructured from an original dataset by Ollie Jennings
  ([wrkout/exercises.json](https://github.com/wrkout/exercises.json)).
  Exercise names have a partial hand-authored French translation layer in
  `src/data/exercise-names.fr.json`, falling back to the original English
  name where no translation exists yet. The app itself imports
  `src/data/exercices.app.json`, a generated copy
  (`scripts/generate_app_exercises.py`) with the `instructions` field
  stripped — it isn't used anywhere in the UI, and it alone accounted for
  ~70% of the source file's size.

## License

The application code in this repository (everything except the two data
files below) is [MIT-licensed](./LICENSE).

That license does **not** extend to the third-party data bundled in
`src/data/`, which has its own, different status:

- `src/data/exercices.json` and the exercise names it's keyed by are from
  **free-exercise-db**, released under the
  [Unlicense](https://github.com/yuhonas/free-exercise-db/blob/main/LICENSE)
  (public domain) — free to reuse with no restriction. Credited above out of
  courtesy to the original authors, not because it's legally required.
- `src/data/acsm-2026.json` is **not** a freely licensed dataset — it's a
  condensed summary of facts and figures drawn from a copyrighted ACSM
  journal article (see [Sources](#sources)). The numbers and thresholds
  themselves aren't copyrightable, but the summarized wording is derived
  from that copyrighted source. This repo's MIT license doesn't purport to
  grant any rights over that content; treat `acsm-2026.json` as a reference
  snapshot for use within this app, not as freely redistributable data, and
  consult the original publication for anything beyond that.

## Development

See [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) for the
day-to-day dev commands (background dev server management, doc links used
while working on this project).

```sh
npm install
npm run dev        # start the dev server
npm run test       # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright)
npm run build      # production build
```

## Deployment

Volumen builds to a fully static site (`astro build` → `dist/`, no server,
no adapter) and is deployed at **volumen.flnt.fr** as a static site on
[Coolify](https://coolify.io/), with no Dockerfile involved:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Install command**: `npm ci`
- Node version is pinned via `.nvmrc` (currently `22`), which Coolify's
  Nixpacks build picks up automatically.

No environment variables or secrets are required — every dataset the app
uses is bundled at build time.
