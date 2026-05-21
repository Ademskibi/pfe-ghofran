import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Users, LineChart, Brain, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../OIP.webp';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const location = useLocation();
  // Hide the white/light topbar on Student Portal and Teacher Portal pages
  const hideTopbar = currentUser?.role === 'teacher' || location.pathname.startsWith('/student-portal');

  const navItems = currentUser?.role === 'teacher'
    ? [
        { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { path: '/class-overview', label: t('nav.classOverview'), icon: Users },
        { path: '/progress-tracking', label: t('nav.progressTracking'), icon: LineChart },
      ]
    : [
        { path: '/student-portal', label: t('nav.myPortal'), icon: Brain },
        { path: '/mini-games', label: t('nav.miniGames'), icon: Sparkles },
      ];

  const userInitial = currentUser?.role === 'teacher' ? '👨‍🏫' : '👨‍🎓';

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - Dark Maroon, Icon-only, Full Height, Flush to Top */}
      <aside 
        className={`hidden md:flex flex-col bg-sahartoon-burgundy border-r border-sahartoon-burgundy/20 transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo - Flush to Very Top, No White Bar Above */}
        <div className="h-20 flex items-center justify-center bg-sahartoon-burgundy text-white overflow-hidden flex-shrink-0 border-b border-sahartoon-burgundy/30">
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="text-2xl">🦁</div>
              <div>
                <div className="text-sm font-bold leading-tight">Sahartoon</div>
                <div className="text-xs opacity-80">Enseignant</div>
              </div>
            </div>
          ) : (
            <div className="text-2xl">🦁</div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarExpanded && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sahartoon-burgundy/30">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 ${!isSidebarExpanded && 'justify-center'}`}
            title={t('nav.logout')}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && <span className="text-sm font-medium">{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-sahartoon-beige dark:bg-slate-900 transition-colors duration-300">
        {/* Page Content - Flush to Top (Topbar Removed Completely) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 md:hidden z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
