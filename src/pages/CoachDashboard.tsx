import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useData } from '../context/DataContext';

// Lazy load heavy panel components
const TrainingPanel = lazy(() => import('../components/TrainingPanel'));
const DietPanel = lazy(() => import('../components/DietPanel'));
const SupplementsPanel = lazy(() => import('../components/SupplementsPanel'));
const ProfilePanel = lazy(() => import('../components/ProfilePanel'));

// Loading component for lazy-loaded panels
const PanelLoadingFallback = () => (
  <div className="flex items-center justify-center p-8 bg-[var(--glass-bg)] rounded-2xl border border-[var(--glass-border)]">
    <div className="text-center space-y-4">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--accent-color)] border-r-transparent"></div>
      <p className="text-sm text-[var(--text-secondary)]">در حال بارگذاری...</p>
    </div>
  </div>
);
import UserModal from '../components/UserModal';
import PrintModal from '../components/PrintModal';
import PrintPanel from '../components/print/PrintPanel';
import ClientInfoPanel from '../components/ClientInfoPanel';
import SupabaseDebug from '../components/SupabaseDebug';
import type { UserId, UserInput, Client } from '../types/index';
import { fetchClientById, fetchWorkoutPlansByClient, isSupabaseReady, getOrCreateCoachCode, upsertClient } from '../lib/supabaseApi';
import { supabase } from '../lib/supabaseClient';
import { mapClientToUser } from '../context/DataContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Users,
  Dumbbell,
  UtensilsCrossed,
  Pill,
  Printer,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Plus,
  Edit,
  Activity,
  Award,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Bell,
  Briefcase,
  Calendar,
  Copy,
  Database,
  Eye,
  Globe,
  GraduationCap,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Target,
  Zap,
  Trash2
} from 'lucide-react';

// Import React Bits components
import { StatCounter, HoverCard, FloatingActionButton, ExpandableFab } from '../components';
import type { ProgramRequest } from '../types/index';

// ========== Types ==========
type TabType = 'dashboard' | 'students' | 'training' | 'nutrition' | 'supplements' | 'print' | 'profile';
type StudentsSubTab = 'list' | 'requests' | 'info';

// ========== Animation Variants ==========
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9 }
};

// Advanced animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
      duration: 0.6
    }
  }
};

// ========== Reusable Components ==========
const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}> = ({ children, className = '', glowColor = 'var(--accent-color)', onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative group glass-card rounded-2xl border border-[var(--glass-border)] overflow-hidden transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{
      boxShadow: `0 0 0 1px ${glowColor}10`,
    }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}15, transparent 40%)`
      }}
    />
    {children}
  </motion.div>
);

// Achievement Notification Component
const AchievementPopup: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
  onClose: () => void;
}> = ({ title, description, icon, color, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 50 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 50 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <motion.div
      className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="text-6xl mb-4"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 0.8, repeat: 1 }}
      >
        {icon}
      </motion.div>

      <motion.h3
        className="text-2xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="text-slate-400 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {description}
      </motion.p>

      <motion.button
        onClick={onClose}
        className={`px-6 py-3 bg-gradient-to-r ${color} text-white rounded-xl font-bold hover:scale-105 transition-transform`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        عالی! 🎉
      </motion.button>

      {/* Confetti effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * 400,
              y: 300,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: 3
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// Smart Reminder Component
const SmartReminder: React.FC<{
  type: 'workout' | 'nutrition' | 'supplement' | 'session';
  title: string;
  message: string;
  clientName?: string;
  onAction?: () => void;
  onDismiss: () => void;
}> = ({ type, title, message, clientName, onAction, onDismiss }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'workout':
        return {
          icon: '🏋️',
          color: 'from-[var(--color-info)] to-[var(--accent-secondary)]',
          bgColor: 'bg-[var(--color-info)]/10 border-[var(--color-info)]/20'
        };
      case 'nutrition':
        return {
          icon: '🥗',
          color: 'from-[var(--color-success)] to-emerald-600',
          bgColor: 'bg-[var(--color-success)]/10 border-[var(--color-success)]/20'
        };
      case 'supplement':
        return {
          icon: '💊',
          color: 'from-[var(--color-warning)] to-[var(--color-error)]',
          bgColor: 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20'
        };
      case 'session':
        return {
          icon: '📅',
          color: 'from-[var(--accent-secondary)] to-pink-600',
          bgColor: 'bg-[var(--accent-secondary)]/10 border-[var(--accent-secondary)]/20'
        };
      default:
        return {
          icon: '🔔',
          color: 'from-[var(--text-secondary)] to-[var(--text-secondary)]',
          bgColor: 'bg-[var(--glass-bg)] border-[var(--glass-border)]'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className="fixed top-4 left-4 right-4 z-40 max-w-md mx-auto"
    >
      <div className={`relative ${config.bgColor} border rounded-2xl p-4 shadow-xl backdrop-blur-sm`}>
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>

        <div className="flex items-start gap-3">
          {/* Icon */}
          <motion.div
            className="text-2xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {config.icon}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white mb-1">
              {title}
              {clientName && (
                <span className="text-slate-400 mr-2">- {clientName}</span>
              )}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {message}
            </p>

            {/* Action button */}
            {onAction && (
              <motion.button
                onClick={onAction}
                className={`mt-3 px-4 py-2 bg-gradient-to-r ${config.color} text-white text-xs font-semibold rounded-lg hover:scale-105 transition-transform`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                مشاهده
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-b-2xl"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 10, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

const StatCard: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  trend?: { value: number; positive: boolean };
  gradient: string;
  delay?: number;
}> = ({ icon, label, value, trend, gradient, delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    className="relative overflow-hidden glass-card p-6 rounded-2xl border border-[var(--glass-border)] group hover:border-[var(--accent-color)]/30 transition-all duration-500"
  >
    {/* Background Gradient */}
    <div 
      className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"
      style={{ background: gradient }}
    />
    
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-4xl font-black text-[var(--text-primary)] mb-1">{value}</p>
        <p className="text-sm text-[var(--text-secondary)] font-medium">{label}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            <TrendingUp size={14} className={trend.positive ? '' : 'rotate-180'} />
            <span>{trend.value}% از ماه قبل</span>
          </div>
        )}
      </div>
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
        style={{ background: gradient }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
  collapsed?: boolean;
}> = ({ icon, label, active, onClick, badge, collapsed }) => (
  <motion.button
    whileHover={{
      x: collapsed ? 0 : 6,
      scale: 1.02,
      boxShadow: active ? "0 10px 25px -5px rgba(var(--accent-color-rgb), 0.4)" : "0 4px 12px -2px rgba(0,0,0,0.1)"
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
      active
        ? 'bg-gradient-to-l from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 text-white shadow-xl shadow-[var(--accent-color)]/40 border border-white/20'
        : 'text-[var(--text-secondary)] hover:bg-gradient-to-r hover:from-[var(--glass-bg)] hover:to-white/5 hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--glass-border)]'
    }`}
  >
    {/* Background glow effect */}
    {active && (
      <motion.div
        layoutId="activeGlow"
        className="absolute inset-0 bg-gradient-to-l from-white/10 to-transparent rounded-2xl"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}

    <motion.span
      className={`relative z-10 transition-all duration-300 ${active ? 'scale-110 text-white' : 'group-hover:scale-110 group-hover:text-[var(--accent-color)]'}`}
      whileHover={{ rotate: active ? 0 : 5 }}
    >
      {icon}
    </motion.span>

    {!collapsed && (
      <motion.span
        className={`relative z-10 font-semibold text-sm transition-all duration-300 ${
          active ? 'text-white font-bold' : 'group-hover:text-[var(--text-primary)]'
        }`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {label}
      </motion.span>
    )}

    {/* Badge with enhanced animation */}
    {badge !== undefined && badge > 0 && (
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 min-w-[24px] h-[24px] rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs flex items-center justify-center font-bold px-1.5 shadow-lg border-2 border-white/30"
      >
        {badge > 99 ? '99+' : badge}
      </motion.span>
    )}

    {/* Hover indicator */}
    <motion.div
      className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-l-full opacity-0 group-hover:opacity-100"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  </motion.button>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, label, sublabel, onClick, gradient }) => (
  <GlowCard onClick={onClick} glowColor={gradient.includes('blue') ? '#3b82f6' : gradient.includes('emerald') ? '#10b981' : '#8b5cf6'}>
    <div className="p-5">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg"
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <p className="font-bold text-[var(--text-primary)]">{label}</p>
      {sublabel && <p className="text-xs text-[var(--text-secondary)] mt-1">{sublabel}</p>}
    </div>
  </GlowCard>
);

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon, title, description, action }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <motion.div 
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)]"
    >
      {icon}
    </motion.div>
    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">{title}</h3>
    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">{description}</p>
    {action && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action.onClick}
        className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-[var(--accent-color)]/30"
        style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' }}
      >
        {action.label}
      </motion.button>
    )}
  </motion.div>
);

// ========== Main Component ==========
const CoachDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, printData, closePrintModal, downloadPDF } = useUI();
  const {
    users,
    requests,
    activeUser,
    activeUserId,
    saveUser,
    deleteUser,
    acceptRequest,
    rejectRequest,
    deleteRequest,
    updateActiveUser,
    backupData,
    restoreData,
    setActiveUserId,
    refreshData
  } = useData();


  // ========== State ==========
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    const saved = localStorage.getItem('coach_current_tab');
    return (saved as TabType) || 'dashboard';
  });
  const [studentsSubTab, setStudentsSubTab] = useState<StudentsSubTab>('list');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('coach_sidebar_open');
    return saved !== 'false';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<UserId | null>(null);
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isSupabaseDebugOpen, setIsSupabaseDebugOpen] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [coachCode, setCoachCode] = useState<string | null>(null);

  // Achievement system
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementData, setAchievementData] = useState<{
    title: string;
    description: string;
    icon: string;
    color: string;
  } | null>(null);

  // Smart Reminders System
  const [showReminder, setShowReminder] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<{
    type: 'workout' | 'nutrition' | 'supplement' | 'session';
    title: string;
    message: string;
    clientName?: string;
    action?: () => void;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const itemsPerPage = 8;

  // Compute activeUser locally to ensure it updates immediately
  const localActiveUser = useMemo(() => {
    if (activeUserId == null) return null;
    const targetId = String(activeUserId);
    return users.find(u => String(u.id) === targetId) || null;
  }, [users, activeUserId]);
  
  // پروفایل مربی
  const [coachProfile, setCoachProfile] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    nationalId: '',
    birthDate: '',
    city: '',
    address: '',
    specialization: '',
    certifications: '',
    experience: '',
    education: '',
    bio: '',
    instagram: '',
    telegram: '',
    whatsapp: '',
    website: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Ensure data is loaded when component mounts
  React.useEffect(() => {
    if (user?.id) {
      refreshData();
    }
  }, [user?.id, refreshData]);

  // Also refresh data when currentTab changes to students
  React.useEffect(() => {
    if (currentTab === 'students' && user?.id) {
      refreshData();
    }
  }, [currentTab, user?.id, refreshData]);

  // ========== Effects ==========
  // ذخیره وضعیت تب در localStorage
  useEffect(() => {
    localStorage.setItem('coach_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('coach_sidebar_open', String(sidebarOpen));
  }, [sidebarOpen]);

  // Cleanup effect برای جلوگیری از memory leaks
  useEffect(() => {
    return () => {
      // Cleanup اگر نیاز باشد در آینده
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // بارگذاری پروفایل مربی از localStorage
    const savedProfile = localStorage.getItem(`coach_profile_${user.id}`);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setCoachProfile(prev => ({ ...prev, ...parsed }));
      } catch (err: unknown) {
        if (import.meta.env.DEV) console.warn('Failed to parse coach profile', err);
      }
    }

    // بارگذاری کد مربی
    getOrCreateCoachCode(user.id).then(setCoachCode);

  }, [user?.id]);

  // بارگذاری پروفایل از Supabase به صورت جداگانه
  useEffect(() => {
    if (!user?.id || !isSupabaseReady || !supabase) return;

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setCoachProfile(prev => ({
            ...prev,
            fullName: data.full_name || prev.fullName,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            ...(typeof data.profile_data === 'object' ? data.profile_data : {})
          }));
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.error('Error loading coach profile from Supabase:', error);
      });
  }, [user?.id, isSupabaseReady, supabase]);

  // بارگذاری اطلاعات شاگرد انتخاب شده
  useEffect(() => {
    if (!localActiveUser || studentsSubTab !== 'info') return;

    setProfileLoading(true);
    Promise.all([
      fetchClientById(String(localActiveUser.id)),
      fetchWorkoutPlansByClient(String(localActiveUser.id))
    ])
      .then(([clientRes, plansRes]) => {
        if (clientRes.data) {
          setClientProfile(clientRes.data);
          const plan = plansRes.data?.[0];
          if (isSupabaseReady && plan) {
            updateActiveUser(mapClientToUser(clientRes.data, plan));
          }
        }
      })
      .catch((err: unknown) => {
        if (import.meta.env.DEV) console.error('Error fetching client', err);
      })
      .finally(() => setProfileLoading(false));
  }, [localActiveUser, studentsSubTab, updateActiveUser]);

  // ========== Computed ==========

  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(term) ||
        u.phone?.includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'fa');
      }
      return 0;
    });

    return result;
  }, [users, searchTerm, sortBy]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'pending'), [requests]);
  const acceptedRequests = useMemo(() => requests.filter(r => r.status === 'accepted'), [requests]);

  const stats = useMemo(() => ({
    totalStudents: users.length,
    pendingRequests: pendingRequests.length,
    acceptedRequests: acceptedRequests.length,
    activePrograms: users.filter(u => u.plans?.workouts && Object.keys(u.plans.workouts).length > 0).length,
  }), [users, pendingRequests.length, acceptedRequests.length]);

  // ========== Achievement Logic ==========
  useEffect(() => {
    // Check for achievements
    if (users.length >= 5 && !localStorage.getItem('achievement_5_students')) {
      setAchievementData({
        title: 'مربی حرفه‌ای! 🏆',
        description: 'تبریک! شما ۵ شاگرد دارید. مسیر موفقیت را شروع کرده‌اید!',
        icon: '🏆',
        color: 'from-yellow-400 to-orange-500'
      });
      setShowAchievement(true);
      localStorage.setItem('achievement_5_students', 'true');
    }

    if (stats.acceptedRequests >= 10 && !localStorage.getItem('achievement_10_requests')) {
      setAchievementData({
        title: 'پذیرش‌کننده عالی! 🎯',
        description: '۱۰ درخواست برنامه را با موفقیت تأیید کرده‌اید!',
        icon: '🎯',
        color: 'from-green-400 to-emerald-500'
      });
      setShowAchievement(true);
      localStorage.setItem('achievement_10_requests', 'true');
    }
  }, [users.length, stats.acceptedRequests]);

  // ========== Smart Reminders Logic ==========
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Workout reminder (every day at 6 AM and 6 PM)
      if ((currentHour === 6 || currentHour === 18) && currentMinute === 0) {
        setCurrentReminder({
          type: 'workout',
          title: 'زمان تمرین!',
          message: 'شاگردان شما منتظر برنامه تمرینی امروز هستند. برنامه‌ها را چک کنید.',
          action: () => setCurrentTab('training')
        });
        setShowReminder(true);
      }

      // Nutrition reminder (meal times)
      if ((currentHour === 7 || currentHour === 12 || currentHour === 19) && currentMinute === 30) {
        const mealType = currentHour === 7 ? 'صبحانه' : currentHour === 12 ? 'ناهار' : 'شام';
        setCurrentReminder({
          type: 'nutrition',
          title: `یادآوری تغذیه - ${mealType}`,
          message: 'زمان وعده غذایی فرا رسیده. برنامه‌های غذایی شاگردان را چک کنید.',
          action: () => setCurrentTab('nutrition')
        });
        setShowReminder(true);
      }

      // Supplement reminder (twice a day)
      if ((currentHour === 8 || currentHour === 20) && currentMinute === 0) {
        setCurrentReminder({
          type: 'supplement',
          title: 'یادآوری مکمل‌ها',
          message: 'زمان مصرف مکمل‌های روزانه فرا رسیده.',
          action: () => setCurrentTab('supplements')
        });
        setShowReminder(true);
      }

      // Session reminder (check for upcoming sessions)
      if (currentMinute === 0 && [9, 10, 14, 15, 16, 17].includes(currentHour)) {
        setCurrentReminder({
          type: 'session',
          title: 'یادآوری جلسه',
          message: 'بررسی کنید آیا جلسات برنامه‌ریزی شده‌ای دارید.',
          action: () => setCurrentTab('students')
        });
        setShowReminder(true);
      }
    };

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);

    // Initial check
    checkReminders();

    return () => clearInterval(interval);
  }, [currentTab]);

  // ========== Handlers ==========
  const handleSaveCoachProfile = async () => {
    if (!user?.id) return;
    setSavingProfile(true);
    
    try {
      localStorage.setItem(`coach_profile_${user.id}`, JSON.stringify(coachProfile));
      
      if (isSupabaseReady && supabase) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: coachProfile.fullName,
          email: coachProfile.email,
          phone: coachProfile.phone,
          profile_data: coachProfile
        });
      }
      
      const newCode = await getOrCreateCoachCode(user.id);
      setCoachCode(newCode);
      
      toast.success('پروفایل با موفقیت ذخیره شد');
    } catch (err: unknown) {
      toast.error('خطا در ذخیره پروفایل');
      if (import.meta.env.DEV) console.error('handleSaveCoachProfile error', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAcceptRequest = useCallback(async (req: ProgramRequest) => {
    await acceptRequest(req);

    // Navigate to student info tab
    setActiveUserId(req.client_id);
    setStudentsSubTab('info');
    setCurrentTab('students');
  }, [acceptRequest]);

  const handleRejectRequest = useCallback(async (req: ProgramRequest) => {
    await rejectRequest(req);
  }, [rejectRequest]);

  const handleDeleteRequest = useCallback(async (req: ProgramRequest) => {
    setDeletingRequestId(req.id);
    try {
      await deleteRequest(req.id);
    } finally {
      setDeletingRequestId(null);
    }
  }, [deleteRequest]);

  const handleGeneratePrint = useCallback(async (type: string, data: any) => {
    try {
      let html = '';
      let title = '';

      switch (type) {
        case 'program':
          const { programType } = data;
          title = `برنامه ${programType === 'workout' ? 'تمرینی' : programType === 'diet' ? 'غذایی' : 'مکمل'} - ${data.user.name}`;
          html = generateProgramHTML(data.user, programType);
          break;
        case 'client-report':
          title = `گزارش شاگرد - ${data.name}`;
          html = generateClientReportHTML(data);
          break;
        case 'progress':
          title = `گزارش پیشرفت - ${data.name}`;
          html = generateProgressHTML(data);
          break;
        default:
          throw new Error('نوع پرینت نامعتبر');
      }

      setPrintData({
        html,
        title,
        type: type as 'program' | 'client-report' | 'progress'
      });
    } catch (error) {
      console.error('Error generating print:', error);
      toast.error('خطا در تولید فایل پرینت');
    }
  }, []);

  // HTML Generation Functions
  const generateProgramHTML = (user: User, programType: string): string => {
    const title = programType === 'workout' ? 'برنامه تمرینی' :
                  programType === 'diet' ? 'برنامه غذایی' :
                  programType === 'supplements' ? 'برنامه مکمل' :
                  programType === 'all' ? 'برنامه کامل' : 'برنامه';

    let contentHtml = '';

    if ((programType === 'workout' || programType === 'all') && user.plans?.workouts) {
      contentHtml += `
        <div class="print-section">
          <h2 style="color: #1e293b; margin-bottom: 16pt; font-size: 16pt;">🏋️ برنامه تمرینی هفتگی</h2>
      `;

      Object.entries(user.plans.workouts).forEach(([day, exercises]) => {
        contentHtml += `
          <div class="print-section no-break">
            <h3 style="color: #334155; margin-bottom: 12pt; font-size: 14pt; border-bottom: 1pt solid #e2e8f0; padding-bottom: 4pt;">${day}</h3>
        `;

        if (Array.isArray(exercises) && exercises.length > 0) {
          contentHtml += `
            <table class="workout-table">
              <thead>
                <tr>
                  <th>تمرین</th>
                  <th>ست</th>
                  <th>تکرار</th>
                  <th>وزنه/زمان</th>
                  <th>استراحت</th>
                </tr>
              </thead>
              <tbody>
          `;

          exercises.forEach((exercise: any) => {
            contentHtml += `
              <tr>
                <td class="exercise-name">${exercise.name || 'تمرین'}</td>
                <td>${exercise.sets || '-'}</td>
                <td>${exercise.reps || '-'}</td>
                <td>${exercise.weight || exercise.duration || '-'}</td>
                <td>${exercise.rest || '-'}</td>
              </tr>
            `;
          });

          contentHtml += `
              </tbody>
            </table>
          `;
        } else {
          contentHtml += '<p style="color: #64748b; font-style: italic;">هیچ تمرینی برای این روز برنامه‌ریزی نشده است.</p>';
        }

        contentHtml += '</div>';
      });

      contentHtml += '</div>';

      // Add page break before diet section if printing all
      if (programType === 'all') {
        contentHtml += '<div class="section-break"></div>';
      }
    }

    if ((programType === 'diet' || programType === 'all') && user.plans?.diet) {
      contentHtml += `
        <div class="print-section">
          <h2 style="color: #065f46; margin-bottom: 16pt; font-size: 16pt;">🥗 برنامه غذایی روزانه</h2>
      `;

      user.plans.diet.forEach((meal: any, index: number) => {
        contentHtml += `
          <div class="meal-card no-break">
            <h4 class="meal-name">وعده ${index + 1}: ${meal.name || 'وعده غذایی'}</h4>
            <div class="meal-description">
              ${meal.description || 'توضیحی برای این وعده غذایی موجود نیست.'}
            </div>
            ${meal.ingredients ? `<div style="margin-top: 8pt; font-size: 9pt; color: #6b7280;">مواد تشکیل‌دهنده: ${meal.ingredients}</div>` : ''}
            ${meal.calories ? `<div style="margin-top: 4pt; font-size: 9pt; color: #059669; font-weight: 600;">کالری: ${meal.calories}</div>` : ''}
          </div>
        `;
      });

      contentHtml += '</div>';

      // Add page break before supplements section if printing all
      if (programType === 'all') {
        contentHtml += '<div class="section-break"></div>';
      }
    }

    if ((programType === 'supplements' || programType === 'all') && user.plans?.supps) {
      contentHtml += `
        <div class="print-section">
          <h2 style="color: #92400e; margin-bottom: 16pt; font-size: 16pt;">💊 برنامه مکمل‌های غذایی</h2>
      `;

      user.plans.supps.forEach((supp: any) => {
        contentHtml += `
          <div class="supplement-card no-break">
            <div class="supplement-name">${supp.name || 'مکمل'}</div>
            <div class="supplement-details">
              ${supp.dosage ? `میزان مصرف: ${supp.dosage}` : ''}
              ${supp.timing ? `زمان مصرف: ${supp.timing}` : ''}
              ${supp.notes ? `<br>توضیحات: ${supp.notes}` : ''}
            </div>
          </div>
        `;
      });

      contentHtml += '</div>';
    }

    // Wrap everything in the premium layout structure
    const html = `
      <div class="print-header">
        <div class="header-logo">FLEXPRO</div>
        <div class="header-client-info">
          <div class="client-name">${user.name}</div>
          <div class="client-date">${new Date().toLocaleDateString('fa-IR')}</div>
        </div>
      </div>

      <div class="watermark">FLEXPRO</div>

      <div style="text-align: center; margin: 24pt 0 32pt 0;">
        <h1 style="font-size: 24pt; margin-bottom: 8pt; color: #1f2937;">${title}</h1>
        <p style="font-size: 12pt; color: #6b7280;">برنامه اختصاصی ${user.name}</p>
      </div>

      ${contentHtml}

      <div class="print-footer">
        <div class="page-info">صفحه <span class="page-number"></span></div>
        <div class="coach-info">FlexPro - مربی شخصی حرفه‌ای</div>
      </div>
    `;

    return html;
  };

  const generateClientReportHTML = (user: User): string => {
    return `
      <div class="print-header">
        <div class="header-logo">FLEXPRO</div>
        <div class="header-client-info">
          <div class="client-name">${user.name}</div>
          <div class="client-date">${new Date().toLocaleDateString('fa-IR')}</div>
        </div>
      </div>

      <div class="watermark">FLEXPRO</div>

      <div style="text-align: center; margin: 24pt 0 32pt 0;">
        <h1 style="font-size: 24pt; margin-bottom: 8pt; color: #1f2937;">گزارش اطلاعات شاگرد</h1>
        <p style="font-size: 12pt; color: #6b7280;">گزارش کامل ${user.name}</p>
      </div>

      <div class="print-section">
        <h2 style="color: #1e293b; margin-bottom: 16pt; font-size: 16pt;">👤 اطلاعات شخصی</h2>
        <div class="exercise-card no-break">
          <table class="workout-table" style="margin: 0;">
            <tbody>
              <tr>
                <td style="font-weight: 600; width: 30%;">نام:</td>
                <td>${user.name}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">جنسیت:</td>
                <td>${user.gender === 'male' ? 'آقا' : user.gender === 'female' ? 'خانم' : 'نامشخص'}</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">سن:</td>
                <td>${user.age} سال</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">قد:</td>
                <td>${user.height} سانتی‌متر</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">وزن:</td>
                <td>${user.weight} کیلوگرم</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">سطح تمرینی:</td>
                <td>${user.level || 'نامشخص'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="print-section">
        <h2 style="color: #1e293b; margin-bottom: 16pt; font-size: 16pt;">📊 آمار برنامه‌ها</h2>
        <div class="exercise-card no-break">
          <table class="workout-table" style="margin: 0;">
            <tbody>
              <tr>
                <td style="font-weight: 600; width: 40%;">برنامه تمرینی:</td>
                <td style="color: #3b82f6; font-weight: 700;">${user.plans?.workouts ? Object.keys(user.plans.workouts).length : 0} برنامه</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">وعده غذایی:</td>
                <td style="color: #10b981; font-weight: 700;">${user.plans?.diet ? user.plans.diet.length : 0} وعده</td>
              </tr>
              <tr>
                <td style="font-weight: 600;">مکمل غذایی:</td>
                <td style="color: #f59e0b; font-weight: 700;">${user.plans?.supps ? user.plans.supps.length : 0} مکمل</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      ${user.nutritionGoals ? `
        <div class="print-section">
          <h2 style="color: #065f46; margin-bottom: 16pt; font-size: 16pt;">🥗 اهداف تغذیه‌ای</h2>
          <div class="meal-card no-break">
            ${user.nutritionGoals.calories ? `<div style="margin-bottom: 8pt;"><strong style="color: #065f46;">کالری روزانه:</strong> ${user.nutritionGoals.calories} kcal</div>` : ''}
            ${user.nutritionGoals.protein ? `<div style="margin-bottom: 8pt;"><strong style="color: #065f46;">پروتئین:</strong> ${user.nutritionGoals.protein}g</div>` : ''}
            ${user.nutritionGoals.carbs ? `<div style="margin-bottom: 8pt;"><strong style="color: #065f46;">کربوهیدرات:</strong> ${user.nutritionGoals.carbs}g</div>` : ''}
            ${user.nutritionGoals.fat ? `<div style="margin-bottom: 8pt;"><strong style="color: #065f46;">چربی:</strong> ${user.nutritionGoals.fat}g</div>` : ''}
          </div>
        </div>
      ` : ''}

      ${user.notes ? `
        <div class="print-section">
          <h2 style="color: #7c3aed; margin-bottom: 16pt; font-size: 16pt;">📝 یادداشت‌ها</h2>
          <div class="exercise-card no-break">
            <p style="line-height: 1.6; margin: 0; color: #374151;">${user.notes}</p>
          </div>
        </div>
      ` : ''}

      <div class="print-footer">
        <div class="page-info">صفحه <span class="page-number"></span></div>
        <div class="coach-info">FlexPro - مربی شخصی حرفه‌ای</div>
      </div>
    `;
  };

  const generateProgressHTML = (user: User): string => {
    const calculateBMI = () => {
      if (!user.height || !user.weight) return null;
      const heightInMeters = user.height / 100;
      return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const bmi = calculateBMI();
    const getBMICategory = (bmi: number) => {
      if (bmi < 18.5) return 'کم‌وزن';
      if (bmi < 25) return 'طبیعی';
      if (bmi < 30) return 'اضافه وزن';
      if (bmi < 35) return 'چاقی درجه ۱';
      if (bmi < 40) return 'چاقی درجه ۲';
      return 'چاقی درجه ۳';
    };

    return `
      <div style="font-family: 'Vazirmatn', sans-serif; direction: rtl; padding: 40px; background: white;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #10b981; padding-bottom: 20px;">
          <h1 style="color: #1f2937; font-size: 28px; margin: 0;">گزارش پیشرفت و شاخص‌ها</h1>
          <h2 style="color: #6b7280; font-size: 20px; margin: 10px 0;">${user.name}</h2>
          <p style="color: #9ca3af; font-size: 14px;">${new Date().toLocaleDateString('fa-IR')}</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">${bmi || 'N/A'}</div>
            <div style="color: #6b7280; font-size: 14px;">شاخص توده بدنی (BMI)</div>
            ${bmi ? `<div style="color: #9ca3af; font-size: 12px; margin-top: 5px;">${getBMICategory(parseFloat(bmi))}</div>` : ''}
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #06b6d4; margin-bottom: 10px;">${user.height || 'N/A'}</div>
            <div style="color: #6b7280; font-size: 14px;">قد (cm)</div>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #10b981; margin-bottom: 10px;">${user.weight || 'N/A'}</div>
            <div style="color: #6b7280; font-size: 14px;">وزن (kg)</div>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin-bottom: 10px;">${user.age || 'N/A'}</div>
            <div style="color: #6b7280; font-size: 14px;">سن</div>
          </div>
        </div>

        ${bmi ? `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
          <h3 style="color: #1e40af; margin-bottom: 10px;">تحلیل BMI</h3>
          <p style="color: #3730a3;">شاخص توده بدنی شما ${bmi} است که در دسته ${getBMICategory(parseFloat(bmi))} قرار می‌گیرد.</p>
        </div>` : ''}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
            <h3 style="color: #065f46; margin-bottom: 10px;">وضعیت تغذیه</h3>
            <p style="color: #047857;">
              ${user.plans?.diet && user.plans.diet.length > 0
                ? `شما ${user.plans.diet.length} وعده غذایی برنامه‌ریزی شده دارید.`
                : 'هیچ برنامه غذایی برنامه‌ریزی شده‌ای وجود ندارد.'}
            </p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
            <h3 style="color: #7c3aed; margin-bottom: 10px;">وضعیت تمرینی</h3>
            <p style="color: #6d28d9;">
              ${user.plans?.workouts && Object.keys(user.plans.workouts).length > 0
                ? `شما ${Object.keys(user.plans.workouts).length} برنامه تمرینی دارید.`
                : 'هیچ برنامه تمرینی برنامه‌ریزی شده‌ای وجود ندارد.'}
            </p>
          </div>
        </div>
      </div>
    `;
  };

  const handleOpenUserModal = (id?: UserId | null) => {
    setEditingUserId(id ?? null);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUserId(null);
  };

  const handleSaveUserForm = async (data: UserInput) => {
    await saveUser(data);

    handleCloseUserModal();
  };

  const handleSelectUser = useCallback((id: UserId) => {
    setActiveUserId(id);
    // Always try to go to info tab - the UI will show loading if data isn't ready
    setStudentsSubTab('info');
    setCurrentTab('students');
  }, []);

  const copyCoachCode = useCallback(() => {
    if (coachCode) {
      navigator.clipboard.writeText(coachCode);
      toast.success('کد مربی کپی شد!');
    }
  }, [coachCode]);

  // ========== Navigation Items ==========
  const navItems = [
    { id: 'dashboard' as TabType, icon: <BarChart3 size={20} />, label: 'داشبورد' },
    { id: 'students' as TabType, icon: <Users size={20} />, label: 'شاگردان', badge: pendingRequests.length },
    { id: 'training' as TabType, icon: <Dumbbell size={20} />, label: 'برنامه تمرین' },
    { id: 'nutrition' as TabType, icon: <UtensilsCrossed size={20} />, label: 'رژیم غذایی' },
    { id: 'supplements' as TabType, icon: <Pill size={20} />, label: 'مکمل‌ها' },
    { id: 'print' as TabType, icon: <Printer size={20} />, label: 'پرینت و خروجی' },
    { id: 'profile' as TabType, icon: <Settings size={20} />, label: 'پروفایل من' },
  ];

  if (!user) return null;

  // ========== Render ==========
  return (
    <>
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && achievementData && (
          <AchievementPopup
            title={achievementData.title}
            description={achievementData.description}
            icon={achievementData.icon}
            color={achievementData.color}
            onClose={() => {
              setShowAchievement(false);
              setAchievementData(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Smart Reminder */}
      <AnimatePresence>
        {showReminder && currentReminder && (
          <SmartReminder
            type={currentReminder.type}
            title={currentReminder.title}
            message={currentReminder.message}
            clientName={currentReminder.clientName}
            onAction={currentReminder.action}
            onDismiss={() => {
              setShowReminder(false);
              setCurrentReminder(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* ==================== Sidebar - Desktop ==================== */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 88 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-gradient-to-b from-[var(--glass-bg)] via-[var(--glass-bg)]/95 to-[var(--glass-bg)]/90 backdrop-blur-xl border-r border-[var(--glass-border)] shadow-2xl shadow-black/10 z-30 overflow-hidden"
      >
        {/* Logo & Brand */}
        <div className="p-6 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--accent-color)]/5 to-transparent">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[var(--accent-color)]/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <span className="relative z-10">V2</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className="flex flex-col"
                >
                  <h1 className="text-2xl font-black bg-gradient-to-l from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                    VO₂MAX
                  </h1>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="h-0.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full mt-1"
                  ></motion.div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium mt-1 tracking-wide">پنل مدیریت مربی</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <NavItem
                  icon={item.icon}
                  label={item.label}
                  active={currentTab === item.id}
                  onClick={() => setCurrentTab(item.id)}
                  badge={item.badge}
                  collapsed={!sidebarOpen}
                />
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-[var(--glass-border)] space-y-3 bg-gradient-to-t from-black/5 to-transparent">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Theme Toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[var(--glass-bg)] to-white/5 border border-[var(--glass-border)]"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </motion.div>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {theme === 'dark' ? 'تم تاریک' : 'تم روشن'}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-slate-600 to-slate-800'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500'
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
                        theme === 'dark' ? 'ml-0.5' : 'ml-6'
                      }`}
                    >
                      {theme === 'dark' ? (
                        <Moon size={10} className="text-slate-600" />
                      ) : (
                        <Sun size={10} className="text-amber-500" />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px -2px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={backupData}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:from-emerald-500/20 hover:to-emerald-600/20 transition-all duration-300 font-semibold text-sm border border-emerald-500/20 hover:border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                >
                  <FileText size={18} />
                  بکاپ داده‌ها
                </motion.button>
                <motion.label
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 hover:from-blue-500/20 hover:to-blue-600/20 transition-all duration-300 font-semibold text-sm border border-blue-500/20 hover:border-blue-500/30 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  <FileText size={18} />
                  بازیابی بکاپ
                  <input type="file" className="hidden" accept=".json" onChange={(e) => e.target.files?.[0] && restoreData(e.target.files[0])} />
                </motion.label>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--glass-bg-rgb), 0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-2xl hover:bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300 border border-transparent hover:border-[var(--glass-border)] shadow-lg"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <ChevronRight size={22} />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>

      {/* ==================== Mobile Menu Button ==================== */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 glass-panel rounded-xl shadow-lg"
      >
        <Menu size={24} />
      </motion.button>

      {/* ==================== Mobile Sidebar ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 z-50"
            />
            <motion.aside
              initial={{ x: '100%', rotateY: -15 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: '100%', rotateY: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-[var(--glass-bg)] via-[var(--glass-bg)]/98 to-[var(--glass-bg)]/95 backdrop-blur-xl z-50 flex flex-col shadow-2xl shadow-black/20 border-l border-[var(--glass-border)] overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--accent-color)]/5 to-transparent flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                    className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-[var(--accent-color)]/40 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="relative z-10">V2</span>
                  </motion.div>
                  <div>
                    <h1 className="text-xl font-black bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] bg-clip-text text-transparent">VO₂MAX</h1>
                    <p className="text-xs text-[var(--text-secondary)]">پنل مدیریت</p>
                  </div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-[var(--glass-bg)] transition-all duration-300 border border-transparent hover:border-[var(--glass-border)]"
                >
                  <X size={24} className="text-[var(--text-secondary)]" />
                </motion.button>
              </div>
              <nav className="flex-1 p-5 space-y-3 overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3, type: "spring", stiffness: 300 }}
                    >
                      <NavItem
                        icon={item.icon}
                        label={item.label}
                        active={currentTab === item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        badge={item.badge}
                      />
                    </motion.div>
                  ))}
                </div>
              </nav>
              <div className="p-5 border-t border-[var(--glass-border)] bg-gradient-to-t from-black/5 to-transparent">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px -2px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-500 hover:from-red-500/20 hover:to-red-600/20 transition-all duration-300 font-semibold border border-red-500/20 hover:border-red-500/30 shadow-lg shadow-red-500/10"
                >
                  <LogOut size={20} />
                  خروج از حساب
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ==================== Main Content ==================== */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ==================== Header ==================== */}
        <header className="sticky top-0 z-40 glass-panel border-b border-[var(--glass-border)] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="pr-12 lg:pr-0">
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
                {navItems.find(n => n.id === currentTab)?.label || 'داشبورد'}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCurrentTab('students'); setStudentsSubTab('requests'); }}
                className="relative p-2.5 rounded-xl hover:bg-[var(--glass-bg)] transition"
              >
                <Bell size={20} className="text-[var(--text-secondary)]" />
                {pendingRequests.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg"
                  >
                    {pendingRequests.length}
                  </motion.span>
                )}
              </motion.button>
              
              {/* Supabase Debug */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSupabaseDebugOpen(true)}
                className="p-2.5 rounded-xl hover:bg-[var(--glass-bg)] transition"
                title="بررسی اتصالات Supabase"
              >
                <Database size={20} className="text-blue-500" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-[var(--glass-bg)] transition"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-500" />}
                </motion.div>
              </motion.button>
              
              {/* User Menu */}
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[var(--glass-border)]">
                <div className="text-left">
                  <p className="text-sm font-bold">{coachProfile.fullName || 'مربی'}</p>
                  <p className="text-xs text-[var(--text-secondary)]">مربی</p>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold shadow-lg cursor-pointer"
                  onClick={() => setCurrentTab('profile')}
                >
                  {coachProfile.fullName?.charAt(0) || 'م'}
                </motion.div>
              </div>
              
              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition"
                title="خروج"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          </div>
        </header>

        {/* ==================== Content ==================== */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* ==================== Dashboard Tab ==================== */}
            {currentTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Enhanced Welcome Message with Achievements */}
                <motion.div
                  variants={bounceIn}
                  className="glass-card p-6 rounded-2xl border border-[var(--glass-border)] relative overflow-hidden"
                >
                  {/* Animated background particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-[var(--accent-color)]/20 rounded-full"
                        initial={{
                          x: Math.random() * 400,
                          y: Math.random() * 200,
                          opacity: 0
                        }}
                        animate={{
                          x: Math.random() * 400,
                          y: Math.random() * 200,
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.5,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                          سلام {coachProfile.fullName?.split(' ')[0] || 'مربی'} عزیز!
                          <motion.span
                            animate={{
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 5
                            }}
                          >
                            👋
                          </motion.span>
                        </h3>
                        <motion.p
                          className="text-[var(--text-secondary)] mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          به پنل مدیریت خوش آمدید. امروز {users.length} شاگرد و {pendingRequests.length} درخواست در انتظار دارید.
                        </motion.p>
                      </motion.div>

                      {/* Achievement Badges */}
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="relative cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-yellow-500/30 transition-shadow">
                            🏆
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span className="text-xs font-bold text-white">5</span>
                          </motion.div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="relative cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-purple-500/30 transition-shadow">
                            ⭐
                          </div>
                          <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                            animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <span className="text-xs font-bold text-white">!</span>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Progress Streak with Animation */}
                    <motion.div
                      className="mt-4 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                            animate={{
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <span className="text-white text-sm font-bold">🔥</span>
                          </motion.div>
                          <div>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">رشته فعالیت ۱۴ روزه! 🔥</p>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">شاگردان شما در بهترین شرایط هستند</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.p
                            className="text-lg font-black text-emerald-600 dark:text-emerald-400"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          >
                            ۱۴
                          </motion.p>
                          <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">روز متوالی</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Enhanced Stats Grid with Stagger Animation */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={staggerItem}>
                    <StatCounter
                      value={stats.totalStudents}
                      label="کل شاگردان"
                      icon={<Users className="w-6 h-6" />}
                      color="text-blue-400"
                      trend={{ value: 12, positive: true }}
                      miniChart={[8, 9, 12, 15, 18, 20, 22]}
                      gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <StatCounter
                      value={stats.pendingRequests}
                      label="درخواست در انتظار"
                      icon={<Clock className="w-6 h-6" />}
                      color="text-yellow-400"
                      trend={{ value: -8, positive: false }}
                      miniChart={[5, 7, 6, 8, 4, 3, 2]}
                      gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <StatCounter
                      value={stats.acceptedRequests}
                      label="درخواست تأیید شده"
                      icon={<CheckCircle className="w-6 h-6" />}
                      color="text-green-400"
                      trend={{ value: 25, positive: true }}
                      miniChart={[3, 5, 8, 12, 15, 18, 20]}
                      gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <StatCounter
                      value={stats.activePrograms}
                      label="برنامه فعال"
                      icon={<Activity className="w-6 h-6" />}
                      color="text-purple-400"
                      trend={{ value: 15, positive: true }}
                      miniChart={[2, 3, 5, 7, 9, 11, 13]}
                      gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                    />
                  </motion.div>
                </motion.div>

                {/* Coach Code, Quick Actions & Smart Reminders */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Coach Code Card */}
                  <motion.div variants={itemVariants} className="lg:col-span-1">
                    <GlowCard className="h-full">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                            <Award size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold">کد اختصاصی مربی</h4>
                            <p className="text-xs text-[var(--text-secondary)]">برای ارتباط شاگردان</p>
                          </div>
                        </div>

                        {coachCode ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={copyCoachCode}
                            className="relative bg-gradient-to-l from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/30 cursor-pointer group"
                          >
                            <p className="text-3xl font-mono font-black text-center tracking-[0.4em] text-emerald-600 dark:text-emerald-400">
                              {coachCode}
                            </p>
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white font-bold flex items-center gap-2">
                                <Copy size={18} /> کپی کد
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                            <p className="text-amber-600 dark:text-amber-400 text-sm text-center">
                              ⚠️ شماره موبایل را در پروفایل ثبت کنید
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-center text-[var(--text-secondary)] mt-3">
                          این کد = ۵ رقم آخر موبایل شما
                        </p>
                      </div>
                    </GlowCard>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div variants={itemVariants} className="lg:col-span-1">
                    <GlowCard className="h-full">
                      <div className="p-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Zap size={18} className="text-[var(--accent-color)]" />
                          دسترسی سریع
                        </h4>
                        <div className="space-y-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenUserModal()}
                            className="w-full p-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <Plus size={16} />
                            شاگرد جدید
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentTab('training')}
                            className="w-full p-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <Dumbbell size={16} />
                            برنامه تمرین
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentTab('nutrition')}
                            className="w-full p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <UtensilsCrossed size={16} />
                            رژیم غذایی
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentTab('print')}
                            className="w-full p-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <Printer size={16} />
                            پرینت برنامه
                          </motion.button>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>

                  {/* Smart Reminders */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <GlowCard className="h-full">
                      <div className="p-6">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                          <Bell size={18} className="text-[var(--accent-color)]" />
                          یادآوری هوشمند
                        </h4>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                          سیستم یادآوری خودکار برای تمرین، تغذیه و مکمل‌ها
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Test buttons for different reminder types */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentReminder({
                                type: 'workout',
                                title: 'زمان تمرین!',
                                message: 'شاگردان شما منتظر برنامه تمرینی امروز هستند.',
                                action: () => setCurrentTab('training')
                              });
                              setShowReminder(true);
                            }}
                            className="p-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm rounded-lg transition-colors flex items-center gap-2"
                          >
                            🏋️ تمرین
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentReminder({
                                type: 'nutrition',
                                title: 'یادآوری تغذیه',
                                message: 'زمان وعده غذایی فرا رسیده است.',
                                action: () => setCurrentTab('nutrition')
                              });
                              setShowReminder(true);
                            }}
                            className="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-colors flex items-center gap-2"
                          >
                            🥗 تغذیه
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentReminder({
                                type: 'supplement',
                                title: 'یادآوری مکمل‌ها',
                                message: 'زمان مصرف مکمل‌های روزانه فرا رسیده.',
                                action: () => setCurrentTab('supplements')
                              });
                              setShowReminder(true);
                            }}
                            className="p-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-sm rounded-lg transition-colors flex items-center gap-2"
                          >
                            💊 مکمل
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentReminder({
                                type: 'session',
                                title: 'یادآوری جلسه',
                                message: 'جلسه با علی رضا در ساعت ۱۷ امروز.',
                                clientName: 'علی رضا',
                                action: () => setCurrentTab('students')
                              });
                              setShowReminder(true);
                            }}
                            className="p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition-colors flex items-center gap-2"
                          >
                            📅 جلسه
                          </motion.button>
                        </div>

                        <div className="pt-3 border-t border-[var(--glass-border)]">
                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            یادآوری‌ها به صورت خودکار در زمان‌های مناسب نمایش داده می‌شوند
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  </motion.div>
                </div>

                {/* Recent Requests & Recent Students */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending Requests */}
                  <motion.div variants={itemVariants}>
                    <GlowCard>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold flex items-center gap-2">
                            <Bell size={18} className="text-[var(--accent-color)]" />
                            درخواست‌های در انتظار
                          </h4>
                          {pendingRequests.length > 0 && (
                            <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold">
                              {pendingRequests.length}
                            </span>
                          )}
                        </div>
                        
                        {pendingRequests.length === 0 ? (
                          <div className="text-center py-8 text-[var(--text-secondary)]">
                            <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                            <p>همه درخواست‌ها بررسی شده</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {pendingRequests.slice(0, 3).map((req, idx) => (
                              <motion.div
                                key={req.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                                    <UserIcon size={16} className="text-[var(--accent-color)]" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{req.client_name || 'شاگرد'}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {req.request_type === 'all' ? 'برنامه کامل' : req.request_type}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleAcceptRequest(req)}
                                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30"
                                  >
                                    <CheckCircle size={16} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleRejectRequest(req)}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                  >
                                    <XCircle size={16} />
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        
                        {pendingRequests.length > 3 && (
                          <button
                            onClick={() => { setCurrentTab('students'); setStudentsSubTab('requests'); }}
                            className="w-full mt-4 text-sm text-[var(--accent-color)] hover:underline font-semibold"
                          >
                            مشاهده همه ({pendingRequests.length})
                          </button>
                        )}
                      </div>
                    </GlowCard>
                  </motion.div>

                  {/* Recent Students */}
                  <motion.div variants={itemVariants}>
                    <GlowCard>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold flex items-center gap-2">
                            <Users size={18} className="text-[var(--accent-color)]" />
                            شاگردان اخیر
                          </h4>
                          <button
                            onClick={() => setCurrentTab('students')}
                            className="text-xs text-[var(--accent-color)] hover:underline font-semibold"
                          >
                            مشاهده همه
                          </button>
                        </div>
                        
                        {users.length === 0 ? (
                          <div className="text-center py-8 text-[var(--text-secondary)]">
                            <Users size={32} className="mx-auto mb-2 opacity-50" />
                            <p>هنوز شاگردی ثبت نشده</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {users.slice(0, 4).map((u, idx) => (
                              <motion.div
                                key={u.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleSelectUser(u.id)}
                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--accent-color)]/30 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-sm">
                                    {u.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{u.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {u.nutritionGoals || u.level || 'بدون هدف'}
                                    </p>
                                  </div>
                                </div>
                                <ChevronLeft size={18} className="text-[var(--text-secondary)]" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </GlowCard>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ==================== Students Tab ==================== */}
            {currentTab === 'students' && (
              <motion.div
                key="students"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Sub Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-[var(--glass-border)] pb-4">
                  {[
                    { id: 'list' as StudentsSubTab, label: 'لیست شاگردان', icon: <Users size={16} /> },
                    { id: 'requests' as StudentsSubTab, label: 'درخواست‌ها', icon: <Bell size={16} />, badge: pendingRequests.length },
                    { id: 'info' as StudentsSubTab, label: 'اطلاعات شاگرد', icon: <FileText size={16} />, disabled: !localActiveUser },
                  ].map(tab => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !tab.disabled && setStudentsSubTab(tab.id)}
                      disabled={tab.disabled}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition relative ${
                        studentsSubTab === tab.id
                          ? 'bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] text-white shadow-lg'
                          : tab.disabled
                          ? 'text-[var(--text-secondary)]/40 cursor-not-allowed bg-[var(--glass-bg)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Students List */}
                {studentsSubTab === 'list' && (
                  <motion.div variants={itemVariants} className="space-y-4">
                    {/* Search & Add */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 relative">
                        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                        <input
                          type="text"
                          placeholder="جستجوی شاگرد با نام، تلفن یا ایمیل..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                          className="input-glass pr-12 w-full"
                        />
                      </div>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
                        className="input-glass w-full sm:w-40"
                      >
                        <option value="name">ترتیب نام</option>
                        <option value="date">ترتیب تاریخ</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenUserModal()}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-[var(--accent-color)]/30"
                        style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' }}
                      >
                        <Plus size={18} />
                        <span>شاگرد جدید</span>
                      </motion.button>
                    </div>

                    {/* Users Grid */}
                    {paginatedUsers.length === 0 ? (
                      <EmptyState
                        icon={<Users size={40} />}
                        title={searchTerm ? 'شاگردی یافت نشد' : 'هنوز شاگردی اضافه نشده'}
                        description={searchTerm ? 'عبارت جستجو را تغییر دهید' : 'اولین شاگرد خود را اضافه کنید'}
                        action={!searchTerm ? { label: 'افزودن شاگرد', onClick: () => handleOpenUserModal() } : undefined}
                      />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {paginatedUsers.map((u, idx) => (
                            <motion.div
                              key={u.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <GlowCard
                                className={`cursor-pointer ${activeUserId === u.id ? 'ring-2 ring-[var(--accent-color)]' : ''}`}
                                onClick={() => handleSelectUser(u.id)}
                              >
                                <div className="p-4">
                                  {/* Header with avatar and basic info */}
                                  <div className="flex items-start gap-3 mb-3">
                                    <motion.div
                                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      {u.name.charAt(0).toUpperCase()}
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-[var(--text-primary)] truncate">{u.name}</h3>
                                      <p className="text-xs text-[var(--text-secondary)] truncate">
                                        {u.phone || u.email || 'اطلاعات تماس موجود نیست'}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Status badges */}
                                  <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                      u.level === 'beginner' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                                      u.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                      u.level === 'advanced' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                                      u.level === 'pro' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                                      'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                                    }`}>
                                      {u.level === 'beginner' ? 'مبتدی' :
                                       u.level === 'intermediate' ? 'متوسط' :
                                       u.level === 'advanced' ? 'پیشرفته' :
                                       u.level === 'pro' ? 'حرفه‌ای' :
                                       u.level || 'سطح نامشخص'}
                                    </span>

                                    {u.gender && (
                                      <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-xs text-purple-600 dark:text-purple-400">
                                        {u.gender === 'male' ? 'آقا' : 'خانم'}
                                      </span>
                                    )}

                                    {Object.keys(u.plans?.workouts || {}).length > 0 && (
                                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                                        برنامه فعال
                                      </span>
                                    )}

                                    {u.age && (
                                      <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400">
                                        {u.age} سال
                                      </span>
                                    )}
                                  </div>

                                  {/* Action buttons */}
                                  <div className="flex items-center gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectUser(u.id);
                                      }}
                                      className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition text-sm font-medium"
                                      title="مشاهده پروفایل"
                                    >
                                      <Eye size={16} />
                                      مشاهده
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUserModal(u.id);
                                      }}
                                      className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition"
                                      title="ویرایش اطلاعات"
                                    >
                                      <Edit size={16} />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteUser(u.id);
                                      }}
                                      className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                                      title="حذف شاگرد"
                                    >
                                      <Trash2 size={16} />
                                    </motion.button>
                                  </div>

                                  {/* Quick stats */}
                                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      <div className="text-xs">
                                        <div className="font-bold text-[var(--text-primary)]">
                                          {Object.keys(u.plans?.workouts || {}).length}
                                        </div>
                                        <div className="text-[var(--text-secondary)]">جلسه</div>
                                      </div>
                                      <div className="text-xs">
                                        <div className="font-bold text-[var(--text-primary)]">
                                          {u.plans?.diet?.length || 0}
                                        </div>
                                        <div className="text-[var(--text-secondary)]">وعده</div>
                                      </div>
                                      <div className="text-xs">
                                        <div className="font-bold text-[var(--text-primary)]">
                                          {u.plans?.supps?.length || 0}
                                        </div>
                                        <div className="text-[var(--text-secondary)]">مکمل</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </GlowCard>
                            </motion.div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-2 pt-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="p-2.5 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] disabled:opacity-40 transition"
                            >
                              <ChevronRight size={18} />
                            </motion.button>
                            
                            <div className="flex items-center gap-1">
                              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-9 h-9 rounded-xl font-semibold transition ${
                                      currentPage === pageNum
                                        ? 'bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] text-white'
                                        : 'bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="p-2.5 rounded-xl bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] disabled:opacity-40 transition"
                            >
                              <ChevronLeft size={18} />
                            </motion.button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Requests */}
                {studentsSubTab === 'requests' && (
                  <motion.div variants={itemVariants} className="space-y-4">
                    {requests.length === 0 ? (
                      <EmptyState
                        icon={<Bell size={40} />}
                        title="هیچ درخواستی وجود ندارد"
                        description="شاگردان با کد مربی شما می‌توانند درخواست برنامه بفرستند"
                      />
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {requests.map((req, idx) => (
                          <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <GlowCard>
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                                      <UserIcon size={22} className="text-[var(--accent-color)]" />
                                    </div>
                                    <div>
                                      <p className="font-bold">{req.client_name || 'شاگرد جدید'}</p>
                                      <p className="text-xs text-[var(--text-secondary)]">
                                        {req.request_type === 'all' ? '🎯 برنامه کامل' : 
                                         req.request_type === 'training' ? '🏋️ تمرین' : 
                                         req.request_type === 'diet' ? '🥗 تغذیه' : '💊 مکمل'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                    req.status === 'pending' 
                                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' 
                                      : req.status === 'accepted'
                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-red-500/20 text-red-500'
                                  }`}>
                                    {req.status === 'pending' ? '⏳ در انتظار' : req.status === 'accepted' ? '✅ تأیید شده' : '❌ رد شده'}
                                  </span>
                                </div>
                                
                                {req.created_at && (
                                  <p className="text-xs text-[var(--text-secondary)] mb-4 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(req.created_at).toLocaleDateString('fa-IR')}
                                  </p>
                                )}
                                
                                {req.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleAcceptRequest(req)}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                                    >
                                      <CheckCircle size={18} />
                                      تأیید و افزودن
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleRejectRequest(req)}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition"
                                    >
                                      <XCircle size={18} />
                                      رد درخواست
                                    </motion.button>
                                  </div>
                                )}

                                {(req.status === 'accepted' || req.status === 'rejected') && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleDeleteRequest(req)}
                                    disabled={deletingRequestId === req.id}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-500/10 text-gray-500 font-semibold hover:bg-gray-500/20 transition disabled:opacity-50"
                                  >
                                    {deletingRequestId === req.id ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full"
                                      />
                                    ) : (
                                      <Trash2 size={18} />
                                    )}
                                    حذف درخواست
                                  </motion.button>
                                )}
                              </div>
                            </GlowCard>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Client Info */}
                {studentsSubTab === 'info' && (
                  localActiveUser ? (
                    <ClientInfoPanel
                      client={clientProfile}
                      loading={profileLoading}
                      onNavigateToTab={(tab) => {
                        setCurrentTab(tab);
                        // Keep activeUser selected for the new tab
                      }}
                    />
                  ) : (
                    <EmptyState
                      icon={<FileText size={40} />}
                      title="شاگردی انتخاب نشده"
                      description="از لیست شاگردان یک شاگرد را انتخاب کنید"
                      action={{ label: 'رفتن به لیست شاگردان', onClick: () => setStudentsSubTab('list') }}
                    />
                  )
                )}
              </motion.div>
            )}

            {/* ==================== Training Tab ==================== */}
            {currentTab === 'training' && (
              <motion.div key="training" {...scaleIn} className="space-y-6">
                {activeUser ? (
                  <>
                    {/* Student Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-2xl border border-[var(--glass-border)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg">
                            {activeUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{activeUser.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {activeUser.level || 'سطح نامشخص'} • {activeUser.gender === 'male' ? 'آقا' : 'خانم'} • {activeUser.age} سال
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setCurrentTab('students'); setStudentsSubTab('info'); }}
                            className="px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition font-semibold text-sm"
                          >
                            مشاهده اطلاعات
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveUserId(null)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-semibold text-sm"
                          >
                            تغییر شاگرد
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <Suspense fallback={<PanelLoadingFallback />}>
                      <TrainingPanel activeUser={activeUser} onUpdateUser={updateActiveUser} />
                    </Suspense>
                  </>
                ) : (
                  <EmptyState
                    icon={<Dumbbell size={40} />}
                    title="شاگردی انتخاب نشده"
                    description="برای طراحی برنامه تمرین، ابتدا یک شاگرد را انتخاب کنید"
                    action={{ label: 'انتخاب شاگرد', onClick: () => setCurrentTab('students') }}
                  />
                )}
              </motion.div>
            )}

            {/* ==================== Nutrition Tab ==================== */}
            {currentTab === 'nutrition' && (
              <motion.div key="nutrition" {...scaleIn} className="space-y-6">
                {activeUser ? (
                  <>
                    {/* Student Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-2xl border border-[var(--glass-border)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg">
                            {activeUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{activeUser.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {activeUser.level || 'سطح نامشخص'} • {activeUser.gender === 'male' ? 'آقا' : 'خانم'} • {activeUser.age} سال
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setCurrentTab('students'); setStudentsSubTab('info'); }}
                            className="px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition font-semibold text-sm"
                          >
                            مشاهده اطلاعات
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveUserId(null)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-semibold text-sm"
                          >
                            تغییر شاگرد
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <Suspense fallback={<PanelLoadingFallback />}>
                      <DietPanel activeUser={activeUser} onUpdateUser={updateActiveUser} />
                    </Suspense>
                  </>
                ) : (
                  <EmptyState
                    icon={<UtensilsCrossed size={40} />}
                    title="شاگردی انتخاب نشده"
                    description="برای طراحی رژیم غذایی، ابتدا یک شاگرد را انتخاب کنید"
                    action={{ label: 'انتخاب شاگرد', onClick: () => setCurrentTab('students') }}
                  />
                )}
              </motion.div>
            )}

            {/* ==================== Supplements Tab ==================== */}
            {currentTab === 'supplements' && (
              <motion.div key="supplements" {...scaleIn} className="space-y-6">
                {activeUser ? (
                  <>
                    {/* Student Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-2xl border border-[var(--glass-border)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg">
                            {activeUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{activeUser.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {activeUser.level || 'سطح نامشخص'} • {activeUser.gender === 'male' ? 'آقا' : 'خانم'} • {activeUser.age} سال
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setCurrentTab('students'); setStudentsSubTab('info'); }}
                            className="px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition font-semibold text-sm"
                          >
                            مشاهده اطلاعات
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveUserId(null)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-semibold text-sm"
                          >
                            تغییر شاگرد
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    <Suspense fallback={<PanelLoadingFallback />}>
                      <SupplementsPanel activeUser={activeUser} onUpdateUser={updateActiveUser} />
                    </Suspense>
                  </>
                ) : (
                  <EmptyState
                    icon={<Pill size={40} />}
                    title="شاگردی انتخاب نشده"
                    description="برای تجویز مکمل، ابتدا یک شاگرد را انتخاب کنید"
                    action={{ label: 'انتخاب شاگرد', onClick: () => setCurrentTab('students') }}
                  />
                )}
              </motion.div>
            )}

            {/* ==================== Print Tab ==================== */}
            {currentTab === 'print' && (
              <motion.div key="print" {...scaleIn} className="space-y-6">
                {activeUser ? (
                  <>
                    {/* Student Header */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-4 rounded-2xl border border-[var(--glass-border)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold text-lg">
                            {activeUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{activeUser.name}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {activeUser.level || 'سطح نامشخص'} • {activeUser.gender === 'male' ? 'آقا' : 'خانم'} • {activeUser.age} سال
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { setCurrentTab('students'); setStudentsSubTab('info'); }}
                            className="px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition font-semibold text-sm"
                          >
                            مشاهده اطلاعات
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveUserId(null)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-semibold text-sm"
                          >
                            تغییر شاگرد
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Print Panel */}
                    <PrintPanel user={activeUser} onGeneratePrint={handleGeneratePrint} />
                  </>
                ) : (
                  <EmptyState
                    icon={<Printer size={40} />}
                    title="شاگردی انتخاب نشده"
                    description="برای پرینت برنامه، ابتدا یک شاگرد را انتخاب کنید"
                    action={{ label: 'انتخاب شاگرد', onClick: () => setCurrentTab('students') }}
                  />
                )}
              </motion.div>
            )}

            {/* ==================== Profile Tab ==================== */}
            {currentTab === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                {/* Coach Code Card */}
                <motion.div variants={itemVariants}>
                  <GlowCard glowColor="#f59e0b">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                          <Award size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">کد اختصاصی مربی</h3>
                          <p className="text-sm text-[var(--text-secondary)]">این کد = ۵ رقم آخر شماره موبایل</p>
                        </div>
                      </div>
                      
                      {coachCode ? (
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          onClick={copyCoachCode}
                          className="relative bg-gradient-to-l from-emerald-500/10 to-emerald-500/5 rounded-2xl p-6 border-2 border-emerald-500/30 cursor-pointer group"
                        >
                          <p className="text-5xl font-mono font-black text-center tracking-[0.5em] text-emerald-600 dark:text-emerald-400">
                            {coachCode}
                          </p>
                          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <span className="text-white font-bold text-lg flex items-center gap-3">
                              <Copy size={24} /> کلیک برای کپی کد
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-center">
                          <Clock size={32} className="mx-auto mb-3 text-amber-500" />
                          <p className="text-amber-600 dark:text-amber-400 font-semibold">
                            شماره موبایل را در فرم زیر ثبت کنید تا کد مربی فعال شود
                          </p>
                        </div>
                      )}
                    </div>
                  </GlowCard>
                </motion.div>

                {/* Personal Info */}
                <motion.div variants={itemVariants}>
                  <GlowCard>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                          <UserIcon size={20} />
                        </div>
                        اطلاعات شخصی
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">نام کامل</label>
                          <input
                            type="text"
                            value={coachProfile.fullName}
                            onChange={(e) => setCoachProfile(p => ({ ...p, fullName: e.target.value }))}
                            className="input-glass"
                            placeholder="نام و نام خانوادگی"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Phone size={14} className="inline ml-1" />
                            شماره موبایل *
                          </label>
                          <input
                            type="tel"
                            value={coachProfile.phone}
                            onChange={(e) => setCoachProfile(p => ({ ...p, phone: e.target.value }))}
                            className="input-glass"
                            placeholder="09123456789"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Mail size={14} className="inline ml-1" />
                            ایمیل
                          </label>
                          <input
                            type="email"
                            value={coachProfile.email}
                            onChange={(e) => setCoachProfile(p => ({ ...p, email: e.target.value }))}
                            className="input-glass"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">کد ملی</label>
                          <input
                            type="text"
                            value={coachProfile.nationalId}
                            onChange={(e) => setCoachProfile(p => ({ ...p, nationalId: e.target.value }))}
                            className="input-glass"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">تاریخ تولد</label>
                          <input
                            type="date"
                            value={coachProfile.birthDate}
                            onChange={(e) => setCoachProfile(p => ({ ...p, birthDate: e.target.value }))}
                            className="input-glass"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <MapPin size={14} className="inline ml-1" />
                            شهر
                          </label>
                          <input
                            type="text"
                            value={coachProfile.city}
                            onChange={(e) => setCoachProfile(p => ({ ...p, city: e.target.value }))}
                            className="input-glass"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">آدرس</label>
                          <textarea
                            value={coachProfile.address}
                            onChange={(e) => setCoachProfile(p => ({ ...p, address: e.target.value }))}
                            className="input-glass resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>

                {/* Professional Info */}
                <motion.div variants={itemVariants}>
                  <GlowCard>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                          <Briefcase size={20} />
                        </div>
                        اطلاعات حرفه‌ای
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Target size={14} className="inline ml-1" />
                            تخصص
                          </label>
                          <input
                            type="text"
                            value={coachProfile.specialization}
                            onChange={(e) => setCoachProfile(p => ({ ...p, specialization: e.target.value }))}
                            className="input-glass"
                            placeholder="مثال: بدنسازی، کراس‌فیت، پیلاتس..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Award size={14} className="inline ml-1" />
                            گواهینامه‌ها
                          </label>
                          <input
                            type="text"
                            value={coachProfile.certifications}
                            onChange={(e) => setCoachProfile(p => ({ ...p, certifications: e.target.value }))}
                            className="input-glass"
                            placeholder="مثال: NASM, ACE, ISSA..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Star size={14} className="inline ml-1" />
                            سابقه کار (سال)
                          </label>
                          <input
                            type="text"
                            value={coachProfile.experience}
                            onChange={(e) => setCoachProfile(p => ({ ...p, experience: e.target.value }))}
                            className="input-glass"
                            placeholder="مثال: 5 سال"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <GraduationCap size={14} className="inline ml-1" />
                            تحصیلات
                          </label>
                          <input
                            type="text"
                            value={coachProfile.education}
                            onChange={(e) => setCoachProfile(p => ({ ...p, education: e.target.value }))}
                            className="input-glass"
                            placeholder="مثال: کارشناسی تربیت بدنی"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Heart size={14} className="inline ml-1" />
                            بیوگرافی
                          </label>
                          <textarea
                            value={coachProfile.bio}
                            onChange={(e) => setCoachProfile(p => ({ ...p, bio: e.target.value }))}
                            className="input-glass resize-none"
                            rows={4}
                            placeholder="معرفی کوتاه از خودتان و سبک مربیگری..."
                          />
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>

                {/* Social Links */}
                <motion.div variants={itemVariants}>
                  <GlowCard>
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white">
                          <Globe size={20} />
                        </div>
                        شبکه‌های اجتماعی
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <Instagram size={14} className="inline ml-1" />
                            اینستاگرام
                          </label>
                          <input
                            type="text"
                            value={coachProfile.instagram}
                            onChange={(e) => setCoachProfile(p => ({ ...p, instagram: e.target.value }))}
                            className="input-glass"
                            placeholder="@username"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">
                            <MessageCircle size={14} className="inline ml-1" />
                            تلگرام
                          </label>
                          <input
                            type="text"
                            value={coachProfile.telegram}
                            onChange={(e) => setCoachProfile(p => ({ ...p, telegram: e.target.value }))}
                            className="input-glass"
                            placeholder="@username"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">واتساپ</label>
                          <input
                            type="text"
                            value={coachProfile.whatsapp}
                            onChange={(e) => setCoachProfile(p => ({ ...p, whatsapp: e.target.value }))}
                            className="input-glass"
                            placeholder="09123456789"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2 text-[var(--text-secondary)]">وب‌سایت</label>
                          <input
                            type="url"
                            value={coachProfile.website}
                            onChange={(e) => setCoachProfile(p => ({ ...p, website: e.target.value }))}
                            className="input-glass"
                            placeholder="https://example.com"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>

                {/* Save Button */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSaveCoachProfile}
                  disabled={savingProfile}
                  className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-[var(--accent-color)]/30 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' }}
                >
                  {savingProfile ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      در حال ذخیره...
                    </span>
                  ) : (
                    'ذخیره تغییرات'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================== Active User Footer ==================== */}
        <AnimatePresence>
          {activeUser && !['dashboard', 'profile'].includes(currentTab) && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="sticky bottom-0 glass-panel border-t border-[var(--glass-border)] px-4 sm:px-6 py-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold shadow-lg">
                    {activeUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{activeUser.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">شاگرد انتخاب شده</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setCurrentTab('students'); setStudentsSubTab('info'); }}
                    className="px-4 py-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold text-sm hover:bg-[var(--accent-color)]/20 transition"
                  >
                    مشاهده پروفایل
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveUserId(null)}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm hover:bg-red-500/20 transition"
                  >
                    لغو انتخاب
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* React Bits Floating Action Button */}
      <ExpandableFab
        actions={[
          {
            icon: <Plus className="w-4 h-4" />,
            label: "افزودن شاگرد جدید",
            onClick: () => {
              setEditingUserId(null);
              setIsUserModalOpen(true);
            }
          },
          {
            icon: <Users className="w-4 h-4" />,
            label: "مشاهده درخواست‌ها",
            onClick: () => setCurrentTab('requests')
          },
          {
            icon: <Printer className="w-4 h-4" />,
            label: "چاپ گزارش",
            onClick: () => setCurrentTab('reports')
          }
        ]}
        mainIcon={<Plus className="w-5 h-5" />}
        tooltip="منوی اکشن سریع"
        position="bottom-right"
      />

      {/* ==================== Modals ==================== */}
      <AnimatePresence>
        {isUserModalOpen && (
          <UserModal
            isOpen={isUserModalOpen}
            onClose={handleCloseUserModal}
            onSave={handleSaveUserForm}
            initialData={editingUserId ? users.find(u => u.id === editingUserId) || null : null}
          />
        )}
      </AnimatePresence>

      {printData && (
        <PrintModal
          data={printData}
          onClose={closePrintModal}
          onDownload={downloadPDF}
        />
      )}

      {/* Supabase Debug Modal */}
      <SupabaseDebug
        isOpen={isSupabaseDebugOpen}
        onClose={() => setIsSupabaseDebugOpen(false)}
      />
    </div>
    </>
  );
};

export default CoachDashboard;
