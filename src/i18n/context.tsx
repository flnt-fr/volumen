import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { t } from './t';
import type { TranslationKey } from './strings.en';
import { DEFAULT_LOCALE, isLocale, type Locale } from './types';

const LOCALE_STORAGE_KEY = 'volumen:locale';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

function loadLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(loadLocale());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const { locale, setLocale } = useContext(LocaleContext);
  return {
    locale,
    setLocale,
    t: (key: TranslationKey, params?: Record<string, string | number>) => t(locale, key, params),
  };
}
