import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, Menu, X, Users, Dumbbell,
  UtensilsCrossed, Pill, Printer, Activity,
  Settings, TrendingUp, Bell, Search, Plus,
  ChevronRight, CheckCircle2,
  Copy, Shield
} from 'lucide-react';

// Lazy load panels
const PremiumTrainingPanel = lazy(() => import('../components/TrainingPanel/PremiumTrainingPanel'));
const DietPanel = lazy(() => import('../components/DietPanel'));
const SupplementsPanel = lazy(() => import('../components/SupplementsPanel'));
const ProfilePanel = lazy(() => import('../components/ProfilePanel'));
const PrintPanel = lazy(() => import('../components/print/PrintPanel'));

import UserModal from '../components/UserModal';
import type { UserId, UserInput, User } from '../types/index';
import { getOrCreateCoachCode } from '../lib/supabaseApi';

// Loading Component
const PanelLoadingFallback = () => (
  <div className="flex items-center justify-center p-12">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400">در حال بارگذاری...</p>
    </div>
  </div>
);

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" 
         style={{ animation: 'pulse 4s ease-in-out infinite reverse' }} />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
  </div>
);

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, trend, color, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
    <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  </motion.div>
);

// Quick Action Button
const QuickAction = ({ icon: Icon, label, onClick, color }: any) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-3 p-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-slate-600 transition-all duration-300 hover:scale-105`}
  >
    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-slate-200 font-medium">{label}</span>
    <ChevronRight className="w-5 h-5 text-slate-400 mr-auto group-hover:translate-x-1 transition-transform" />
  </button>
);

// Student Card Component
const StudentCard = ({ student, onClick, onSelect, onEdit, onDelete, isSelected }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    className={`group relative cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border ${isSelected ? 'border-blue-500' : 'border-slate-700/50'} rounded-2xl p-6 hover:border-slate-600 transition-all duration-300`}>
      {/* Action Buttons */}
      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(student);
          }}
          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
          title="ویرایش"
        >
          <Edit size={16} className="text-blue-400" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(student.id);
          }}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          title="حذف"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>

      <div 
        onClick={() => onSelect(student.id)}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {student.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{student.name || 'شاگرد جدید'}</h3>
            <p className="text-slate-400 text-sm">{student.goal || 'هدف تعیین نشده'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-slate-800/50 rounded-xl">
            <div className="text-blue-400 text-sm mb-1">وزن</div>
            <div className="text-white font-bold">{student.weight || '-'}</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-xl">
            <div className="text-purple-400 text-sm mb-1">قد</div>
            <div className="text-white font-bold">{student.height || '-'}</div>
          </div>
          <div className="text-center p-3 bg-slate-800/50 rounded-xl">
            <div className="text-pink-400 text-sm mb-1">سطح</div>
            <div className="text-white font-bold text-xs">{student.level || '-'}</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClick('training'); }}
            className="flex-1 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium transition-colors"
          >
            برنامه تمرین
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClick('nutrition'); }}
            className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 text-sm font-medium transition-colors"
          >
            برنامه تغذیه
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

type TabType = 'dashboard' | 'students' | 'training' | 'nutrition' | 'supplements' | 'print' | 'profile';

export default function CoachDashboard() {
  const { user, signOut, profile } = useAuth();
<<<<<<< HEAD
  const { theme, toggleTheme, printData, handlePrintPreview, closePrintModal, downloadPDF } = useUI();
  const { users, activeUser, addUser, updateUser, deleteUser, setActiveUserId, updateActiveUser } = useData();
=======
  const { theme, toggleTheme } = useUI();
  const { users, selectedUser, setSelectedUser, addUser, updateUser } = useData();
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [coachCode, setCoachCode] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Load coach code
  useEffect(() => {
    const loadCoachCode = async () => {
      if (user?.id) {
        const code = await getOrCreateCoachCode(user.id);
        if (code) setCoachCode(code);
      }
    };
    loadCoachCode();
  }, [user?.id]);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(u => 
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

<<<<<<< HEAD
  // Stats (computed from actual local data structure)
  const stats = useMemo(() => {
    const totalStudents = users.length;
    const activePrograms = users.filter((u) => {
      const hasWorkout = !!u.plans?.workouts && Object.values(u.plans.workouts).some((day) => (day?.length ?? 0) > 0);
      const hasDiet = (u.plans?.diet?.length ?? 0) > 0 || (u.plans?.dietRest?.length ?? 0) > 0;
      const hasSupps = (u.plans?.supps?.length ?? 0) > 0;
      return hasWorkout || hasDiet || hasSupps;
    }).length;

    const plannedExercises = users.reduce((sum, u) => {
      const dayMap = u.plans?.workouts ?? {};
      const count = Object.values(dayMap).reduce((daySum, day) => daySum + (day?.length ?? 0), 0);
      return sum + count;
    }, 0);

    const progressEntries = users.reduce((sum, u) => sum + (u.plans?.prog?.length ?? 0), 0);
    const avgProgressEntries = totalStudents > 0 ? Math.round(progressEntries / totalStudents) : 0;

    return { totalStudents, activePrograms, plannedExercises, avgProgressEntries };
  }, [users]);
=======
  // Stats
  const stats = useMemo(() => ({
    totalStudents: users.length,
    activePrograms: users.filter(u => u.plans?.workouts && Object.keys(u.plans.workouts).length > 0).length,
    completedWorkouts: 0, // TODO: Implement workout logs tracking
    avgProgress: 0 // TODO: Implement progress tracking
  }), [users]);
>>>>>>> cursor/module-redesign-and-data-layer-9fe1

  // Handlers
  const handleAddStudent = useCallback(() => {
    setEditingUser(null);
    setShowUserModal(true);
  }, []);

  const handleSaveStudent = useCallback(async (userData: UserInput) => {
    try {
      if (editingUser && editingUser.id) {
        await updateUser(editingUser.id, userData);
      } else {
        await addUser(userData);
      }
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('خطا در ذخیره اطلاعات');
    }
  }, [editingUser, addUser, updateUser]);

  const handleSelectStudent = useCallback((studentId: UserId) => {
    setActiveUserId(studentId);
    setActiveTab('training');
  }, [setActiveUserId]);

  const handleDeleteStudent = useCallback(async (studentId: UserId) => {
    // DataContext.deleteUser handles confirm + state updates + success UI itself
    // (don't show success toast here; otherwise we'd show it even when user cancels)
    try {
      await deleteUser(studentId);
    } catch {
      toast.error('خطا در حذف شاگرد');
    }
  }, [deleteUser]);
  const handleGeneratePrint = useCallback(
    (type: string, data?: any) => {
      if (!activeUser) {
        toast.error('لطفاً ابتدا یک شاگرد را انتخاب کنید');
        return;
      }

      const programType = data?.programType as 'workout' | 'diet' | 'supplements' | 'all' | undefined;

      // Programs
      if (type === 'program') {
        if (programType === 'workout') {
          handlePrintPreview('training', generateTrainingProgramHTML(activeUser), 'پرینت برنامه تمرینی');
          return;
        }
        if (programType === 'diet') {
          handlePrintPreview('nutrition', generateNutritionProgramHTML(activeUser), 'پرینت برنامه غذایی');
          return;
        }
        if (programType === 'supplements') {
          handlePrintPreview('supplements', generateSupplementProgramHTML(activeUser), 'پرینت برنامه مکمل');
          return;
        }
        if (programType === 'all') {
          const html = [
            generateTrainingProgramHTML(activeUser),
            '<div class="page-break"></div>',
            generateNutritionProgramHTML(activeUser),
            '<div class="page-break"></div>',
            generateSupplementProgramHTML(activeUser)
          ].join('\n');
          handlePrintPreview('all', html, 'پرینت همه برنامه‌ها');
          return;
        }
      }

      // Client report (basic)
      if (type === 'client-report') {
        const html = `
          <div style="font-family: 'Vazirmatn', Tahoma, Arial, sans-serif; direction: rtl; padding: 20px;">
            <h1 style="margin: 0 0 10px;">گزارش شاگرد</h1>
            <p style="margin: 0 0 20px; color: #666;">${activeUser.name || 'بدون نام'} — ${new Date().toLocaleDateString('fa-IR')}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr><td style="border:1px solid #ddd; padding:8px; font-weight:700;">نام</td><td style="border:1px solid #ddd; padding:8px;">${activeUser.name || '-'}</td></tr>
                <tr><td style="border:1px solid #ddd; padding:8px; font-weight:700;">سن</td><td style="border:1px solid #ddd; padding:8px;">${activeUser.age ?? '-'}</td></tr>
                <tr><td style="border:1px solid #ddd; padding:8px; font-weight:700;">قد</td><td style="border:1px solid #ddd; padding:8px;">${activeUser.height ?? '-'}</td></tr>
                <tr><td style="border:1px solid #ddd; padding:8px; font-weight:700;">وزن</td><td style="border:1px solid #ddd; padding:8px;">${activeUser.weight ?? '-'}</td></tr>
                <tr><td style="border:1px solid #ddd; padding:8px; font-weight:700;">هدف</td><td style="border:1px solid #ddd; padding:8px;">${activeUser.goal ?? '-'}</td></tr>
              </tbody>
            </table>
            <div style="margin-top: 16px;">
              <h2 style="margin: 0 0 10px;">یادداشت‌ها</h2>
              <div style="border:1px solid #ddd; padding:12px; min-height:48px;">${activeUser.notes ? String(activeUser.notes) : '-'}</div>
            </div>
          </div>
        `;
        handlePrintPreview('client-report', html, 'گزارش شاگرد');
        return;
      }

      // Progress (basic)
      if (type === 'progress') {
        const prog = activeUser.plans?.prog ?? [];
        const rows = prog
          .map(
            (p) => `
              <tr>
                <td style="border:1px solid #ddd; padding:8px;">${p.date || '-'}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${p.weight ?? '-'}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${p.bf ?? '-'}</td>
                <td style="border:1px solid #ddd; padding:8px;">${p.note ?? '-'}</td>
              </tr>
            `
          )
          .join('');
        const html = `
          <div style="font-family: 'Vazirmatn', Tahoma, Arial, sans-serif; direction: rtl; padding: 20px;">
            <h1 style="margin: 0 0 10px;">گزارش پیشرفت</h1>
            <p style="margin: 0 0 20px; color: #666;">${activeUser.name || 'بدون نام'} — ${new Date().toLocaleDateString('fa-IR')}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background:#f5f5f5;">
                  <th style="border:1px solid #ddd; padding:8px; text-align:right;">تاریخ</th>
                  <th style="border:1px solid #ddd; padding:8px; text-align:center;">وزن</th>
                  <th style="border:1px solid #ddd; padding:8px; text-align:center;">% چربی</th>
                  <th style="border:1px solid #ddd; padding:8px; text-align:right;">یادداشت</th>
                </tr>
              </thead>
              <tbody>
                ${rows || `<tr><td colspan="4" style="border:1px solid #ddd; padding:14px; text-align:center; color:#666;">رکوردی ثبت نشده است</td></tr>`}
              </tbody>
            </table>
          </div>
        `;
        handlePrintPreview('progress', html, 'گزارش پیشرفت');
      }
    },
    [activeUser, handlePrintPreview]
  );

  const copyCoachCode = useCallback(() => {
    if (coachCode) {
      navigator.clipboard.writeText(coachCode);
      toast.success('کد مربی کپی شد');
    }
  }, [coachCode]);

  // Navigation items
  const navItems = [
    { id: 'dashboard' as TabType, icon: Activity, label: 'داشبورد', color: 'from-blue-500 to-cyan-500' },
    { id: 'students' as TabType, icon: Users, label: 'شاگردان', color: 'from-purple-500 to-pink-500' },
    { id: 'training' as TabType, icon: Dumbbell, label: 'برنامه تمرین', color: 'from-orange-500 to-red-500' },
    { id: 'nutrition' as TabType, icon: UtensilsCrossed, label: 'برنامه تغذیه', color: 'from-green-500 to-emerald-500' },
    { id: 'supplements' as TabType, icon: Pill, label: 'مکمل‌ها', color: 'from-pink-500 to-rose-500' },
    { id: 'print' as TabType, icon: Printer, label: 'چاپ', color: 'from-indigo-500 to-blue-500' },
    { id: 'profile' as TabType, icon: BarChart3, label: 'پیشرفت', color: 'from-slate-500 to-slate-600' }
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 relative">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black bg-gradient-to-l from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  فلکس‌پرو
                </h1>
                <p className="text-xs text-slate-400">پنل مربی</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی شاگرد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-800/50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">
                {profile?.full_name?.charAt(0) || 'M'}
              </div>
              <div className="text-sm">
                <div className="font-medium">{profile?.full_name || 'مربی'}</div>
                <div className="text-xs text-slate-400">کد: {coachCode || '...'}</div>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Notifications Dropdown (basic placeholder) */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-4 mt-2 w-[320px] max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800/60">
                <div className="font-bold text-white">اعلان‌ها</div>
                <div className="text-xs text-slate-400">آخرین وضعیت</div>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Bell size={18} className="text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-200 font-semibold">اعلانی برای نمایش وجود ندارد</div>
                    <div className="text-xs text-slate-500 mt-1">
                      بعداً این بخش می‌تواند درخواست‌های برنامه و پیام‌ها را نشان دهد.
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-full text-sm py-3 bg-slate-800/40 hover:bg-slate-800/60 transition-colors text-slate-200"
              >
                بستن
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی شاگرد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 right-0 bottom-0 z-40 w-72 bg-slate-950/80 backdrop-blur-xl border-l border-slate-800/50 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } lg:translate-x-0`}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="mr-auto w-2 h-2 bg-white rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Coach Code Card */}
        <div className="m-4 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">کد معرفی مربی</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-blue-400 font-mono">
              {coachCode || 'در حال بارگذاری...'}
            </code>
            <button
              onClick={copyCoachCode}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pr-72' : ''}`}>
        <div className="p-6 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Welcome Section */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">
                      سلام، {profile?.full_name || 'مربی'} 👋
                    </h2>
                    <p className="text-slate-400">امروز {new Date().toLocaleDateString('fa-IR')}</p>
                  </div>
                  <button
                    onClick={handleAddStudent}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    <Plus size={20} />
                    <span>افزودن شاگرد</span>
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Users}
                    label="تعداد شاگردان"
                    value={stats.totalStudents}
                    trend={8}
                    color="from-blue-500 to-cyan-500"
                    delay={0}
                  />
                  <StatCard
                    icon={Dumbbell}
                    label="برنامه‌های فعال"
                    value={stats.activePrograms}
                    trend={12}
                    color="from-purple-500 to-pink-500"
                    delay={0.1}
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="حرکات ثبت شده"
                    value={stats.plannedExercises}
                    trend={15}
                    color="from-green-500 to-emerald-500"
                    delay={0.2}
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="میانگین رکوردهای پیشرفت"
                    value={stats.avgProgressEntries}
                    trend={5}
                    color="from-orange-500 to-red-500"
                    delay={0.3}
                  />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <QuickAction
                    icon={Plus}
                    label="افزودن شاگرد جدید"
                    onClick={handleAddStudent}
                    color="from-blue-500 to-cyan-500"
                  />
                  <QuickAction
                    icon={Dumbbell}
                    label="طراحی برنامه تمرین"
                    onClick={() => setActiveTab('training')}
                    color="from-purple-500 to-pink-500"
                  />
                  <QuickAction
                    icon={UtensilsCrossed}
                    label="طراحی برنامه تغذیه"
                    onClick={() => setActiveTab('nutrition')}
                    color="from-green-500 to-emerald-500"
                  />
                </div>

                {/* Recent Students */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">شاگردان اخیر</h3>
                    <button
                      onClick={() => setActiveTab('students')}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                      مشاهده همه
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.slice(0, 6).map((student) => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        isSelected={String(activeUser?.id) === String(student.id)}
                        onClick={(tab: TabType) => {
                          setActiveUserId(student.id);
                          setActiveTab(tab);
                        }}
                        onSelect={handleSelectStudent}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                      />
                    ))}
                  </div>
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400">هنوز شاگردی اضافه نشده</p>
                      <button
                        onClick={handleAddStudent}
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        افزودن اولین شاگرد
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">لیست شاگردان</h2>
                  <button
                    onClick={handleAddStudent}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    <Plus size={20} />
                    افزودن شاگرد
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      isSelected={String(activeUser?.id) === String(student.id)}
                      onClick={(tab: TabType) => {
                        setActiveUserId(student.id);
                        setActiveTab(tab);
                      }}
                      onSelect={handleSelectStudent}
                      onEdit={handleEditStudent}
                      onDelete={handleDeleteStudent}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Training Tab */}
            {activeTab === 'training' && (
              <Suspense fallback={<PanelLoadingFallback />}>
<<<<<<< HEAD
                <TrainingPanel activeUser={activeUser ?? undefined} onUpdateUser={updateActiveUser} />
=======
                {selectedUser ? (
                  (() => {
                    const activeUser = users.find(u => u.id === selectedUser);
                    if (!activeUser) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-slate-400">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                        </div>
                      );
                    }
                    return (
                      <PremiumTrainingPanel 
                        activeUser={activeUser}
                        onUpdateUser={(updatedUser) => {
                          updateUser(updatedUser.id, updatedUser);
                        }}
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-400 mb-4">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      افزودن شاگرد
                    </button>
                  </div>
                )}
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
              </Suspense>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <Suspense fallback={<PanelLoadingFallback />}>
<<<<<<< HEAD
                <DietPanel activeUser={activeUser ?? undefined} onUpdateUser={updateActiveUser} />
=======
                {selectedUser ? (
                  (() => {
                    const activeUser = users.find(u => u.id === selectedUser);
                    if (!activeUser) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-slate-400">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                        </div>
                      );
                    }
                    return (
                      <DietPanel 
                        activeUser={activeUser} 
                        onUpdateUser={(updatedUser) => {
                          updateUser(updatedUser.id, updatedUser);
                        }} 
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-400 mb-4">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      افزودن شاگرد
                    </button>
                  </div>
                )}
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
              </Suspense>
            )}

            {/* Supplements Tab */}
            {activeTab === 'supplements' && (
<<<<<<< HEAD
              activeUser ? (
                <Suspense fallback={<PanelLoadingFallback />}>
                  <SupplementsPanel activeUser={activeUser as User} onUpdateUser={updateActiveUser} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Pill className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-slate-400">لطفا ابتدا یک کاربر را انتخاب کنید</p>
                  </div>
                </div>
              )
=======
              <Suspense fallback={<PanelLoadingFallback />}>
                {selectedUser ? (
                  (() => {
                    const activeUser = users.find(u => u.id === selectedUser);
                    if (!activeUser) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-slate-400">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                        </div>
                      );
                    }
                    return (
                      <SupplementsPanel 
                        activeUser={activeUser} 
                        onUpdateUser={(updatedUser) => {
                          updateUser(updatedUser.id, updatedUser);
                        }} 
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-400 mb-4">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      افزودن شاگرد
                    </button>
                  </div>
                )}
              </Suspense>
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
            )}

            {/* Print Tab */}
            {activeTab === 'print' && (
<<<<<<< HEAD
              activeUser ? (
                <Suspense fallback={<PanelLoadingFallback />}>
                  <PrintPanel user={activeUser as User} onGeneratePrint={handleGeneratePrint} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Printer className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-slate-400">لطفا ابتدا یک کاربر را انتخاب کنید</p>
                  </div>
                </div>
              )
=======
              <Suspense fallback={<PanelLoadingFallback />}>
                {selectedUser ? (
                  (() => {
                    const activeUser = users.find(u => u.id === selectedUser);
                    if (!activeUser) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-slate-400">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                        </div>
                      );
                    }
                    return (
                      <PrintPanel 
                        user={activeUser}
                        onGeneratePrint={(type, data) => {
                          console.log('Print requested:', type, data);
                          toast.success('در حال آماده‌سازی برای پرینت...');
                        }}
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-400 mb-4">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      افزودن شاگرد
                    </button>
                  </div>
                )}
              </Suspense>
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
<<<<<<< HEAD
              activeUser ? (
                <Suspense fallback={<PanelLoadingFallback />}>
                  <ProfilePanel activeUser={activeUser as User} onUpdateUser={updateActiveUser} />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-slate-400">لطفا ابتدا یک کاربر را انتخاب کنید</p>
                  </div>
                </div>
              )
=======
              <Suspense fallback={<PanelLoadingFallback />}>
                {selectedUser ? (
                  (() => {
                    const activeUser = users.find(u => u.id === selectedUser);
                    if (!activeUser) {
                      return (
                        <div className="text-center py-12">
                          <p className="text-slate-400">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                        </div>
                      );
                    }
                    return (
                      <ProfilePanel 
                        activeUser={activeUser}
                        onUpdateUser={(updatedUser) => {
                          updateUser(updatedUser.id, updatedUser);
                        }}
                      />
                    );
                  })()
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-400 mb-4">لطفاً ابتدا یک شاگرد انتخاب کنید</p>
                    <button
                      onClick={handleAddStudent}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      افزودن شاگرد
                    </button>
                  </div>
                )}
              </Suspense>
>>>>>>> cursor/module-redesign-and-data-layer-9fe1
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Print Modal (global for coach dashboard) */}
      {printData && (
        <PrintModal
          data={printData}
          onClose={closePrintModal}
          onDownload={downloadPDF}
        />
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
          }}
          onSave={handleSaveStudent}
          initialData={editingUser ? editingUser as User : undefined}
        />
      )}
    </div>
  );
}
