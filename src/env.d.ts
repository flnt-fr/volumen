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
