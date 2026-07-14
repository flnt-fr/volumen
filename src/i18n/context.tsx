import { createContext, type ComponentChildren } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { t } from './t';
import type { TranslationKey } from './strings.en';
import { DEFAULT_LOCALE, type Locale } from './types';
import { resolveInitialLocale, setStoredLocale } from './localeStore';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ComponentChildren }) {
  // Resolved lazily (in useState's initializer, not an effect): the whole
  // /app body is one client:load island with no static SSR content to
  // protect, so resolveInitialLocale() — which only touches
  // localStorage/navigator.language, both available synchronously at
  // construction time in the browser (guarded for SSR in localeStore.ts) —
  // can run before the very first render, removing the
  // render-English-then-correct-to-French flash entirely. It must NOT
  // persist to localStorage here, or an auto-detected browser language would
  // get silently "locked in" as if the user had explicitly chosen it.
  // Persisting only happens through setLocale below, mirroring
  // LocaleSelect.tsx's behavior on the static pages (see
  // src/i18n/localeStore.ts).
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    setStoredLocale(next);
  }

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
