import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { Plus, Download, Moon, Sun, Globe, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface DashboardHeaderProps {
  onAddStudent: () => void;
  onExport: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onAddStudent,
  onExport,
  isDark,
  onThemeToggle,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { logout } = useAppContext();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-sahartoon-burgundy shadow-soft-md">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4">
            {/* <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-sahartoon-burgundy text-lg">
              🦁
            </div> */}
            <div>
              <h1 className="text-xl font-bold text-white">Sahartoon Enseignant TN</h1>
              <p className="text-xs text-white/80">Dépistage des troubles DYS — Niveaux de gravité</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onAddStudent}
              className="flex items-center gap-2 px-4 py-2 bg-white text-sahartoon-burgundy rounded-lg font-medium text-sm hover:bg-gray-100 transition-all duration-200 shadow-soft hover:shadow-soft-md"
            >
              <Plus className="w-4 h-4" />
              {t('dashboard.addStudent')}
            </button>

            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={t('common.export')}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={isDark ? t('common.lightMode') : t('common.darkMode')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                title={t('common.language')}
              >
                <Globe className="w-4 h-4" />
                <span className="text-xs font-semibold">{language.toUpperCase()}</span>
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-soft-lg overflow-hidden animate-fadeIn">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        language === lang.code
                          ? 'bg-sahartoon-beige text-sahartoon-burgundy font-medium'
                          : 'text-sahartoon-dark hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => logout && logout()}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={t('nav.logout') || 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
