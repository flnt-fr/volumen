import { describe, expect, it } from 'vitest';
import { detectBrowserLocale, matchSupportedLocale, resolveInitialLocale } from './localeStore';

describe('matchSupportedLocale', () => {
  it('matches a bare supported tag', () => {
    expect(matchSupportedLocale('fr')).toBe('fr');
    expect(matchSupportedLocale('en')).toBe('en');
  });

  it('matches on the primary subtag of a regional tag', () => {
    expect(matchSupportedLocale('fr-FR')).toBe('fr');
    expect(matchSupportedLocale('en-GB')).toBe('en');
  });

  it('is case-insensitive', () => {
    expect(matchSupportedLocale('FR-fr')).toBe('fr');
  });

  it('returns null for unsupported languages', () => {
    expect(matchSupportedLocale('de-DE')).toBeNull();
    expect(matchSupportedLocale('es')).toBeNull();
  });
});

describe('detectBrowserLocale', () => {
  it('returns the first supported locale in the given language list', () => {
    expect(detectBrowserLocale(['de-DE', 'fr-FR', 'en-US'])).toBe('fr');
  });

  it('returns null when no language in the list is supported', () => {
    expect(detectBrowserLocale(['de-DE', 'es-ES'])).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(detectBrowserLocale([])).toBeNull();
  });
});

describe('resolveInitialLocale', () => {
  it('falls back to DEFAULT_LOCALE outside the browser (no window/navigator)', () => {
    expect(resolveInitialLocale()).toBe('en');
  });
});
