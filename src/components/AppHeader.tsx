import { useTranslation } from '../i18n/context';
import { LOCALES, type Locale } from '../i18n/types';

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
};

/**
 * Mirrors the markup/classes of the shared static-page header (NavBar.astro
 * + LocaleSelect.tsx) so /app's header looks and behaves identically to the
 * other four routes. Kept as its own Preact component (rather than sharing
 * NavBar.astro directly) because it lives inside the /app island's own tree
 * and needs the Context-based useTranslation() wiring the rest of that tree
 * depends on, plus its nav links omit the "Open the app" CTA (already there)
 * in favor of About/Legal — same pattern as NavBar.astro omitting the current
 * page's own link. Keep the two in sync if you change one.
 */
export default function AppHeader() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="navbar flex-wrap gap-x-2 gap-y-1 bg-base-100 shadow-sm px-4 py-2 sm:px-6">
      <div className="flex-1">
        <h1 className="m-0 inline-flex text-inherit">
          <a href="/" className="btn btn-ghost text-xl">
            Volumen
          </a>
        </h1>
      </div>
      <div className="flex-none max-w-full">
        <ul className="menu menu-horizontal max-w-full flex-wrap items-center justify-end gap-1 px-1">
          <li>
            <a href="/about">{t('footer.about')}</a>
          </li>
          <li>
            <a href="/legal">{t('footer.legal')}</a>
          </li>
          <li>
            <label htmlFor="locale-select" className="sr-only">
              {t('localeSwitcher.label')}
            </label>
            <select
              id="locale-select"
              data-testid="locale-select"
              className="select select-bordered select-sm"
              value={locale}
              onChange={(event) => setLocale(event.currentTarget.value as Locale)}
            >
              {LOCALES.map((option) => (
                <option key={option} value={option}>
                  {LOCALE_NAMES[option]}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </header>
  );
}
