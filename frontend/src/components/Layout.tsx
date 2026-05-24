import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Users, LineChart, Brain, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../OIP.webp';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDark = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = currentUser?.role === 'teacher'
    ? [
        { path: '/dashboard',        label: t('nav.dashboard'),      icon: LayoutDashboard },
        { path: '/class-overview',   label: t('nav.classOverview'),  icon: Users },
        { path: '/progress-tracking',label: t('nav.progressTracking'),icon: LineChart },
      ]
    : [
        { path: '/student-portal', label: t('nav.myPortal'),  icon: Brain },
        { path: '/mini-games',     label: t('nav.miniGames'), icon: Sparkles },
      ];

  const roleLabel = currentUser?.role === 'teacher' ? '👨‍🏫 Enseignant' : '👨‍🎓 Élève';

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* ───── SIDEBAR ───── */}
      <aside
        className={`
          hidden md:flex flex-col flex-shrink-0 transition-all duration-300
          ${isSidebarExpanded ? 'w-60' : 'w-[68px]'}
        `}
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-base)',
        }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo zone */}
        <div
          className="h-[68px] flex items-center flex-shrink-0 overflow-hidden px-3"
          style={{ borderBottom: '1px solid var(--border-base)' }}
        >
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3 animate-fadeIn w-full">
              {/* ── OIP.webp logo ── */}
              <img
                src={logo}
                alt="SAHARTOON Logo"
                className="w-10 h-10 object-contain rounded-lg flex-shrink-0"
                style={{ filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
              />
              <div className="overflow-hidden">
                <div
                  className="text-sm font-bold tracking-wider leading-tight truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  SAHARTOON
                </div>
                <div
                  className="text-[10px] font-mono font-semibold tracking-widest truncate"
                  style={{ color: 'var(--brand-cyan)' }}
                >
                  NeuroCal
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-9 h-9 object-contain rounded-lg"
                style={{ filter: isDarkMode ? 'brightness(0.9)' : 'none' }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              title={!isSidebarExpanded ? item.label : undefined}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''} ${!isSidebarExpanded ? 'justify-center' : ''}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarExpanded && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div
          className="p-2 flex flex-col gap-1 flex-shrink-0"
          style={{ borderTop: '1px solid var(--border-base)' }}
        >
          {/* User chip */}
          {isSidebarExpanded && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs animate-fadeIn"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
            >
              <span className="flex-shrink-0">🔵</span>
              <span className="truncate font-medium">{currentUser?.email}</span>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`nav-item w-full ${!isSidebarExpanded ? 'justify-center' : ''}`}
            title={t('nav.logout')}
            style={{ color: 'var(--brand-orange)' }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && <span className="text-sm">{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex-shrink-0 h-[68px] flex items-center justify-between px-5 gap-4"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderBottom: '1px solid var(--border-base)',
          }}
        >
          {/* Left: page title slot */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {roleLabel}
            </span>
          </div>

          {/* Right: Language + Dark toggle */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Dark / Light toggle */}
            <button
              onClick={toggleDark}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-muted)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-secondary)',
              }}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? (
                <><Sun className="w-3.5 h-3.5" />{isSidebarExpanded && <span>Light</span>}</>
              ) : (
                <><Moon className="w-3.5 h-3.5" />{isSidebarExpanded && <span>Dark</span>}</>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg-page)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
