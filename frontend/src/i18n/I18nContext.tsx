import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

export type Language = 'en' | 'fr' | 'ar';

interface I18nContextType {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tArray: (key: string) => string[];
  value: (key: string) => any;
}

const dictionaries: Record<Language, any> = { en, fr, ar };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const applyVars = (text: string, vars?: Record<string, string | number>): string => {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    text,
  );
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initial = (localStorage.getItem('neurocal_lang') as Language) || 'fr';
  const [language, setLanguage] = useState<Language>(['en', 'fr', 'ar'].includes(initial) ? initial : 'fr');

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('neurocal_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.setAttribute('dir', dir);
  }, [language, dir]);

  const value = useMemo(() => {
    const dict = dictionaries[language];
    const fallback = dictionaries.en;

    const v = (key: string): any => {
      const hit = getByPath(dict, key);
      if (hit !== undefined) return hit;
      return getByPath(fallback, key);
    };

    const t = (key: string, vars?: Record<string, string | number>): string => {
      const raw = v(key);
      if (typeof raw !== 'string') return key;
      return applyVars(raw, vars);
    };

    const tArray = (key: string): string[] => {
      const raw = v(key);
      return Array.isArray(raw) ? raw.map((x) => String(x)) : [];
    };

    return {
      language,
      dir,
      setLanguage,
      t,
      tArray,
      value: v,
    };
  }, [language, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
