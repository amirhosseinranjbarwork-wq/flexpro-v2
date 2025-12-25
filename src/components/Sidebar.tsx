import React from 'react';
import type { TabKey } from '../types/index';

interface SidebarProps {
  currentTab: TabKey;
  setTab: (tab: TabKey) => void;
  onBackup: () => void;
  onRestore: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  canAdminData: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab, onBackup, onRestore, onReset, canAdminData }) => {
  
  const renderButton = (id: TabKey, label: string, icon: React.ReactNode) => (
    <button 
      onClick={() => setTab(id)} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
        currentTab === id 
        ? 'text-white shadow-lg scale-[1.02]' 
        : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/8 hover:text-[var(--text-primary)] hover:scale-[1.01]'
      }`}
      style={currentTab === id ? { background: `linear-gradient(135deg, var(--accent-color), var(--accent-secondary))`, boxShadow: `0 10px 30px var(--accent-color)/40` } : {}}
    >
      <span className="text-xl relative z-10 transition-transform duration-200 group-hover:scale-110">{icon}</span>
      <span className="font-medium text-sm relative z-10">{label}</span>
      {currentTab === id && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/40 rounded-l-full"></div>
      )}
    </button>
  );

  return (
    <aside className="w-72 glass-panel !rounded-none !border-y-0 !border-r-0 flex flex-col h-full z-30">
      <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        <nav className="space-y-2">
          
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-2 mb-2">داشبورد</div>
          {renderButton('users', 'مدیریت شاگردان', '👥')}

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">طراحی برنامه</div>
          {renderButton('training', 'برنامه تمرینی', '🏋️')}
          {renderButton('nutrition', 'رژیم غذایی', '🥗')}
          {renderButton('supplements', 'مکمل‌ها و داروها', '💊')}

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mt-6 mb-2">گزارشات</div>
          {renderButton('progress', 'کارتابل و پیشرفت شاگرد', '📈')}
        
        </nav>
      </div>

      <div className="p-5 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={onBackup}
            disabled={!canAdminData}
            className={`bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/20 py-2.5 rounded-xl text-xs transition flex justify-center items-center gap-2 font-bold ${!canAdminData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>⬇️</span> بکاپ
          </button>
          <label className={`bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 py-2.5 rounded-xl text-xs transition flex justify-center items-center gap-2 cursor-pointer font-bold ${!canAdminData ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span>⬆️</span> بازیابی
            <input type="file" className="hidden" accept=".json" onChange={onRestore} disabled={!canAdminData} />
          </label>
        </div>
        <button
          onClick={onReset}
          disabled={!canAdminData}
          className={`w-full text-[10px] text-red-500/70 hover:text-red-500 transition py-2 hover:bg-red-500/10 rounded-lg ${!canAdminData ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ⚠ بازنشانی تنظیمات کارخانه
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;