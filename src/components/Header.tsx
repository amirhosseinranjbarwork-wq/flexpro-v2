import React, { useEffect, useState } from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type { User, UserId, Role } from '../types/index';

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  currentRole: Role;
  currentAccountId: UserId | null;
  setCurrentAccountId: React.Dispatch<React.SetStateAction<UserId | null>>;
  setActiveUserId: React.Dispatch<React.SetStateAction<UserId | null>>;
  users: User[];
  activeUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  isDark,
  currentRole,
  currentAccountId,
  setCurrentAccountId,
  setActiveUserId,
  users,
  activeUser,
  onLogout
}) => {
  const [currentDate] = useState(() => new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  // همگام‌سازی نقش و حساب فعال برای حالت شاگرد
  useEffect(() => {
    if (currentRole === 'coach') {
      setCurrentAccountId(null);
      setActiveUserId(null);
      return;
    }
    if (currentRole === 'client') {
      const fallbackId = users[0]?.id ?? null;
      const nextId = currentAccountId ?? fallbackId;
      if (nextId != null) {
        setCurrentAccountId(nextId);
        setActiveUserId(nextId);
      }
    }
  }, [currentRole, currentAccountId, setCurrentAccountId, setActiveUserId, users]);

  // انتخاب نقش/شاگرد حذف شده؛ setCurrentRole / setCurrentAccountId فقط برای سازگاری Props نگه داشته شده است.

  return (
    <motion.header 
      className="h-20 glass-panel border-b border-white/10 flex items-center justify-between px-6 md:px-10 z-40 shrink-0 !bg-opacity-80 !rounded-none !border-x-0 !border-t-0"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-[var(--accent-color)] rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity duration-500 ease-out"></div>
          <img 
            src="https://placehold.co/100x100/38bdf8/white?text=VO2" 
            alt="Logo" 
            className="h-11 w-11 rounded-full object-cover relative z-10 border-2 border-white/20" 
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-300 to-purple-400">VO</span>
            <span className="text-emerald-400">₂</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-300 to-purple-400">MAX</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)]">
            <span>V12 ULTRA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] bg-[var(--glass-bg)]/80 px-3 py-2 rounded-2xl border border-[var(--glass-border)] shadow-inner shadow-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
          <span>نقش: {currentRole === 'coach' ? 'مربی' : 'شاگرد'}</span>
          <button
            onClick={onLogout}
            className="ml-2 flex items-center gap-1 text-[var(--text-secondary)] hover:text-red-400 transition"
            aria-label="خروج از حساب"
          >
            <LogOut size={14} />
            <span>خروج</span>
          </button>
        </div>
        <span className="hidden lg:flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] bg-[var(--glass-bg)]/80 px-4 py-2 rounded-2xl border border-[var(--glass-border)] shadow-inner shadow-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
          {currentDate}
        </span>
        
        <button onClick={toggleTheme} className="btn-glass bg-[var(--glass-bg)]/80 hover:bg-white/10 text-[var(--text-primary)] !p-2 rounded-full border border-[var(--glass-border)]">
            {isDark ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-600"/>}
        </button>

        {/* انتخاب نقش و شاگرد حذف شد طبق درخواست */}

        {activeUser && (
          <motion.div 
            className="flex items-center gap-3 bg-gradient-to-r from-[var(--accent-color)] via-[var(--accent-secondary)] to-indigo-600 text-white px-5 py-2 rounded-2xl shadow-lg shadow-[var(--accent-color)]/30 border border-white/10 animate-fade-in"
            whileHover={{ 
              y: -4,
              scale: 1.02,
              boxShadow: "0 20px 50px rgba(14, 165, 233, 0.4)"
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              duration: 0.5
            }}
          >
            <div className="flex flex-col items-end leading-none">
              <span className="text-[9px] opacity-80 font-bold uppercase tracking-wider mb-0.5">ورزشکار فعال</span>
              <span className="font-bold text-sm">{activeUser.name}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;