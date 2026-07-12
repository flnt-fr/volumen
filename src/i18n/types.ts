export type Locale = 'en' | 'fr';

export const LOCALES: Locale[] = ['en', 'fr'];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value);
}
