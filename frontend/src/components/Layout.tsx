import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
<<<<<<< HEAD
import { useTranslation } from '../i18n';
import logo from '../OIP.webp';
import { LayoutDashboard, Users, LineChart, Brain, LogOut, User, FileText, Sparkles } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const { t, language, setLanguage } = useTranslation();
=======
import { LayoutDashboard, Users, LineChart, Brain, LogOut } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const { t } = useI18n();
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = currentUser?.role === 'teacher' 
    ? [
<<<<<<< HEAD
        { path: '/dashboard', label: t('layout.dashboard'), icon: LayoutDashboard },
        { path: '/class-overview', label: t('layout.classOverview'), icon: Users },
        { path: '/progress-tracking', label: t('layout.progressTracking'), icon: LineChart },
      ]
    : [
        { path: '/student-portal', label: t('layout.myPortal'), icon: Brain },
        { path: '/mini-games', label: t('layout.miniGames'), icon: Sparkles },
=======
        { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { path: '/class-overview', label: t('nav.classOverview'), icon: Users },
        { path: '/progress-tracking', label: t('nav.progressTracking'), icon: LineChart },
        // { path: '/new-assessment', label: 'New Assessment', icon: Brain } // Assuming handled from Dashboard or Student detail
      ]
    : [
        { path: '/student-portal', label: t('nav.myPortal'), icon: Brain },
        /* { path: '/my-progress', label: 'My Progress', icon: LineChart } */
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
      ];

  // Derive initials roughly
  const userInitial = currentUser?.role === 'teacher' ? 'T' : 'S';

  return (
    <div className="flex h-screen bg-app-background text-[var(--color-black)] font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-panel border-r border-panel transition-all duration-300 flex flex-col ${isSidebarExpanded ? 'w-[220px]' : 'w-[64px]'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="h-16 flex items-center justify-center border-b border-panel bg-brand text-white shadow-brand overflow-hidden flex-shrink-0">
          {isSidebarExpanded ? (
            <img src={logo} alt="NeuroCal logo" className="h-10 object-contain" />
          ) : (
            <img src={logo} alt="NeuroCal logo" className="h-8 w-8 object-contain" />
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 relative scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) => 
                `flex items-center mx-2 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap overflow-hidden ${
                  isActive ? 'bg-brand text-white font-medium' : 'text-[var(--color-fox-dark)] hover:bg-[var(--color-bg-shape)] hover:text-[var(--color-black)]'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="ms-3 text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
<<<<<<< HEAD
        <header className="h-16 bg-panel border-b border-panel flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <h1 className="text-xl font-semibold text-[var(--color-fox-dark)] capitalize">
             {t('layout.portal')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="language-select" className="text-sm font-medium text-slate-500 hidden sm:block">
                {t('layout.language')}:
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="input-primary h-10"
              >
                <option value="en">{t('layout.english')}</option>
                <option value="fr">{t('layout.french')}</option>
                <option value="ar">{t('layout.arabic')}</option>
              </select>
            </div>
=======
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
             {/* Simple hack to set a title - could use a custom hook */}
             {t('common.portal')}
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[var(--color-ui-dark)] text-white flex items-center justify-center font-bold relative group">
                {userInitial}
              </div>
            </div>
            <button 
              onClick={handleLogout}
<<<<<<< HEAD
              className="flex items-center text-[var(--color-fox-dark)] hover:text-[var(--color-fox)] transition-colors p-2 rounded-full hover:bg-[var(--color-bg-shape)]"
              title={t('layout.logout')}
=======
              className="flex items-center text-slate-500 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50"
              title={t('nav.logout')}
>>>>>>> 18ba6cdcf69e235cec9fdd6f55ab15c28db9ff0f
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
