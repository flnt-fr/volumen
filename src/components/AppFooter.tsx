import { useTranslation } from '../i18n/context';

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="footer footer-center bg-base-100 px-4 py-6 text-base-content/70 sm:px-6" data-testid="app-footer">
      <p>
        <span>
          <a href="/about" className="link link-hover">
            {t('footer.about')}
          </a>{' '}
          ·{' '}
          <a href="/legal" className="link link-hover">
            {t('footer.legal')}
          </a>
        </span>
      </p>
    </footer>
  );
}
