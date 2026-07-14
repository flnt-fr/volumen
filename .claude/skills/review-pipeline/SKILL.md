---
name: review-pipeline
description: This skill should be used when the user invokes /review-pipeline (or asks to "run the full pipeline", "code and review this properly", "full QA pass") for a code modification request on the Volumen app. Orchestrates implementation followed by a parallel multi-agent review (clean code/archi, QA scenarios, code review, Astro idioms, security, UX/UI/RGAA, feature completeness), then loops fixes against blocking findings.
---

# Review pipeline

Orchestrates a full implement-then-review cycle for a single modification request (`args` = the user's original prompt, verbatim). Runs in the main conversation — you (the orchestrator) drive it directly with the Agent tool. Do not skip phases; do not silently merge phases to save time.

## Phase 0 — Frame the request

Restate the request as a concrete spec before touching code: what should change, which files/areas are likely involved, what "done" looks like (including test coverage expectations). If the request is ambiguous in a way that changes scope materially, ask the user first via AskUserQuestion — don't guess and burn a whole pipeline run on the wrong target.

## Phase 1 — Implement (code + tests)

Spawn one `general-purpose` agent (foreground, `run_in_background: false`) to implement the change **and** its tests in the same pass. Brief it with:
- The exact user request.
- Relevant file paths / components you already know are involved (from Phase 0).
- This project's conventions: Astro + React islands, i18n via `src/i18n`, tests under `tests/e2e` (Playwright) and co-located `*.test.ts(x)` (Vitest). Check `CLAUDE.md` for dev-server usage (`astro dev --background`).
- Instruction to run the relevant test suite(s) itself before returning, and to report which files it touched and why.

Wait for it to finish (foreground) — the review phase needs a stable diff to look at.

## Phase 2 — Parallel multi-agent review

Once Phase 1 returns, send **one message with all review agents launched in parallel** (multiple Agent tool calls in the same turn), each `subagent_type: Explore` (read-only: Read/Grep/Bash/Playwright available, no Edit/Write — reviewers must never modify code) and `run_in_background: false` so you can collect all results before deciding on a loop.

Brief every reviewer with: the original user request, the list of files changed in Phase 1 (get this from `git diff --stat` before spawning, and paste actual file paths — don't make agents rediscover the diff), and the specific lens below. Each agent must return findings as a short list, each tagged **blocking** or **non-blocking**, with file:line and a one-sentence reason.

1. **Clean code / architecture** — naming, duplication, layering, coupling, whether the change fits existing patterns in `src/components` and `src/lib`. Non-blocking unless it introduces real maintenance risk (e.g. duplicated business logic, broken separation of concerns).
2. **QA — user scenarios** — walk through realistic user flows touching the change (happy path + at least 2 edge cases: empty state, invalid input, locale switch FR/EN, mobile viewport) using the running dev server (`astro dev --background`) and Playwright MCP tools where useful. Blocking = a scenario that breaks or regresses.
3. **Code review (correctness)** — bugs, logic errors, unhandled edge cases, incorrect assumptions. This is distinct from the architecture lens above — focus purely on "does it do what it claims." Blocking = any confirmed correctness bug.
4. **Astro-idiom review** — for each non-trivial piece of new logic, ask only: *could a native Astro feature replace this?* (content collections, `Astro.locals`/middleware, server islands, `define:vars`, view transitions, built-in image/asset handling, partial hydration directives like `client:idle`/`client:visible` instead of `client:load`, etc.) Consult `mcp__astro-docs__search_astro_docs` if unsure. Always non-blocking — these are suggestions, not defects.
5. **Security** — this is a front-end app (Astro + React islands), so most classic backend concerns (SQLi, auth, server secrets) won't apply; say so explicitly rather than inventing risk. Actually check: XSS via unsanitized `set:html`/`dangerouslySetInnerHTML`, unsafe use of user-supplied data in URLs/localStorage, unvalidated import/export of program files (`ExportImportBar`), dependency risks in touched code. Blocking = any real exploitable issue; explicitly state "no security concerns" if none found rather than inventing filler findings.
6. **UX / UI / RGAA** — visual consistency with existing design system, responsive behavior, and accessibility per RGAA/WCAG (keyboard navigation, focus states, color contrast, ARIA labels, semantic HTML). This agent must use the `mcp__playwright__*` tools directly (not just infer from code): `browser_navigate` to load each affected page against the running dev server, `browser_snapshot` for accessibility-tree/ARIA checks, `browser_resize` to verify the mobile viewport, `browser_press_key`/`browser_click` to walk keyboard navigation and focus order, and `browser_take_screenshot` to inspect visual/contrast issues. Blocking = an accessibility level A failure or a broken/unusable UI state confirmed live in the browser, not merely suspected from source.
7. **Feature completeness** — does the implementation actually satisfy the original user request in full, including i18n (both `strings.en.ts` and `strings.fr.ts` updated if user-facing text changed) and any implicit requirements (e.g. persistence, export/import compatibility). Blocking = a missing piece of the original ask.

## Phase 3 — Aggregate and loop

Collect all 7 reports. Build one blocking-findings list (dedupe overlapping findings across agents).

- **If there are blocking findings and this is iteration 1 or 2:** send them back to a **new** Phase-1-style `general-purpose` coder agent (or resume the same one via SendMessage if it's still addressable) with the concrete list of blocking findings, file:line, and what to fix. Then re-run Phase 2 on the updated diff. Increment the iteration counter.
- **If there are no blocking findings:** stop looping, go to Phase 4.
- **If iteration 3 completes and blocking findings remain:** stop looping regardless — do not attempt a 4th pass. Go to Phase 4 and report the open items plainly.

Non-blocking findings are never looped on automatically — surface them in the final report and let the user decide.

## Phase 4 — Final report to the user

Summarize concisely (this is the only phase whose output the user reads in full):
- What was implemented, in 1-3 sentences.
- Test results (pass/fail, what was run).
- Any blocking findings still open after the loop budget, with file:line.
- Non-blocking findings worth the user's attention, grouped by lens, max ~1 line each.
- Number of iterations used.

Do not dump raw agent transcripts — synthesize.
