import { t } from '../../i18n/t';
import type { TranslationKey } from '../../i18n/strings.en';
import type { Locale } from '../../i18n/types';

/**
 * Translates every annotated element on a prerendered static page
 * (index/about/legal/404) in place, and updates <html lang>.
 *
 * These pages are fully static Astro output: there's no server-side session
 * or cookie to know the visitor's locale from, so they're always rendered
 * with the English strings by default (SSR / no-JS visitors get correct,
 * complete content). Each translatable element carries
 * `data-i18n-key="some.key"` in the markup; this function is the one place
 * that walks those elements and swaps their content via t(). It's called
 * from LocaleSelect (src/components/site/LocaleSelect.tsx) once on mount — using
 * whatever locale localeStore.resolveInitialLocale() resolves to — and again
 * every time the visitor picks a different language from the selector, so
 * the two code paths can't drift apart.
 *
 * Always re-applies t(locale, key) — including for the English default —
 * rather than skipping when locale is English: the selector lets a visitor
 * switch fr → en on the same page without a reload, and the DOM has already
 * been mutated away from the prerendered English markup at that point, so
 * "do nothing for English" would leave stale French text on screen.
 *
 * innerHTML (not textContent) is used deliberately: several strings contain
 * inline links (e.g. in about.astro/legal.astro) that must survive
 * translation. The translation strings are static, developer-authored copy,
 * never user input, so this is safe.
 */
export function applyStaticLocale(locale: Locale, root: ParentNode = document): void {
  document.documentElement.lang = locale;

  for (const el of root.querySelectorAll<HTMLElement>('[data-i18n-key]')) {
    const key = el.getAttribute('data-i18n-key') as TranslationKey | null;
    if (!key) continue;
    el.innerHTML = t(locale, key);
  }
}
