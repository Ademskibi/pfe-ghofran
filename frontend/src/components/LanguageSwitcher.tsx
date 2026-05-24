import React from 'react';
import { useTranslation } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const options: Array<{ code: 'ar' | 'fr' | 'en'; label: string }> = [
    { code: 'ar', label: 'AR' },
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-1"
      style={{
        backgroundColor: 'var(--bg-muted)',
        border: '1px solid var(--border-base)',
      }}
    >
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLanguage(opt.code)}
          className="px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200"
          style={
            language === opt.code
              ? {
                  backgroundColor: 'var(--brand-cyan)',
                  color: '#ffffff',
                  boxShadow: '0 1px 3px rgba(17,180,215,0.35)',
                }
              : {
                  color: 'var(--text-muted)',
                  backgroundColor: 'transparent',
                }
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
