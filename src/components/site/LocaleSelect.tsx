import { useEffect, useRef, useState } from 'preact/hooks';
import { t } from '../../i18n/t';
import { LOCALES, type Locale } from '../../i18n/types';
import { resolveInitialLocale, setStoredLocale } from '../../i18n/localeStore';
import { applyStaticLocale } from './applyStaticLocale';

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
};

/**
 * The only hydrated leaf in the shared nav (see NavBar.astro): the logo,
 * nav links, and optional CTA are static Astro markup translated in place by
 * LocaleFOUCScript.astro's blocking inline <script> via their own
 * `data-i18n-key` attributes, same as the rest of each static page. This
 * component owns just the `<select>` and its own label, which is the only
 * genuinely interactive piece of the header.
 *
 * The initial locale is resolved lazily in useState's initializer (not in an
 * effect): resolveInitialLocale() only touches localStorage/navigator, both
 * synchronously available at construction time in the browser, so the
 * select's own first render already shows the right value without a
 * post-hydration flash. This mirrors the fix in src/i18n/context.tsx for
 * /app. LocaleFOUCScript.astro is what protects everything else on the page
 * from a flash: it runs before this island even hydrates.
 *
 * The mount effect below just re-applies applyStaticLocale() defensively (a
 * no-op if LocaleFOUCScript.astro already applied the same locale) — without
 * persisting, so an auto-detected browser language never gets silently
 * "locked in" as if the visitor had explicitly chosen it (see
 * src/i18n/context.tsx for the /app equivalent of this same rule).
 * Persisting only happens on an explicit change.
 *
 * The server always renders this <select> with "en" selected (no
 * localStorage/navigator on the server), while the client's first render
 * already computes the real locale via the lazy useState initializer above.
 * Preact's hydrate() reuses the server-rendered <select>/<option> DOM nodes
 * as-is and does not reliably re-apply the `value` prop to them during
 * hydration (a `<select>`'s selected option is state living on the DOM
 * nodes themselves, not just an attribute diff) — so the dropdown's visible
 * selection can stay stuck on "EN" even though `locale` state, the page
 * content, and <html lang> are all already correct. Setting `.value`
 * imperatively via a ref, once after mount and again on every explicit
 * change, forces the DOM to match regardless of what hydration did or
 * didn't sync.
 */
export default function LocaleSelect() {
  const [locale, setLocale] = useState<Locale>(() => resolveInitialLocale());
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const initial = resolveInitialLocale();
    setLocale(initial);
    applyStaticLocale(initial);
  }, []);

  useEffect(() => {
    if (selectRef.current) selectRef.current.value = locale;
  }, [locale]);

  function handleChange(next: Locale) {
    setLocale(next);
    setStoredLocale(next);
    applyStaticLocale(next);
  }

  return (
    <>
      <label htmlFor="locale-select" className="sr-only">
        {t(locale, 'localeSwitcher.label')}
      </label>
      <select
        ref={selectRef}
        id="locale-select"
        data-testid="locale-select"
        className="select select-bordered select-sm"
        value={locale}
        onChange={(event) => handleChange(event.currentTarget.value as Locale)}
      >
        {LOCALES.map((option) => (
          <option key={option} value={option}>
            {LOCALE_NAMES[option]}
          </option>
        ))}
      </select>
    </>
  );
}
