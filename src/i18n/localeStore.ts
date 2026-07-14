import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './types';

export const LOCALE_STORAGE_KEY = 'volumen:locale';

/**
 * Single source of truth for "what locale should we start in", shared by the
 * /app island (src/i18n/context.tsx) and the static marketing pages
 * (src/components/site/LocaleSelect.tsx). Both must agree on the same storage key
 * and the same fallback order, or the language choice would silently diverge
 * depending on which part of the site the visitor lands on first:
 *
 *   1. an explicit choice already persisted in localStorage
 *   2. the visitor's browser language, if it matches a supported locale
 *   3. DEFAULT_LOCALE
 */

/** Reads the persisted locale, if any. Returns null if unset, invalid, or run server-side. */
export function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : null;
}

/** Persists the visitor's explicit locale choice. No-op server-side. */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

/**
 * Maps a BCP-47 language tag (e.g. "fr-FR", "en-GB") to one of our supported
 * locales by comparing its primary subtag ("fr", "en"). Exported mainly for
 * testing; prefer detectBrowserLocale() for the real browser-driven lookup.
 */
export function matchSupportedLocale(languageTag: string): Locale | null {
  const primary = languageTag.trim().toLowerCase().split('-')[0];
  return LOCALES.find((locale) => locale === primary) ?? null;
}

/**
 * Looks at navigator.languages (falling back to navigator.language) and
 * returns the first supported locale found, or null if none match — e.g. a
 * browser set to German with no French/English in its language list.
 */
export function detectBrowserLocale(languages?: readonly string[]): Locale | null {
  const candidates =
    languages ??
    (typeof window === 'undefined'
      ? []
      : (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean));

  for (const tag of candidates) {
    const match = matchSupportedLocale(tag);
    if (match) return match;
  }
  return null;
}

/** stored choice → browser language → DEFAULT_LOCALE. */
export function resolveInitialLocale(): Locale {
  return getStoredLocale() ?? detectBrowserLocale() ?? DEFAULT_LOCALE;
}
