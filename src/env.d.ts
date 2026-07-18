// Side-effect CSS imports (e.g. `import 'driver.js/dist/driver.css'` in
// src/lib/tour.ts) are normally understood via the ambient declarations in
// `astro/client`, referenced from the generated (gitignored) .astro/types.d.ts.
// That file only exists after `astro sync`/`astro check`/`astro build` has
// run at least once, so a bare `npx tsc --noEmit` on a fresh checkout (as CI
// runs it) fails with "Cannot find module... for side-effect import" before
// anything generates it. Declaring this here makes plain `tsc` work
// regardless of step order or whether Astro's own tooling has run yet.
declare module '*.css';

// LocaleFOUCScript.astro's <script define:vars={{ ... }}> is is:inline and
// therefore unprocessed by Astro (no TypeScript, no bundling — see
// https://docs.astro.build/en/reference/directives-reference/#definevars),
// but `astro check` still tries to typecheck its contents against the
// global scope. It has no way to see the const bindings define:vars injects
// at build time, so it reports "Cannot find name" for each of them. These
// ambient declarations describe exactly what that script actually receives,
// scoped to their real runtime types, to silence that false positive
// without a blanket @ts-nocheck.
declare const locales: readonly string[];
declare const defaultLocale: string;
declare const storageKey: string;
declare const frStrings: Record<string, string>;
