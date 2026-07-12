import en, { type TranslationKey } from './strings.en';
import fr from './strings.fr';
import type { Locale } from './types';

const dictionaries: Record<Locale, Partial<Record<TranslationKey, string>>> = { en, fr };

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in params ? String(params[key]) : match,
  );
}

export function t(locale: Locale, key: TranslationKey, params?: Record<string, string | number>): string {
  const template = dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
  return interpolate(template, params);
}
