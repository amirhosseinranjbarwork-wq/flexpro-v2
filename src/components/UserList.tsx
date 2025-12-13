import React, { useState, useMemo, useCallback } from 'react';
import { Search, UserPlus, Edit, Trash2, Printer, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { User, UserId } from '../types/index';
import { useApp } from '../context/AppContext';
import { useDebounce } from '../hooks/useDebounce';

const escapeHtml = (text: unknown): string => {
    if (text == null || text === undefined) return '';
    const str = String(text);
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
};

interface UserListProps {
  users: User[];
  onSelectUser?: (id: UserId) => void;
  onAddUser?: () => void;
  onEditUser?: (id: UserId) => void;
  onDeleteUser?: (id: UserId) => void;
  onPrintUser?: (id: UserId) => void;
}

const ITEMS_PER_PAGE = 10;

const UserListComponent: React.FC<UserListProps> = ({ users, onSelectUser, onAddUser, onEditUser, onDeleteUser, onPrintUser }) => {
  const { hasPermission } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredUsers = useMemo(() => 
    users.filter(u => 
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
      (u.phone && u.phone.includes(debouncedSearch))
    ), [users, debouncedSearch]
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const getFinancialStatus = useCallback((user: User) => {
      if (!user.financial?.startDate) return { text: 'نامشخص', color: 'text-slate-400 bg-slate-500/10', icon: <AlertTriangle size={16}/> };
      
      try {
        const start = new Date(user.financial.startDate);
        if (isNaN(start.getTime())) return { text: 'نامعتبر', color: 'text-slate-400 bg-slate-500/10', icon: <AlertTriangle size={16}/> };
        
        const duration = Number(user.financial.duration ?? 1) || 1;
        const end = new Date(start);
        end.setMonth(end.getMonth() + duration);
        
        const now = new Date();
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (isNaN(daysLeft)) return { text: 'نامعتبر', color: 'text-slate-400 bg-slate-500/10', icon: <AlertTriangle size={16}/> };
        if (daysLeft < 0) return { text: 'منقضی شده', color: 'text-red-500 bg-red-500/10', icon: <XCircle size={16}/> };
        if (daysLeft <= 5) return { text: `${daysLeft} روز مانده`, color: 'text-yellow-500 bg-yellow-500/10', icon: <AlertTriangle size={16}/> };
        return { text: 'فعال', color: 'text-emerald-500 bg-emerald-500/10', icon: <CheckCircle size={16}/> };
      } catch {
        return { text: 'خطا', color: 'text-slate-400 bg-slate-500/10', icon: <AlertTriangle size={16}/> };
      }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* هدر و جستجو */}
      <div className="flex flex-col md:flex-row justify-between items-center glass-panel p-5 rounded-2xl gap-4 sticky top-0 z-20">
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)]">لیست شاگردان ({filteredUsers.length})</h2>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="جستجو..." 
              className="input-glass pl-10 py-2.5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          </div>
          {hasPermission('manageUsers') && (
            <button onClick={() => onAddUser && onAddUser()} className="btn-glass bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white text-sm py-2.5">
            <UserPlus size={18} /> جدید
          </button>
          )}
        </div>
      </div>

      {/* لیست کارت‌ها (افقی) */}
      <div className="flex flex-col gap-4">
          {paginatedUsers.map((u, index) => {
            const status = getFinancialStatus(u);
            const uniqueKey = u.id ? `user-${u.id}` : `user-index-${index}`;
            return (
            <div key={uniqueKey} className="glass-card flex flex-col md:flex-row items-center justify-between p-4 gap-4 group hover:border-[var(--accent-color)]/50 animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
              
              {/* بخش اطلاعات */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[var(--accent-color)]/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[var(--accent-color)]/40">
                      {u.name.charAt(0)}
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-[var(--text-primary)]">{u.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-1">
                          <span className="flex items-center gap-1 bg-[var(--glass-border)] px-2 py-0.5 rounded">{u.age || '-'} ساله</span>
                          <span className="flex items-center gap-1 bg-[var(--glass-border)] px-2 py-0.5 rounded">{u.weight || '-'} kg</span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded font-bold ${status.color}`}>
                              {status.icon} {status.text}
                          </span>
                      </div>
                  </div>
              </div>

              {/* بخش دکمه‌ها */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end" style={{ position: 'relative', zIndex: 50 }}>
                {hasPermission('viewProgram', u.id) && (
                <button 
                    type="button"
                    onClick={() => onSelectUser && onSelectUser(u.id)} 
                    className="btn-glass bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)] hover:text-white text-[var(--accent-color)] border border-[var(--accent-color)]/20 text-sm flex-1 md:flex-none cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                    aria-label={`مدیریت برنامه ${escapeHtml(u.name || '')}`}
                >
                  مدیریت برنامه
                </button>
                )}
                {hasPermission('manageUsers', u.id) && (
                <button 
                  type="button"
                  onClick={() => onEditUser && onEditUser(u.id)} 
                  className="p-2 rounded-lg bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 text-[var(--text-secondary)] transition cursor-pointer" 
                  title="ویرایش"
                  aria-label={`ویرایش اطلاعات ${escapeHtml(u.name || '')}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Edit size={18} aria-hidden="true"/>
                </button>
                )}
                {hasPermission('printProgram', u.id) && (
                <button 
                  type="button"
                  onClick={() => onPrintUser && onPrintUser(u.id)} 
                  className="p-2 rounded-lg bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 text-[var(--text-secondary)] transition cursor-pointer" 
                  title="چاپ"
                  aria-label={`چاپ برنامه ${escapeHtml(u.name || '')}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Printer size={18} aria-hidden="true"/>
                </button>
                )}
                {hasPermission('manageUsers', u.id) && (
                <button 
                  type="button"
                  onClick={() => onDeleteUser && onDeleteUser(u.id)} 
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition cursor-pointer" 
                  title="حذف"
                  aria-label={`حذف ${escapeHtml(u.name || '')}`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <Trash2 size={18} aria-hidden="true"/>
                </button>
                )}
              </div>
            </div>
          )})}
          
          {filteredUsers.length === 0 && (
              <div className="text-center py-10 opacity-50">موردی یافت نشد.</div>
          )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent-color)]/50 transition"
          >
            قبلی
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-2 text-[var(--text-secondary)]">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                      currentPage === page
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)]/50'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent-color)]/50 transition"
          >
            بعدی
          </button>
          
          <span className="text-xs text-[var(--text-secondary)] mr-4">
            صفحه {currentPage} از {totalPages} ({filteredUsers.length} نفر)
          </span>
        </div>
      )}
    </div>
  );
};

const UserList = React.memo(UserListComponent);
UserList.displayName = 'UserList';

export default UserList;