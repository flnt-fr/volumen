import { useTranslation } from '../i18n/context';
import { LOCALES, type Locale } from '../i18n/types';

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
};

export default function AppHeader() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="container">
      <h1>Volumen</h1>
      <p>{t('app.tagline')}</p>
      <label htmlFor="locale-select" className="sr-only">
        {t('localeSwitcher.label')}
      </label>
      <select
        id="locale-select"
        data-testid="locale-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {LOCALES.map((option) => (
          <option key={option} value={option}>
            {LOCALE_NAMES[option]}
          </option>
        ))}
      </select>
    </header>
  );
}
