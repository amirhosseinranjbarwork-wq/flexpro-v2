import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Sun, Moon, LogOut, User, LayoutDashboard, Dumbbell, Utensils, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      <Sidebar mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ mobileOpen: boolean, setMobileOpen: (open: boolean) => void }> = ({ mobileOpen, setMobileOpen }) => {
  const { user, profile, role, signOut } = useAuth();
  const location = useLocation();

  const navLinks = role === 'coach'
    ? [
        { href: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
        { href: '/dashboard/clients', icon: User, label: 'شاگردان' },
      ]
    : [
        { href: '/dashboard', icon: LayoutDashboard, label: 'داشبورد' },
        { href: '/dashboard/training', icon: Dumbbell, label: 'برنامه تمرین' },
        { href: '/dashboard/nutrition', icon: Utensils, label: 'برنامه تغذیه' },
      ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--glass-bg)] border-r border-[var(--glass-border)] backdrop-blur-xl">
      <div className="p-6 text-center border-b border-[var(--glass-border)]">
        <h1 className="text-2xl font-bold">FlexPro</h1>
        <p className="text-sm text-[var(--accent-color)]">{role === 'coach' ? 'پنل مربی' : 'پنل شاگرد'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map(link => (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${
              location.pathname === link.href
                ? 'bg-[var(--accent-color)] text-white shadow-lg'
                : 'hover:bg-[var(--text-primary)]/5'
            }`}
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--glass-border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold">
            {profile?.full_name?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm">{profile?.full_name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500/20 transition"
        >
          <LogOut size={16} />
          <span>خروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-72 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
};


// Header Component
const Header: React.FC<{ onMenuClick: () => void }> = () => {
  const { theme, toggleTheme } = useUI();
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[var(--glass-bg)]/80 backdrop-blur-lg">
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden text-[var(--text-secondary)]">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-bold">خوش آمدید، {profile?.full_name?.split(' ')[0]}!</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-[var(--text-secondary)]">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Add other header items like notifications here */}
        </div>
      </div>
    </header>
  );
};

export default DashboardLayout;
