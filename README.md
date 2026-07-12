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
   (`npm create astro@latest -- --template minimal`) with the React
   integration added for interactive components.
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

Testing throughout was Vitest for the domain logic (`src/lib/*.test.ts`) and
Playwright for end-to-end flows (`tests/e2e/*.spec.ts`), both driven by
Claude, with the human in the loop reviewing behavior rather than diffs line
by line.

## Stack & credits

- **[Astro](https://astro.build/)** — static-first site framework, hosts a
  single React island.
- **[React](https://react.dev/)** — the interactive program builder.
- **[Zod](https://zod.dev/)** — schema validation for the localStorage
  program shape and the export/import JSON file format.
- **[@anyblades/blades](https://github.com/anyblades/blades)** — the
  classless/Pico-inspired CSS framework used for base styling.
- **[Vitest](https://vitest.dev/)** — unit tests for the domain logic.
- **[Playwright](https://playwright.dev/)** — end-to-end browser tests.
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
  name where no translation exists yet.

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
