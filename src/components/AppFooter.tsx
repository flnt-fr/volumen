import { useTranslation } from '../i18n/context';

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="container">
      <p>
        <a href="/about">{t('footer.about')}</a> · <a href="/legal">{t('footer.legal')}</a>
      </p>
    </footer>
  );
}
