import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

export function Footer() {
  const { language } = useApp();
  
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• {t('footer.education', language)}</li>
          <li>• {t('footer.techStack', language)}</li>
          <li>• {t('footer.developer', language)}</li>
        </ul>
      </div>
    </footer>
  );
}

