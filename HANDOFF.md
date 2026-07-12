# Volumen — handoff notes

Astro + React app for building a strength training program aligned with the
2026 ACSM recommendations. Fully client-side (no backend), state persisted in
`localStorage`. This file summarizes what was built in the previous session
so a new session (with the `playwright` MCP server available) can pick up
with direct browser interaction instead of scripted Playwright checks.

## What's implemented

- **Data**: `src/data/acsm-2026.json` (4 training goals with load/volume/
  frequency rules and key principles) and `src/data/exercices.json` (873
  exercises with primary/secondary muscles).
- **Business logic** (`src/lib/`):
  - `types.ts` — `Program { goalId, sessions }`, `Session { id, name,
    exercises }`, `ProgramExercise { id, exerciseId, sets, reps, restSeconds }`.
  - `data.ts` — typed loaders + `getGoalById`/`getExerciseById` lookups.
  - `calculations.ts` — `setsByMuscle`, `setsByMuscleForProgram`,
    `checkGoalCompliance` (evaluates the volume rules from the ACSM JSON;
    returns `[]` for goals without a defined volume rule, e.g. power /
    generalHealthMovement).
  - `programFile.ts` — Zod schema `ProgramFileSchema` for the export/import
    JSON file (header = compliance results + goal + its definition/key
    principles, then sessions/exercises), `buildProgramFile` (validates its
    own output before returning), `parseProgramFile` (validates + checks
    `goalId`/`exerciseId` still exist, returns readable error messages),
    `parseStoredProgram` (same validation, used for localStorage).
- **UI** (`src/components/*.tsx`, React island mounted via
  `<ProgramBuilder client:load />` in `src/pages/index.astro`):
  `GoalSelector`, `SessionList`/`SessionEditor`, `ExercisePicker` (native
  `<input list>` + `<datalist>` over the 873 exercises), `ExerciseRow`,
  `MuscleVolumeTable`, `RuleComplianceCard`, `ExportImportBar`.
- **Styling**: `src/styles/theme.css` overrides blades' (`@anyblades/blades`,
  classless/Pico-like) `--pico-primary*` variables; light/dark handled via
  `prefers-color-scheme` and `[data-theme]`.
- **i18n (English/French)** (`src/i18n/`): custom lightweight system, no
  npm dependency. `types.ts` (`Locale = 'en' | 'fr'`), `strings.en.ts` /
  `strings.fr.ts` (flat UI dictionaries, `fr` fully covers `en`'s keys —
  guarded by a unit test), `t.ts` (pure `t(locale, key, params?)` lookup +
  English fallback + `{param}` interpolation, importable from plain-TS lib
  code with no React), `context.tsx` (`LocaleProvider` + `useTranslation()`
  hook, persists to `localStorage` under `volumen:locale`, default `'en'`
  with **no `navigator.language` auto-detection** so existing English-only
  e2e tests keep passing), `labels.ts` (hand-translated training-goal
  name/definition/keyPrinciples + the small enum sets: muscle, equipment,
  force, level, mechanic, category — English side is always the raw
  untouched string so existing regex-based e2e assertions don't break),
  `exerciseNames.ts` (`getExerciseName(exercise, locale)` looks up
  `exercise.slug` in `src/data/exercise-names.fr.json`, falls back to
  English `exercise.name` when missing).
  `calculations.ts#checkGoalCompliance` and `programFile.ts#buildProgramFile
  /parseProgramFile/humanZodMessage` all take a `locale: Locale = 'en'`
  parameter and generate their messages via `t()` — exported program files
  snapshot the goal/exercise names and compliance messages in whatever
  locale was active at export time (same "message is a snapshot" behavior
  as before, just now locale-aware).
  `AppHeader.tsx` (new) renders the `<h1>`/tagline + the
  `data-testid="locale-select"` switcher inside the React tree (wrapped by
  `LocaleProvider` in `ProgramBuilder.tsx`) so they can react to locale
  changes and update `document.documentElement.lang`/persist to
  localStorage; `index.astro` keeps a static English `<noscript>` fallback
  for `<h1>`/tagline and a static `lang="en"` (overridden client-side).
- **Exercise slugs**: `src/data/exercices.json` entries now carry a `slug`
  field (kebab-case of `name`, deduplicated), added by
  `scripts/add_exercise_slugs.py` (idempotent, re-runnable, same
  conventions as `scripts/transform_exercices.py`). The slug — not `id` —
  is the translation key because `transform_exercices.py` **regenerates a
  fresh random `id` on every run**, which would silently orphan any
  uuid-keyed translation table.
  `scripts/list_missing_translations.py` reports French exercise-name
  coverage (translated vs. English-fallback count + the list of missing
  slugs) — **not wired into CI**, just a manual check.
- **Exercise name translations**: `src/data/exercise-names.fr.json` is a
  hand-authored `{ "<slug>": "<French name>" }` map. As of this session it
  covers **168 of 873 exercises (~19%)** — the highest-value/most common
  barbell, dumbbell, cable, machine, bodyweight, and kettlebell lifts.
  The remaining ~705 fall back to their English name (by design — this is
  the documented, tested fallback path, not a bug). Translating the long
  tail (obscure variants, stretches, SMR/self-myofascial-release names,
  named/brand exercises) is a large, purely mechanical content-authoring
  task with no shortcut available (no translation API in this
  environment) — a good next session's work: run
  `python3 scripts/list_missing_translations.py` to get the current gap
  list, translate a batch, re-run to confirm coverage went up.
- **Language**: UI copy, aria-labels, error messages, and `<html lang>`
  support both **English** (default) and **French** (toggle via the
  `locale-select` dropdown in the header). The `acsm-2026.json` and
  `exercices.json` data files themselves are still English-only source —
  translations live in `src/i18n/` and `exercise-names.fr.json`, not in
  the source data.
- **Tests**:
  - Unit (Vitest, `src/lib/*.test.ts`, config in `vitest.config.ts` which
    excludes `tests/e2e/**`): `setsByMuscle`, `checkGoalCompliance` per goal,
    export/import round-trip, invalid-import cases.
  - E2E (Playwright, `tests/e2e/*.spec.ts`, config in `playwright.config.ts`):
    full journey, export→import round-trip, invalid-import handling,
    localStorage persistence across reload. All interactive elements have
    `data-testid` attributes (see `tests/e2e/helpers.ts` for the full map:
    `goal-select`, `sessions-section`, `session`, `add-session-button`,
    `session-name-input`, `delete-session-button`, `exercise-table`,
    `exercise-row`, `exercise-sets-input`, `exercise-reps-input`,
    `exercise-rest-input`, `delete-exercise-button`,
    `exercise-picker-input`, `exercise-picker-add-button`,
    `exercise-picker-no-match`, `muscle-volume-summary`,
    `muscle-volume-table`, `no-exercises-message`, `compliance-card`,
    `compliance-summary`, `compliance-rule-list`, `compliance-rule`,
    `compliance-empty-message`, `export-button`, `import-input`,
    `import-error`, `locale-select`), `aria-label`/`label` are kept in
    parallel for accessibility.
  - `tests/e2e/locale-switch.spec.ts`: switching language translates the
    UI, updates `<html lang>`, persists across reload, and is reflected in
    exported program files. All other e2e specs assert hardcoded English
    and are untouched — default locale is `'en'`, never auto-detected.

## How it was built

Work was split across specialized agents, each followed by a fix pass:

1. Core layer (types, data loaders, calculations, Zod schema, unit tests).
2. UI layer (React components, Astro page, theme, localStorage wiring).
3. E2E tests (Playwright).
4. Four parallel review agents: code review, functional validation against
   the spec, visual/UI review, RGAA (French accessibility standard)
   audit — 15 findings total, all fixed (export-time schema guard, Vitest/
   Playwright config collision, mobile responsive table overflow, dark-mode
   contrast on the fail status, over-verbose `aria-live`, ambiguous delete
   button names, French error messages, etc.).
5. Full English translation pass (UI copy + tests) + `data-testid` migration
   for the E2E suite.
6. Playwright-MCP interactive review session: found and fixed a stale
   Vite dep-cache hydration failure, a `vertical-align` row-header
   misalignment in tables, a mobile `<input type="text">` (Reps field)
   missing the `min-width` rule other inputs had, and a French filename
   typo (`programme-` → `program-`) in the export.
7. English/French i18n (this session): custom `t()`/dictionary system,
   `slug`-keyed exercise-name translation table, locale threaded through
   `calculations.ts`/`programFile.ts`, language switcher wired through
   every component, new `locale-switch.spec.ts` e2e spec. See the i18n
   bullets above for what's built and the exercise-name-coverage bullet
   for what's left.

Full original plan: `/home/florent/.claude/plans/encapsulated-noodling-brooks.md`
i18n plan: `/home/florent/.claude/plans/glittery-soaring-hopcroft.md`
(both local to the machine that ran the session, not in the repo).

## Running it

```bash
npm install
astro dev --background     # dev server on http://localhost:4321
astro dev status            # check it's running
astro dev logs              # tail logs
astro dev stop               # stop it

npx vitest run               # unit tests
npx playwright test          # e2e tests (spins up its own build+preview server on :4323)
npx astro check               # type check
npx astro build                # production build
```

## Known non-blocking items (accepted, not fixed)

- **Exercise-name French coverage is ~19% (168/873)**, by design — see the
  i18n bullets above. Not a bug, but the main piece of unfinished work.
- `<input list>`/`<datalist>` accessibility behavior varies across
  browser/screen-reader combos (accepted native-HTML tradeoff, see plan).
- No adapter/SSR — static output is enough since everything is
  client-side; don't add a server adapter without a reason.
- No URL routing for locale (no `/en/`, `/fr/`) — intentional, confirmed
  with the user: single page, client-side-only toggle, consistent with the
  rest of the app's localStorage-driven state.

## Suggested next steps

- **Finish exercise-name translations**: run
  `python3 scripts/list_missing_translations.py` for the current gap list
  (currently ~705 slugs), translate in batches grouped by
  category/equipment for terminology consistency, re-run to confirm
  coverage. The app is fully functional at any coverage level (English
  fallback), so this can be done incrementally across sessions.
- A Playwright-MCP session (`claude mcp add playwright npx
  @playwright/mcp@latest`) is good for: re-verifying the mobile layout
  (375px) and dark-mode contrast visually, clicking through the full
  French UI end-to-end to sanity-check phrasing/accents render correctly,
  and trying the `<datalist>` exercise picker's real autocomplete UX in
  both locales (native browser behavior isn't fully exercised by
  Playwright's programmatic `.fill()`).
