import React from 'react';
import { useI18n } from '../i18n/I18nContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const options: Array<{ code: 'ar' | 'fr' | 'en'; label: string }> = [
    { code: 'ar', label: 'AR' },
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLanguage(opt.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
            language === opt.code
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          aria-label={`${t('language.label')}: ${t(`language.${opt.code}`)}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
