import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Users, LineChart, Brain, LogOut, User, FileText } from 'lucide-react';

const Layout: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = currentUser?.role === 'teacher' 
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/class-overview', label: 'Class Overview', icon: Users },
        { path: '/progress-tracking', label: 'Progress Tracking', icon: LineChart },
        // { path: '/new-assessment', label: 'New Assessment', icon: Brain } // Assuming handled from Dashboard or Student detail
      ]
    : [
        { path: '/student-portal', label: 'My Portal', icon: Brain },
        /* { path: '/my-progress', label: 'My Progress', icon: LineChart } */
      ];

  // Derive initials roughly
  const userInitial = currentUser?.role === 'teacher' ? 'T' : 'S';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarExpanded ? 'w-[220px]' : 'w-[64px]'}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-200 bg-indigo-600 text-white shadow-sm overflow-hidden flex-shrink-0">
           {isSidebarExpanded ? (
             <span className="font-bold text-xl tracking-tight leading-none whitespace-nowrap px-4 w-full">NeuroCal</span>
           ) : (
             <Brain className="w-8 h-8 flex-shrink-0" />
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
                  isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarExpanded && <span className="ml-3 text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
             {/* Simple hack to set a title - could use a custom hook */}
             Portal
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold relative group">
                {userInitial}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-slate-500 hover:text-rose-600 transition-colors p-2 rounded-full hover:bg-rose-50"
              title="Logout"
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
