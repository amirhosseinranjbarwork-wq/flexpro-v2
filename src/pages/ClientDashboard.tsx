import React, { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { fetchClientById, fetchWorkoutPlansByClient, isSupabaseReady, updateClient, findCoachByCode, createProgramRequest, fetchRequestsByClient, deleteProgramRequestLocally } from '../lib/supabaseApi';
import type { UserPlans, WorkoutItem, Client, ProfileData, ProgramRequest, Measurements } from '../types/index';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Dumbbell,
  UtensilsCrossed,
  Pill,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Save,
  CheckCircle2,
  Clock,
  Target,
  Send,
  FileText,
  Search,
  UserCheck,
  AlertCircle,
  BarChart3,
  Zap,
  Copy,
  Award,
  TrendingUp,
  Layers,
  ExternalLink,
  Printer,
  Plus
} from 'lucide-react';

// Import React Bits components
import { HoverCard, FloatingActionButton, TextAnimation } from '../components';

type TabType = 'dashboard' | 'training' | 'nutrition' | 'supplements' | 'request' | 'profile' | 'portfolio';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95 }
};

const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}> = ({ children, className = '', glowColor = 'var(--accent-color)', onClick }) => (
  <motion.div
    whileHover={{ scale: onClick ? 1.02 : 1.01, y: onClick ? -4 : 0 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative group glass-card rounded-2xl border border-[var(--glass-border)] overflow-hidden transition-all duration-500 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{ boxShadow: `0 0 0 1px ${glowColor}10` }}
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

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  trend?: { value: number; positive: boolean };
  delay?: number;
}> = ({ icon, label, value, gradient, trend, delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    className="relative overflow-hidden glass-card p-6 rounded-2xl border border-[var(--glass-border)] group hover:border-[var(--accent-color)]/30 transition-all duration-500"
  >
    <div
      className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
      style={{ background: gradient }}
    />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-4xl font-black text-[var(--text-primary)] mb-1">{value}</p>
        <p className="text-sm text-[var(--text-secondary)] font-medium">{label}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            <TrendingUp size={14} className={trend.positive ? '' : 'rotate-180'} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: gradient }}>
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
    whileHover={{ x: collapsed ? 0 : 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group ${
      active
        ? 'bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent-color)]/30'
        : 'text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]'
    }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </span>
    {!collapsed && <span className="font-semibold text-sm">{label}</span>}
    {badge !== undefined && badge > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[22px] h-[22px] rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold px-1 shadow-lg"
      >
        {badge > 99 ? '99+' : badge}
      </motion.span>
    )}
  </motion.button>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, label, sublabel, onClick, gradient }) => (
  <GlowCard onClick={onClick} glowColor={gradient.includes('emerald') ? '#10b981' : gradient.includes('purple') ? '#8b5cf6' : '#3b82f6'}>
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
    className="text-center py-14"
  >
    <motion.div
      animate={{
        y: [0, -8, 0],
        rotate: [0, 4, -4, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-border)] flex items-center justify-center text-[var(--text-secondary)]"
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">{title}</h3>
    <p className="text-[var(--text-secondary)] mb-4 max-w-md mx-auto text-sm">{description}</p>
    {action && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={action.onClick}
        className="px-5 py-3 rounded-xl font-semibold text-white shadow-lg shadow-[var(--accent-color)]/30"
        style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))' }}
      >
        {action.label}
      </motion.button>
    )}
  </motion.div>
);

const INJURIES_LIST = [
  'دیسک کمر', 'دیسک گردن', 'زانو درد', 'شانه درد', 'سیاتیک', 
  'قوز پشتی', 'لوردوز', 'کایفوز', 'اسکولیوز', 'آرنج درد', 
  'مچ درد', 'مچ پا درد', 'کمر درد مزمن', 'گردن درد', 
  'شانه یخ‌زده', 'سندرم تونل کارپال', 'بورسیت', 'تاندونیت',
  'سندرم ایمپینجمنت', 'پارگی منیسک', 'آرتروز', 'نقرس',
  'فاشئیت پلانتار', 'سندرم پیریفورمیس', 'سندرم پاتلوفمورال'
];

const CONDITIONS_LIST = [
  'دیابت نوع 1', 'دیابت نوع 2', 'پیش‌دیابت', 'فشار خون', 'کلسترول بالا',
  'تری‌گلیسیرید بالا', 'بیماری قلبی', 'آریتمی قلبی', 'آسم', 'آرتریت',
  'روماتیسم مفصلی', 'پوکی استخوان', 'کم‌خونی', 'تالاسمی', 'مشکلات تیروئید',
  'کم‌کاری تیروئید', 'پرکاری تیروئید', 'مشکلات کلیوی', 'مشکلات کبدی',
  'کبد چرب', 'سندرم روده تحریک‌پذیر', 'ریفلاکس معده', 'زخم معده',
  'کولیت', 'میگرن', 'صرع', 'اضطراب', 'افسردگی', 'بی‌خوابی',
  'آپنه خواب', 'سندرم پای بی‌قرار', 'فیبرومیالژیا'
];

const MedicalCheckbox = memo(({ item, isChecked, onToggle, color, disabled = false }: {
  item: string; 
  isChecked: boolean; 
  onToggle: (item: string) => void;
  color: 'red' | 'yellow';
  disabled?: boolean;
}) => (
  <label 
    className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] transition-colors ${
      color === 'red' 
        ? 'hover:border-red-500/50 hover:bg-red-500/10' 
        : 'hover:border-yellow-500/50 hover:bg-yellow-500/10'
    } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
  >
    <input 
      type="checkbox" 
      checked={isChecked}
      onChange={() => onToggle(item)}
      disabled={disabled}
      className={`${color === 'red' ? 'accent-red-500' : 'accent-yellow-500'} w-4 h-4 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    />
    <span className="text-xs text-[var(--text-primary)]">{item}</span>
  </label>
));

const DayCard: React.FC<{ day: number; items: WorkoutItem[]; isActive?: boolean; onClick: () => void }> = ({ day, items, isActive, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
      isActive
        ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] shadow-lg shadow-[var(--accent-color)]/20'
        : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--accent-color)]/50 hover:bg-[var(--accent-color)]/5'
    }`}
    aria-label={`جلسه ${day}`}
    type="button"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--accent-color)]' : 'bg-[var(--text-secondary)]'}`} />
        <span className={`text-sm font-bold ${isActive ? 'text-[var(--accent-color)]' : 'text-[var(--text-primary)]'}`}>
          جلسه {day}
        </span>
      </div>
      {items.length > 0 && (
        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
          isActive 
            ? 'bg-[var(--accent-color)]/30 text-[var(--accent-color)]' 
            : 'bg-[var(--text-primary)]/10 text-[var(--text-secondary)]'
        }`}>
          {items.length} حرکت
        </span>
      )}
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-[var(--text-secondary)] text-right">برنامه‌ای ثبت نشده</p>
    ) : (
      <div className="space-y-2">
        {items.slice(0, 3).map((w, idx) => (
          <div key={idx} className="text-right text-xs bg-[var(--text-primary)]/5 rounded-lg px-2 py-1.5 border border-[var(--glass-border)]">
            <div className="font-semibold text-[var(--text-primary)]">{w.name}</div>
            <div className="flex items-center gap-2 mt-1 text-[var(--text-secondary)]">
              {w.sets && <span>ست: {w.sets}</span>}
              {w.reps && <span>تکرار: {w.reps}</span>}
            </div>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-[var(--accent-color)] font-semibold">+{items.length - 3} حرکت دیگر</p>
        )}
      </div>
    )}
  </motion.button>
);

const ProgramCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }> = ({
  title, 
  icon, 
  children, 
  accent = 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))'
}) => (
  <GlowCard className="h-full">
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--glass-border)]">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ background: accent }}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      </div>
      {children}
    </div>
  </GlowCard>
);

type CoachDetails = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
};

const ClientDashboard: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeUser, toggleTheme, theme } = useApp();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<UserPlans | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>(() => {
    const saved = localStorage.getItem('client_current_tab');
    return (saved as TabType) || 'dashboard';
  });
  const [profileTab, setProfileTab] = useState<'identity' | 'anthro' | 'medical' | 'coach'>('identity');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('client_sidebar_open');
    return saved !== 'false';
  });
  const [coachCode, setCoachCode] = useState<string>('');
  const [coachInfo, setCoachInfo] = useState<{ id: string; full_name: string } | null>(null);
  const [coachDetails, setCoachDetails] = useState<CoachDetails | null>(null);
  const [searchingCoach, setSearchingCoach] = useState(false);
  const [myRequests, setMyRequests] = useState<ProgramRequest[]>([]);
  const [requestType, setRequestType] = useState<'training' | 'diet' | 'supplements' | 'all'>('all');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [coachId, setCoachId] = useState<string>('');
  const [isEditingProfile, setIsEditingProfile] = useState(true);

  const greeting = useMemo(() => {
    if (fullName) return fullName;
    return user?.user_metadata?.full_name ?? user?.email ?? 'کاربر عزیز';
  }, [fullName, user?.email, user?.user_metadata?.full_name]);

  const sanitizeHandle = (handle?: string | null): string => {
    if (!handle) return '';
    return handle.trim().replace(/^@/, '').replace(/\s+/g, '');
  };

  const fetchCoachDetails = useCallback(
    async (id: string, fallbackName?: string) => {
      if (!id) return;
      if (!isSupabaseReady || !supabase) {
        setCoachDetails(prev => ({
          id,
          name: fallbackName || prev?.name || 'مربی',
          avatar: prev?.avatar || null,
          bio: prev?.bio || null,
          telegram: prev?.telegram || null,
          whatsapp: prev?.whatsapp || null
        }));
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, bio, telegram, whatsapp, profile_data')
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;

        const profileData = (data?.profile_data || {}) as Record<string, any>;
        setCoachDetails({
          id,
          name: data?.full_name || fallbackName || 'مربی',
          avatar: data?.avatar_url || profileData.avatar || null,
          bio: data?.bio || profileData.bio || null,
          telegram: data?.telegram || profileData.telegram || null,
          whatsapp: data?.whatsapp || profileData.whatsapp || null
        });
      } catch (err) {
        if (import.meta.env.DEV) console.warn('fetchCoachDetails error', err);
        setCoachDetails(prev => ({
          id,
          name: fallbackName || prev?.name || 'مربی',
          avatar: prev?.avatar || null,
          bio: prev?.bio || null,
          telegram: prev?.telegram || null,
          whatsapp: prev?.whatsapp || null
        }));
      }
    },
    []
  );

  useEffect(() => {
    localStorage.setItem('client_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('client_sidebar_open', String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    if (!user) {
      setPlan(null);
      return;
    }
    setFullName(user.user_metadata?.full_name ?? '');
    const fallbackPlan = activeUser && String(activeUser.id) === user.id ? activeUser.plans : null;
    if (!isSupabaseReady) {
      setPlan(fallbackPlan);
      return;
    }
    setLoading(true);
    const loadData = async () => {
      try {
        const [clientResponse, plansResponse] = await Promise.all([
          fetchClientById(user.id),
          fetchWorkoutPlansByClient(user.id)
        ]);
        
        const client = clientResponse.data;
        const plans = plansResponse.data;
        
        let profileCoachId = (user.user_metadata)?.coach_id as string || '';
        if (supabase && !profileCoachId) {
          try {
            const { data: profileData } = await supabase.from('profiles').select('coach_id').eq('id', user.id).maybeSingle();
            profileCoachId = profileData?.coach_id || '';
          } catch (err: unknown) {
            if (import.meta.env.DEV) console.warn('Failed to fetch coach_id from profiles', err);
          }
        }
        
        setCoachId(profileCoachId);
        if (client?.full_name) setFullName(client.full_name);
        if (client) {
          setClientInfo({ ...client, coach_id: client.coach_id || profileCoachId });
          if (client.profile_completed) {
            setIsEditingProfile(false);
            setProfileSaved(true);
          }
        } else {
          // Try to load from localStorage if available
          const localClientKey = `client_profile_${user.id}`;
          let localClientInfo: Client | null = null;
          try {
            const saved = localStorage.getItem(localClientKey);
            if (saved) {
              localClientInfo = JSON.parse(saved);
            }
          } catch {
            // ignore
          }

          setClientInfo(localClientInfo || {
            id: user.id,
            coach_id: profileCoachId,
            full_name: '',
            profile_data: {},
            notes: ''
          } as Client);
        }
        if (plans && Array.isArray(plans) && plans.length > 0 && plans[0]?.plan_data) {
          setPlan(plans[0].plan_data);
        } else {
          setPlan(fallbackPlan);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('loadData error', err);
        setPlan(fallbackPlan);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, activeUser, isSupabaseReady]);

  const handleProfileChange = (key: keyof Client, value: string | number | boolean | null | undefined) => {
    setClientInfo(prev => prev ? { ...prev, [key]: value } : null);
  };

  const setProfileDataField = (key: keyof ProfileData, value: ProfileData[keyof ProfileData]) => {
    setClientInfo(prev => {
      if (!prev) return null;
      const currentProfileData: ProfileData = (prev.profile_data || {}) as ProfileData;
      const newProfileData: ProfileData = { ...currentProfileData, [key]: value };
      return { ...prev, profile_data: newProfileData };
    });
  };

  const currentInjuries = useMemo(() => {
    const profileData = clientInfo?.profile_data as ProfileData | undefined;
    return Array.isArray(profileData?.injuries) ? profileData.injuries : [];
  }, [clientInfo?.profile_data]);

  const currentConditions = useMemo(() => {
    const profileData = clientInfo?.profile_data as ProfileData | undefined;
    return Array.isArray(profileData?.medicalConditions) ? profileData.medicalConditions : [];
  }, [clientInfo?.profile_data]);

  const handleInjuryToggle = useCallback((inj: string) => {
    setClientInfo(prev => {
      if (!prev) return null;
      const profileData = prev.profile_data as ProfileData | undefined;
      const current = Array.isArray(profileData?.injuries) ? profileData.injuries : [];
      const updated = current.includes(inj) 
        ? current.filter((i) => i !== inj) 
        : [...current, inj];
      return {
        ...prev, 
        profile_data: { ...(prev.profile_data || {}), injuries: updated } as ProfileData
      };
    });
  }, []);

  const handleConditionToggle = useCallback((cond: string) => {
    setClientInfo(prev => {
      if (!prev) return null;
      const profileData = prev.profile_data as ProfileData | undefined;
      const current = Array.isArray(profileData?.medicalConditions) ? profileData.medicalConditions : [];
      const updated = current.includes(cond) 
        ? current.filter((c) => c !== cond) 
        : [...current, cond];
      return {
        ...prev, 
        profile_data: { ...(prev.profile_data || {}), medicalConditions: updated } as ProfileData
      };
    });
  }, []);
      
  useEffect(() => {
    if (user?.id) {
      fetchRequestsByClient(user.id).then(setMyRequests).catch(() => {});
    }
  }, [user?.id]);

  const handleDeleteRequest = async (reqId: string) => {
    if (!user?.id) return;
    setDeletingRequestId(reqId);
    const target = myRequests.find(r => r.id === reqId);
    try {
      setMyRequests(prev => prev.filter(r => r.id !== reqId));
      deleteProgramRequestLocally(reqId, target?.coach_id, user.id);
      if (isSupabaseReady && supabase) {
        await supabase.from('program_requests').delete().eq('id', reqId);
      }
      toast.success('درخواست حذف شد');
    } catch (err) {
      if (import.meta.env.DEV) console.error('delete request error', err);
      toast.error('حذف درخواست ناموفق بود');
    } finally {
      setDeletingRequestId(null);
    }
  };

  useEffect(() => {
    if (user?.id) {
      const storedCode = localStorage.getItem(`client_coach_code_${user.id}`);
      if (storedCode) {
        setCoachCode(storedCode);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (coachId) {
      fetchCoachDetails(coachId, coachInfo?.full_name);
    }
  }, [coachId, coachInfo?.full_name, fetchCoachDetails]);

  const handleSearchCoach = async () => {
    if (!coachCode || coachCode.length !== 5) {
      toast.error('کد مربی باید 5 رقم باشد');
      return;
    }

    setSearchingCoach(true);
    try {
      const coach = await findCoachByCode(coachCode);
      if (coach) {
        setCoachInfo(coach);
        setCoachId(coach.id);
        fetchCoachDetails(coach.id, coach.full_name);
        if (user?.id) {
          localStorage.setItem(`client_coach_code_${user.id}`, coachCode);
        }
        toast.success(`مربی پیدا شد: ${coach.full_name}`);
      } else {
        setCoachInfo(null);
        setCoachDetails(null);
        toast.error('مربی با این کد پیدا نشد');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در جستجوی مربی';
      if (import.meta.env.DEV) console.error('handleSearchCoach error', err);
      toast.error(errorMessage);
    } finally {
      setSearchingCoach(false);
    }
  };

  const isProfileComplete = useMemo(() => {
    if (!clientInfo) return false;
    const pd = (clientInfo.profile_data || {}) as ProfileData;
    return !!(
      clientInfo.full_name &&
      clientInfo.gender &&
      clientInfo.age &&
      clientInfo.height &&
      clientInfo.weight &&
      clientInfo.goal &&
      pd.days &&
      pd.level &&
      pd.activity &&
      pd.nutritionGoals
    );
  }, [clientInfo]);

  const handleSendRequest = async () => {
    if (!coachId || !clientInfo || !user) {
      toast.error('ابتدا در تب مربی کد مربی را ثبت کنید');
      return;
    }
    
    if (!isProfileComplete) {
      toast.error('ابتدا پروفایل خود را تکمیل و ذخیره کنید');
      return;
    }
    
    if (!profileSaved) {
      toast.error('لطفا ابتدا اطلاعات پروفایل را ذخیره کنید');
      return;
    }
    
    const now = Date.now();
    const hasRecentSimilar = myRequests.some((r) => {
      if (r.request_type !== requestType) return false;
      if (!r.created_at) return false;
      const created = new Date(r.created_at).getTime();
      const twelveHours = 1000 * 60 * 60 * 12;
      return now - created < twelveHours && (r.status === 'pending' || r.status === 'accepted');
    });
    if (hasRecentSimilar) {
      toast.error('درخواست مشابه در ۱۲ ساعت اخیر ثبت شده است');
      return;
    }

    setSendingRequest(true);
        try {
          const profileData = (clientInfo.profile_data || {}) as ProfileData;
      const coachName = coachDetails?.name || coachInfo?.full_name || 'مربی';
      const clientData = {
            id: user.id,
        name: clientInfo.full_name || user.user_metadata?.full_name || user.email || '',
            gender: clientInfo.gender,
            age: clientInfo.age,
            height: clientInfo.height,
            weight: clientInfo.weight,
        goal: clientInfo.goal || profileData.nutritionGoals,
            days: profileData.days,
            level: profileData.level,
            activity: profileData.activity,
            nutritionGoals: profileData.nutritionGoals,
            phone: profileData.phone,
            email: profileData.email,
            job: profileData.job,
            exp: profileData.exp,
            sleep: profileData.sleep,
            smoke: profileData.smoke,
            alcohol: profileData.alcohol,
            caffeine: profileData.caffeine,
            allergy: profileData.allergy,
            injuries: profileData.injuries || [],
            medicalConditions: profileData.medicalConditions || [],
            medications: profileData.medications,
            dietType: profileData.dietType,
            waterIntake: profileData.waterIntake,
            mealFrequency: profileData.mealFrequency,
            foodPreferences: profileData.foodPreferences || [],
            targetWeight: profileData.targetWeight,
            bodyFat: profileData.bodyFat,
            measurements: profileData.measurements || {},
        notes: clientInfo.notes
      };

      await createProgramRequest({
        client_id: user.id,
        client_name: clientInfo.full_name || user.user_metadata?.full_name || user.email || '',
        coach_id: coachId,
        coach_code: coachCode,
        request_type: requestType,
        status: 'pending',
        client_data: clientData
      });
      
      const requests = await fetchRequestsByClient(user.id);
      setMyRequests(requests);
      
      toast.success('درخواست برنامه با موفقیت ارسال شد');
      
      setClientInfo(prev => prev ? { ...prev, coach_id: coachId } : null);
      fetchCoachDetails(coachId, coachName);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ارسال درخواست';
      if (import.meta.env.DEV) {
        console.error('handleSendRequest error', err);
      }
      toast.error(errorMessage);
    } finally {
      setSendingRequest(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!clientInfo || !user) {
      toast.error('اطلاعات کاربر یافت نشد');
      return;
    }
    
    setSavingProfile(true);
    setSaveMessage(null);
    
    try {
      const effectiveCoachId = coachId || coachInfo?.id || clientInfo.coach_id || user.id;
      
      const payload: Partial<Client> = {
        ...clientInfo,
        id: user.id,
        coach_id: effectiveCoachId,
        profile_completed: true,
        updated_at: new Date().toISOString(),
        created_at: clientInfo.created_at || new Date().toISOString()
      };

      fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'pre-fix',
          hypothesisId: 'A',
          location: 'ClientDashboard.tsx:handleSaveProfile',
          message: 'about to updateClient',
          data: { userId: user.id, effectiveCoachId, payloadKeys: Object.keys(payload || {}), profileCompleted: payload.profile_completed },
          timestamp: Date.now()
        })
      }).catch(() => {});

      const savedClient = await updateClient(user.id, payload);
      
      setClientInfo(savedClient);
      setCoachId(effectiveCoachId);
      setProfileSaved(true);
      setSaveMessage('✓ ذخیره شد');
      setIsEditingProfile(false);
      
      toast.success('اطلاعات با موفقیت ذخیره شد');
      setTimeout(() => setSaveMessage(null), 3000);
      
      if (isSupabaseReady && supabase) {
        try {
          await supabase
            .from('profiles')
            .update({ 
              full_name: savedClient.full_name,
              coach_id: effectiveCoachId 
            })
            .eq('id', user.id);
        } catch (profileErr: unknown) {
          if (import.meta.env.DEV) {
            console.warn('Failed to sync profile to profiles table', profileErr);
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ذخیره اطلاعات';
      if (import.meta.env.DEV) {
        console.error('saveProfile error', err);
      }
      toast.error(errorMessage);
      setSaveMessage('✗ خطا در ذخیره');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const copyCoachId = useCallback(() => {
    if (!coachId) return;
    navigator.clipboard.writeText(coachId);
    toast.success('کد مربی کپی شد');
  }, [coachId]);

  const pendingRequests = useMemo(() => myRequests.filter(r => r.status === 'pending'), [myRequests]);

  const stats = useMemo(() => {
    const workoutDays = plan?.workouts ? Object.values(plan.workouts).filter(d => (d || []).length > 0).length : 0;
    const totalExercises = plan?.workouts ? Object.values(plan.workouts).reduce((acc, day) => acc + ((day || []).length), 0) : 0;
    const dietItems = plan?.diet?.length ?? 0;
    const suppCount = plan?.supps?.length ?? 0;
    return { workoutDays, totalExercises, dietItems, suppCount };
  }, [plan]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-secondary)] font-semibold">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentDayWorkouts = selectedDay && plan?.workouts?.[selectedDay] ? plan.workouts[selectedDay] : [];

  const navItems = [
    { id: 'dashboard' as TabType, icon: <BarChart3 size={20} />, label: 'داشبورد' },
    { id: 'training' as TabType, icon: <Dumbbell size={20} />, label: 'برنامه تمرین' },
    { id: 'nutrition' as TabType, icon: <UtensilsCrossed size={20} />, label: 'رژیم غذایی' },
    { id: 'supplements' as TabType, icon: <Pill size={20} />, label: 'مکمل‌ها' },
    { id: 'portfolio' as TabType, icon: <FileText size={20} />, label: 'کارتابل برنامه‌ها' },
    { id: 'request' as TabType, icon: <Send size={20} />, label: 'درخواست برنامه', badge: pendingRequests.length },
    { id: 'profile' as TabType, icon: <UserIcon size={20} />, label: 'پروفایل من' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 88 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 glass-panel border-l border-[var(--glass-border)] z-30"
      >
        <div className="p-5 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[var(--accent-color)]/30"
            >
              V2
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h1 className="text-xl font-black bg-gradient-to-l from-[var(--accent-color)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                    VO₂MAX
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">پنل شاگرد</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentTab === item.id}
              onClick={() => setCurrentTab(item.id)}
              badge={item.badge}
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-[var(--glass-border)] space-y-2">
            <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-[var(--glass-bg)] text-[var(--text-secondary)] transition"
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
              <X size={18} />
            </motion.div>
            </button>
            </div>
      </motion.aside>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 glass-panel rounded-xl shadow-lg"
      >
        <Menu size={24} />
      </motion.button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-80 glass-panel z-50 flex flex-col shadow-2xl"
            >
              <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold">
                    V2
          </div>
                  <h1 className="text-lg font-black">VO₂MAX</h1>
                </div>
            <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--glass-bg)] transition"
                >
                  <X size={24} />
            </button>
              </div>
              <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                {navItems.map(item => (
                  <NavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={currentTab === item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    badge={item.badge}
                  />
                ))}
              </nav>
              <div className="p-4 border-t border-[var(--glass-border)]">
            <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition font-semibold"
                >
                  <LogOut size={18} />
                  خروج از حساب
            </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
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

              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-[var(--glass-border)]">
                <div className="text-left">
                  <p className="text-sm font-bold">{greeting || 'کاربر'}</p>
                  <p className="text-xs text-[var(--text-secondary)]">شاگرد</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold shadow-lg cursor-pointer"
                  onClick={() => setCurrentTab('profile')}
                >
                  {greeting?.charAt(0) || 'ش'}
                </motion.div>
              </div>

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

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <GlowCard>
                    <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-black mb-1">
                          <TextAnimation.FadeInText
                            text={`سلام ${greeting?.split(' ')[0] || 'دوست'} عزیز 👋`}
                            className="text-2xl font-black"
                            stagger={50}
                          />
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm">
                          {plan ? 'برنامه شما آماده است، روی کارت‌ها کلیک کنید.' : 'درخواست برنامه بدهید تا مربی برای شما برنامه بسازد.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-right min-w-[150px]">
                          <p className="text-xs text-[var(--text-secondary)]">وضعیت برنامه</p>
                          <p className="text-sm font-bold text-[var(--text-primary)]">{plan ? 'فعال' : 'منتظر برنامه'}</p>
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-right min-w-[150px]">
                          <p className="text-xs text-[var(--text-secondary)]">مربی متصل</p>
                          <p className="text-sm font-bold text-[var(--text-primary)]">
                            {coachInfo?.full_name || (coachId ? 'کد ثبت شده' : 'نامشخص')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <HoverCard variant="glow" className="transform hover:scale-105 transition-all duration-300">
                    <StatCard
                      icon={<Dumbbell size={22} className="text-blue-500" />}
                      label="روزهای تمرین فعال"
                      value={stats.workoutDays}
                      gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                      delay={0}
                    />
                  </HoverCard>

                  <HoverCard variant="tilt" className="transform hover:scale-105 transition-all duration-300">
                    <StatCard
                      icon={<Layers size={22} className="text-green-500" />}
                      label="کل حرکات"
                      value={stats.totalExercises}
                      gradient="linear-gradient(135deg, #10b981, #059669)"
                      delay={0.1}
                    />
                  </HoverCard>

                  <HoverCard variant="morph" className="transform hover:scale-105 transition-all duration-300">
                    <StatCard
                      icon={<UtensilsCrossed size={22} className="text-orange-500" />}
                      label="آیتم‌های رژیم"
                      value={stats.dietItems}
                      gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                      delay={0.2}
                    />
                  </HoverCard>

                  <HoverCard variant="border" className="transform hover:scale-105 transition-all duration-300">
                    <StatCard
                      icon={<Send size={22} className="text-purple-500" />}
                      label="درخواست‌های باز"
                      value={pendingRequests.length}
                      gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                      delay={0.3}
                    />
                  </HoverCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <motion.div variants={itemVariants} className="lg:col-span-1">
                    <GlowCard>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                            <Award size={20} />
            </div>
            <div>
                            <h4 className="font-bold">کد مربی شما</h4>
                            <p className="text-xs text-[var(--text-secondary)]">برای هماهنگی با مربی</p>
            </div>
          </div>

                        {coachId ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={copyCoachId}
                            className="relative bg-gradient-to-l from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/30 cursor-pointer group"
                          >
                            <p className="text-3xl font-mono font-black text-center tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
                              {coachId}
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
                              کد مربی ثبت نشده است
                            </p>
                          </div>
                        )}

            <button
                          onClick={() => setCurrentTab('request')}
                          className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-[var(--accent-color)]/10 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/20 transition"
                        >
                          ثبت یا جستجوی مربی
            </button>
              </div>
                    </GlowCard>
                  </motion.div>

                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-[var(--accent-color)]" />
                      دسترسی سریع
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <QuickAction
                        icon={<Dumbbell size={20} />}
                        label="برنامه تمرین"
                        sublabel="مشاهده جلسات"
                        onClick={() => setCurrentTab('training')}
                        gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                      />
                      <QuickAction
                        icon={<UtensilsCrossed size={20} />}
                        label="رژیم غذایی"
                        sublabel="جزئیات وعده‌ها"
                        onClick={() => setCurrentTab('nutrition')}
                        gradient="linear-gradient(135deg, #10b981, #059669)"
                      />
                      <QuickAction
                        icon={<Pill size={20} />}
                        label="مکمل‌ها"
                        sublabel="زمان‌بندی مصرف"
                        onClick={() => setCurrentTab('supplements')}
                        gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                      />
                      <QuickAction
                        icon={<Send size={20} />}
                        label="ارسال درخواست"
                        sublabel="برنامه جدید از مربی"
                        onClick={() => setCurrentTab('request')}
                        gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <GlowCard>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold flex items-center gap-2">
                            <Dumbbell size={18} className="text-[var(--accent-color)]" />
                            خلاصه تمرین
                          </h4>
                          {plan && (
            <button
                              onClick={() => setCurrentTab('training')}
                              className="text-xs text-[var(--accent-color)] hover:underline font-semibold"
            >
                              مشاهده کامل
            </button>
                          )}
          </div>

                        {plan && plan.workouts ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from({ length: 4 }).map((_, idx) => {
                              const day = idx + 1;
                              const items = plan.workouts?.[day] || [];
                              return (
                                <DayCard
                                  key={day}
                                  day={day}
                                  items={items}
                                  isActive={selectedDay === day}
                                  onClick={() => {
                                    setSelectedDay(day);
                                    setCurrentTab('training');
                                  }}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <EmptyState
                            icon={<Dumbbell size={32} />}
                            title="برنامه‌ای موجود نیست"
                            description="برای دریافت برنامه جدید از مربی درخواست بفرستید"
                            action={{ label: 'ارسال درخواست', onClick: () => setCurrentTab('request') }}
                          />
                        )}
                      </div>
                    </GlowCard>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <GlowCard>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold flex items-center gap-2">
                            <Send size={18} className="text-[var(--accent-color)]" />
                            وضعیت درخواست‌ها
                          </h4>
                          <span className="px-3 py-1 rounded-full bg-[var(--glass-bg)] text-xs font-bold text-[var(--text-secondary)]">
                            {myRequests.length} مورد
                          </span>
                        </div>

                        {myRequests.length === 0 ? (
                          <EmptyState
                            icon={<AlertCircle size={32} />}
                            title="درخواستی ثبت نشده"
                            description="کد مربی را وارد کنید و درخواست خود را ارسال کنید"
                            action={{ label: 'درخواست برنامه', onClick: () => setCurrentTab('request') }}
                          />
                        ) : (
                          <div className="space-y-3">
                            {myRequests.slice(0, 4).map((req) => (
                              <div
                                key={req.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                                    <Send size={16} className="text-[var(--accent-color)]" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {req.request_type === 'all'
                                        ? 'برنامه کامل'
                                        : req.request_type === 'training'
                                        ? 'تمرین'
                                        : req.request_type === 'diet'
                                        ? 'رژیم غذایی'
                                        : 'مکمل'}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                      {req.created_at ? new Date(req.created_at).toLocaleDateString('fa-IR') : ''}
                                    </p>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  req.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-600'
                                    : req.status === 'accepted'
                                    ? 'bg-emerald-500/20 text-emerald-600'
                                    : req.status === 'completed'
                                    ? 'bg-blue-500/20 text-blue-500'
                                    : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {req.status === 'pending'
                                    ? 'در انتظار'
                                    : req.status === 'accepted'
                                    ? 'تأیید شده'
                                    : req.status === 'completed'
                                    ? 'تکمیل شده'
                                    : 'رد شده'}
                                </span>
                              </div>
                            ))}
                            {myRequests.length > 4 && (
                              <button
                                onClick={() => setCurrentTab('request')}
                                className="w-full text-sm text-[var(--accent-color)] hover:underline font-semibold"
                              >
                                مشاهده همه درخواست‌ها
                              </button>
                            )}
                </div>
                        )}
                      </div>
                    </GlowCard>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentTab === 'training' && (
              <motion.div key="training" {...scaleIn} className="space-y-4">
                  <ProgramCard
                    title="برنامه تمرینی هفتگی"
                    icon={<Dumbbell size={20} />}
                  accent="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                  >
                    {plan && plan.workouts ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                          {Array.from({ length: 7 }).map((_, idx) => {
                            const day = idx + 1;
                            const items = plan.workouts?.[day] || [];
                            return (
                              <DayCard
                                key={day}
                                day={day}
                                items={items}
                                isActive={selectedDay === day}
                                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                              />
                            );
                          })}
                        </div>

                      {selectedDay && currentDayWorkouts.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          className="glass-card rounded-2xl p-6 border border-[var(--glass-border)]"
                          >
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--glass-border)]">
                              <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <Target size={20} className="text-[var(--accent-color)]" />
                                جزئیات جلسه {selectedDay}
                              </h4>
                              <button
                                onClick={() => setSelectedDay(null)}
                                className="p-1.5 rounded-lg hover:bg-[var(--text-primary)]/10 transition"
                                aria-label="بستن"
                                type="button"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="space-y-3">
                              {currentDayWorkouts.map((w, idx) => (
                                <div
                                  key={idx}
                                  className="p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="font-bold text-[var(--text-primary)] mb-1">{w.name}</div>
                                      {w.name2 && <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">+ {w.name2}</div>}
                                      {w.name3 && <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">+ {w.name3}</div>}
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                                      {w.mode === 'cardio' ? 'هوازی' : w.mode === 'warmup' ? 'گرم' : w.mode === 'cooldown' ? 'سرد' : 'مقاومتی'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-secondary)]">
                                    {w.sets && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold">ست:</span>
                                        <span>{w.sets}</span>
                                      </div>
                                    )}
                                    {w.reps && (
                                      <div className="flex items-center gap-1">
                                        <span className="font-semibold">تکرار:</span>
                                        <span>{w.reps}</span>
                                      </div>
                                    )}
                                    {w.rest && (
                                      <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{w.rest} {w.restUnit === 'm' ? 'دقیقه' : 'ثانیه'}</span>
                                      </div>
                                    )}
                                  </div>
                                  {w.note && (
                                    <p className="text-xs text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--glass-border)]">
                                      {w.note}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                    ) : (
                        <div className="text-center text-sm text-[var(--text-secondary)]">
                          یک جلسه را برای جزئیات انتخاب کنید
                        </div>
                      )}
                      </div>
                  ) : (
                    <EmptyState
                      icon={<Dumbbell size={36} />}
                      title="برنامه‌ای ثبت نشده"
                      description="از مربی خود درخواست برنامه کنید"
                      action={{ label: 'ارسال درخواست', onClick: () => setCurrentTab('request') }}
                    />
                    )}
                  </ProgramCard>
              </motion.div>
                )}

            {currentTab === 'nutrition' && (
              <motion.div key="nutrition" {...scaleIn}>
                  <ProgramCard
                    title="رژیم غذایی"
                    icon={<UtensilsCrossed size={20} />}
                  accent="linear-gradient(135deg, #10b981, #059669)"
                  >
                    {plan && plan.diet && plan.diet.length > 0 ? (
                      <div className="space-y-3">
                        {plan.diet.map((d, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-[var(--text-primary)]">{d.name}</span>
                              <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {d.meal}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-secondary)] flex-wrap">
                              {d.amount && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">مقدار:</span>
                                  <span>{d.amount} {d.unit}</span>
                                </div>
                              )}
                              {d.c && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">کربوهیدرات:</span>
                                  <span>{d.c}g</span>
                                </div>
                              )}
                              {d.p && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">پروتئین:</span>
                                  <span>{d.p}g</span>
                                </div>
                              )}
                              {d.f && (
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold">چربی:</span>
                                  <span>{d.f}g</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                    <EmptyState
                      icon={<UtensilsCrossed size={36} />}
                      title="رژیم ثبت نشده است"
                      description="درخواست برنامه غذایی جدید بدهید"
                      action={{ label: 'ارسال درخواست', onClick: () => setCurrentTab('request') }}
                    />
                    )}
                  </ProgramCard>
              </motion.div>
                )}

            {currentTab === 'supplements' && (
              <motion.div key="supplements" {...scaleIn}>
                  <ProgramCard
                    title="مکمل‌ها"
                    icon={<Pill size={20} />}
                  accent="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                  >
                    {plan && plan.supps && plan.supps.length > 0 ? (
                      <div className="space-y-3">
                        {plan.supps.map((s, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-[var(--text-primary)]">{s.name}</span>
                              {s.time && (
                                <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                                  <Clock size={12} />
                                  {s.time}
                                </span>
                              )}
                            </div>
                            {s.dose && (
                              <div className="text-xs text-[var(--text-secondary)] mt-2">
                                <span className="font-semibold">دوز:</span> {s.dose}
                              </div>
                            )}
                            {s.note && (
                              <p className="text-xs text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--glass-border)]">
                                {s.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                    <EmptyState
                      icon={<Pill size={36} />}
                      title="مکملی ثبت نشده"
                      description="برای دریافت مکمل‌ها با مربی هماهنگ کنید"
                      action={{ label: 'ارسال درخواست', onClick: () => setCurrentTab('request') }}
                    />
                  )}
                </ProgramCard>
              </motion.div>
            )}

            {currentTab === 'portfolio' && (
              <motion.div
                key="portfolio"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">کارتابل برنامه‌های شما</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      مدیریت و پیگیری برنامه‌های تمرینی، غذایی و مکمل‌های شما
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-sm font-bold text-[var(--text-primary)]">
                        {Object.keys(plan?.workouts || {}).length} جلسه تمرینی
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {plan?.diet?.length || 0} وعده غذایی • {plan?.supps?.length || 0} مکمل
                      </div>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-xl hover:bg-[var(--accent-secondary)] transition"
                    >
                      <Printer size={18} />
                      پرینت برنامه‌ها
                    </button>
                  </div>
                </div>

                {/* برنامه تمرینی */}
                <ProgramCard
                  title="برنامه تمرینی هفتگی"
                  icon={<Dumbbell size={20} />}
                  accent="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                >
                  {plan && plan.workouts ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                        {Array.from({ length: 7 }).map((_, idx) => {
                          const day = idx + 1;
                          const items = plan.workouts?.[day] || [];
                          return (
                            <DayCard
                              key={day}
                              day={day}
                              items={items}
                              isActive={selectedDay === day}
                              onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                            />
                          );
                        })}
                      </div>

                      {selectedDay && currentDayWorkouts.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass-card rounded-2xl p-6 border border-[var(--glass-border)]"
                        >
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--glass-border)]">
                            <h4 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                              <Target size={20} className="text-[var(--accent-color)]" />
                              جزئیات جلسه {selectedDay}
                            </h4>
                            <button
                              onClick={() => setSelectedDay(null)}
                              className="p-1.5 rounded-lg hover:bg-[var(--text-primary)]/10 transition"
                              aria-label="بستن"
                              type="button"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <div className="space-y-3">
                            {currentDayWorkouts.map((w, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-xl bg-[var(--text-primary)]/5 border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <div className="font-bold text-[var(--text-primary)] mb-1">{w.name}</div>
                                    {w.name2 && <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">+ {w.name2}</div>}
                                    {w.name3 && <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">+ {w.name3}</div>}
                                  </div>
                                  <span className="text-xs px-2 py-1 rounded-lg bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                                    {w.mode === 'cardio' ? 'هوازی' : w.mode === 'warmup' ? 'گرم' : w.mode === 'cooldown' ? 'سرد' : 'مقاومتی'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-secondary)]">
                                  {w.sets && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-semibold">ست:</span>
                                      <span>{w.sets}</span>
                                    </div>
                                  )}
                                  {w.reps && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-semibold">تکرار:</span>
                                      <span>{w.reps}</span>
                                    </div>
                                  )}
                                  {w.rest && (
                                    <div className="flex items-center gap-1">
                                      <Clock size={12} />
                                      <span>{w.rest} {w.restUnit === 'm' ? 'دقیقه' : 'ثانیه'}</span>
                                    </div>
                                  )}
                                </div>
                                {w.note && (
                                  <p className="text-xs text-[var(--text-secondary)] mt-2 pt-2 border-t border-[var(--glass-border)]">
                                    {w.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center text-sm text-[var(--text-secondary)]">
                          یک جلسه را برای جزئیات انتخاب کنید
                        </div>
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Dumbbell size={36} />}
                      title="برنامه‌ای ثبت نشده"
                      description="درخواست برنامه بدهید تا مربی برای شما برنامه بسازد"
                    />
                  )}
                </ProgramCard>

                {/* رژیم غذایی */}
                <ProgramCard
                  title="رژیم غذایی"
                  icon={<UtensilsCrossed size={20} />}
                  accent="linear-gradient(135deg, #10b981, #059669)"
                >
                  {plan.diet && plan.diet.length > 0 ? (
                    <div className="space-y-4">
                      {plan.diet.map((d, i) => (
                        <DietItem key={i} diet={d} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<UtensilsCrossed size={36} />}
                      title="رژیمی ثبت نشده"
                      description="درخواست رژیم بدهید تا مربی برای شما رژیم بسازد"
                    />
                  )}
                </ProgramCard>

                {/* مکمل‌ها */}
                <ProgramCard
                  title="مکمل‌ها"
                  icon={<Pill size={20} />}
                  accent="linear-gradient(135deg, #8b5cf6, #6d28d9)"
                >
                  {plan.supps && plan.supps.length > 0 ? (
                    <div className="space-y-4">
                      {plan.supps.map((s, i) => (
                        <SupplementItem key={i} supplement={s} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Pill size={36} />}
                      title="مکملی ثبت نشده"
                      description="درخواست مکمل بدهید تا مربی برای شما مکمل تجویز کند"
                    />
                  )}
                </ProgramCard>

                {/* اقدامات */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentTab('request')}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-color)] text-white rounded-xl hover:bg-[var(--accent-secondary)] transition font-semibold"
                  >
                    <Plus size={18} />
                    درخواست برنامه جدید
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-semibold"
                  >
                    <Printer size={18} />
                    پرینت همه برنامه‌ها
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentTab === 'request' && (
              <motion.div
                key="request"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <ProgramCard
                  title="درخواست برنامه"
                  icon={<Send size={20} />}
                  accent="linear-gradient(135deg, #10b981, #059669)"
                >
                  <div className="space-y-6">
                    <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                        <Search size={16} />
                        اتصال به مربی
                      </h4>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-[var(--text-secondary)] mb-2 block">کد 5 رقمی مربی</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={coachCode}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                                setCoachCode(val);
                              }}
                              placeholder="مثال: 12345"
                              className="flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-lg font-bold text-center tracking-widest text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                              maxLength={5}
                            />
                            <motion.button
                              onClick={handleSearchCoach}
                              disabled={coachCode.length !== 5 || searchingCoach}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              type="button"
                            >
                              {searchingCoach ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Search size={16} />
                              )}
                              جستجو
                            </motion.button>
                        </div>
                        </div>

                        {coachInfo && (
                          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                              {coachInfo.full_name?.charAt(0) || '👤'}
                            </div>
                            <div>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">مربی شما:</p>
                              <p className="text-sm font-bold text-[var(--text-primary)]">{coachInfo.full_name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1">
                                <UserCheck size={12} />
                                <span>تأیید شده</span>
                              </div>
                            </div>
                      </div>
                    )}
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] mt-3">
                        کد 5 رقمی مربی را از مربی خود دریافت کنید. پس از وارد کردن کد، نام مربی نمایش داده می‌شود.
                      </p>
                    </div>

                    {coachInfo && (
                      <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                          <FileText size={16} />
                          نوع درخواست
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { value: 'all', label: 'همه برنامه‌ها', icon: '📋', desc: 'تمرین + رژیم + مکمل' },
                            { value: 'training', label: 'برنامه تمرینی', icon: '🏋️', desc: 'فقط تمرین' },
                            { value: 'diet', label: 'رژیم غذایی', icon: '🥗', desc: 'فقط رژیم' },
                            { value: 'supplements', label: 'مکمل‌ها', icon: '💊', desc: 'فقط مکمل' }
                          ].map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setRequestType(type.value as 'training' | 'diet' | 'supplements' | 'all')}
                              className={`p-4 rounded-xl border-2 transition-all text-right ${
                                requestType === type.value
                                  ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 shadow-lg'
                                  : 'border-[var(--glass-border)] hover:border-[var(--accent-color)]/50'
                              }`}
                              type="button"
                            >
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <div className="text-sm font-bold text-[var(--text-primary)]">{type.label}</div>
                              <div className="text-[10px] text-[var(--text-secondary)] mt-1">{type.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {coachInfo && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/30">
                        <div className="text-center sm:text-right">
                          <p className="text-sm font-bold text-[var(--text-primary)]">آماده ارسال درخواست</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            اطلاعات پروفایل شما به مربی {coachInfo.full_name} ارسال خواهد شد
                          </p>
                        </div>
                        <motion.button
                          onClick={handleSendRequest}
                          disabled={sendingRequest}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-base shadow-xl shadow-emerald-500/30 flex items-center gap-3 disabled:opacity-50"
                          type="button"
                        >
                          {sendingRequest ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send size={20} />
                          )}
                          ارسال درخواست به مربی
                        </motion.button>
                      </div>
                    )}

                    {myRequests.length > 0 && (
                      <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-purple-500 rounded-full" />
                          <Clock size={16} />
                          درخواست‌های من
                        </h4>

                        <div className="space-y-3">
                          {myRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] flex flex-col sm:flex-row justify-between gap-4"
                            >
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                    req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                    req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                                    req.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                                    'bg-red-500/10 text-red-500'
                                  }`}>
                                    {req.status === 'pending' ? '⏳ در انتظار' :
                                     req.status === 'accepted' ? '✓ تأیید شده' :
                                     req.status === 'completed' ? '✅ تکمیل شده' : '✗ رد شده'}
                                  </span>
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    {req.request_type === 'all' ? 'همه برنامه‌ها' :
                                     req.request_type === 'training' ? 'برنامه تمرینی' :
                                     req.request_type === 'diet' ? 'رژیم غذایی' : 'مکمل‌ها'}
                                  </span>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {req.created_at ? new Date(req.created_at).toLocaleDateString('fa-IR') : ''}
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                {req.coach_response && (
                                  <div className="text-xs text-[var(--text-secondary)] p-2 rounded-lg bg-[var(--text-primary)]/5">
                                    پاسخ مربی: {req.coach_response}
                                  </div>
                                )}
                                <button
                                  onClick={() => handleDeleteRequest(req.id)}
                                  disabled={deletingRequestId === req.id}
                                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 disabled:opacity-50"
                                >
                                  {deletingRequestId === req.id ? 'حذف...' : 'حذف درخواست'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!coachInfo && (
                      <div className="text-center py-8">
                        <AlertCircle size={48} className="mx-auto mb-4 text-amber-500 opacity-50" />
                        <p className="text-sm text-[var(--text-secondary)]">
                          برای ارسال درخواست برنامه، ابتدا کد مربی خود را وارد کنید
                        </p>
                      </div>
                    )}
                  </div>
                </ProgramCard>
              </motion.div>
            )}

            {currentTab === 'profile' && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <ProgramCard
                  title="پروفایل کاربری"
                  icon={<UserIcon size={20} />}
                  accent="linear-gradient(135deg, #6366f1, #3b82f6)"
                >
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {(['identity', 'anthro', 'medical', 'coach'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setProfileTab(tab)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                            profileTab === tab
                              ? 'bg-[var(--accent-color)] text-white border-transparent shadow-lg'
                              : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--accent-color)]/50'
                          }`}
                          type="button"
                        >
                          {tab === 'identity' ? 'مشخصات هویتی' : tab === 'anthro' ? 'مشخصات آنتروپومتریک' : tab === 'medical' ? 'موارد پزشکی' : 'اتصال به مربی'}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {profileTab === 'identity' && (
                        <div className="space-y-6">
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              اطلاعات پایه
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <Field label="نام کامل">
                                <Input value={`${clientInfo?.full_name ?? ''}`} onChange={(v) => handleProfileChange('full_name', v)} placeholder="مثال: علی رضایی" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="جنسیت">
                                <Select value={`${clientInfo?.gender ?? ''}`} onChange={(v) => handleProfileChange('gender', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'male', label: 'آقا' },
                                  { value: 'female', label: 'خانم' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="سن">
                                <Input value={`${clientInfo?.age ?? ''}`} onChange={(v) => handleProfileChange('age', v)} placeholder="سال" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="قد (cm)">
                                <Input value={`${clientInfo?.height ?? ''}`} onChange={(v) => handleProfileChange('height', v)} placeholder="مثال: 175" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="وزن فعلی (kg)">
                                <Input value={`${clientInfo?.weight ?? ''}`} onChange={(v) => handleProfileChange('weight', v)} placeholder="مثال: 72" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="هدف تمرینی">
                                <Select value={`${clientInfo?.goal ?? ''}`} onChange={(v) => handleProfileChange('goal', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'weight-loss', label: 'کاهش وزن' },
                                  { value: 'weight-gain', label: 'افزایش وزن' },
                                  { value: 'muscle-gain', label: 'عضله‌سازی' },
                                  { value: 'maintenance', label: 'حفظ وزن' },
                                  { value: 'recomp', label: 'ریکامپ' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              اطلاعات تماس
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="شماره تماس">
                                <Input value={`${clientInfo?.profile_data?.phone ?? ''}`} onChange={(v) => setProfileDataField('phone', v)} placeholder="09xxxxxxxxx" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="ایمیل">
                                <Input value={`${clientInfo?.profile_data?.email ?? ''}`} onChange={(v) => setProfileDataField('email', v)} placeholder="example@mail.com" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="آدرس">
                                <Input value={`${clientInfo?.profile_data?.address ?? ''}`} onChange={(v) => setProfileDataField('address', v)} placeholder="استان، شهر، خیابان..." disabled={!isEditingProfile} />
                              </Field>
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              اطلاعات تمرینی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                              <Field label="سطح تمرین">
                                <Select value={`${clientInfo?.profile_data?.level ?? ''}`} onChange={(v) => setProfileDataField('level', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'beginner', label: 'مبتدی (0-6 ماه)' },
                                  { value: 'intermediate', label: 'متوسط (6-24 ماه)' },
                                  { value: 'advanced', label: 'پیشرفته (2-5 سال)' },
                                  { value: 'pro', label: 'حرفه‌ای (+5 سال)' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="روز تمرین در هفته">
                                <Select value={`${clientInfo?.profile_data?.days ?? ''}`} onChange={(v) => setProfileDataField('days', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: '1', label: '1 روز' },
                                  { value: '2', label: '2 روز' },
                                  { value: '3', label: '3 روز' },
                                  { value: '4', label: '4 روز' },
                                  { value: '5', label: '5 روز' },
                                  { value: '6', label: '6 روز' },
                                  { value: '7', label: '7 روز' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="سابقه تمرین (سال)">
                                <Input value={`${clientInfo?.profile_data?.exp ?? ''}`} onChange={(v) => setProfileDataField('exp', v)} placeholder="مثلاً 2" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="سطح فعالیت">
                                <Select value={`${clientInfo?.profile_data?.activity ?? ''}`} onChange={(v) => setProfileDataField('activity', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: '1.2', label: 'کم‌تحرک (شغل نشسته)' },
                                  { value: '1.375', label: 'سبک (پیاده‌روی کم)' },
                                  { value: '1.55', label: 'متوسط (فعالیت معمول)' },
                                  { value: '1.725', label: 'سنگین (شغل فیزیکی)' },
                                  { value: '1.9', label: 'خیلی سنگین (ورزشکار)' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              هدف تغذیه
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <Field label="هدف تغذیه‌ای">
                                <Select value={`${clientInfo?.profile_data?.nutritionGoals ?? ''}`} onChange={(v) => setProfileDataField('nutritionGoals', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'weight-loss', label: 'کاهش وزن' },
                                  { value: 'weight-gain', label: 'افزایش وزن' },
                                  { value: 'muscle-gain', label: 'عضله‌سازی' },
                                  { value: 'maintenance', label: 'حفظ وزن' },
                                  { value: 'recomp', label: 'ریکامپ' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="نوع رژیم">
                                <Select value={`${clientInfo?.profile_data?.dietType ?? ''}`} onChange={(v) => setProfileDataField('dietType', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'normal', label: 'عادی' },
                                  { value: 'vegetarian', label: 'گیاهخوار' },
                                  { value: 'vegan', label: 'وگان' },
                                  { value: 'keto', label: 'کتوژنیک' },
                                  { value: 'paleo', label: 'پالئو' },
                                  { value: 'halal', label: 'حلال' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="درصد چربی (%)">
                                <Input value={`${clientInfo?.profile_data?.bodyFat ?? ''}`} onChange={(v) => setProfileDataField('bodyFat', v)} placeholder="مثلاً 15" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="وزن هدف (kg)">
                                <Input value={`${clientInfo?.profile_data?.targetWeight ?? ''}`} onChange={(v) => setProfileDataField('targetWeight', v)} placeholder="مثال: 70" disabled={!isEditingProfile} />
                              </Field>
                              <Field label="حساسیت غذایی">
                                <Input value={`${clientInfo?.profile_data?.allergy ?? ''}`} onChange={(v) => setProfileDataField('allergy', v)} placeholder="مثلاً لاکتوز" disabled={!isEditingProfile} />
                              </Field>
                            </div>
                          </div>
                        </div>
                      )}

                      {profileTab === 'anthro' && (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            {([
                              { key: 'neck', label: 'گردن' },
                              { key: 'shoulder', label: 'شانه' },
                              { key: 'chest', label: 'سینه' },
                              { key: 'arm', label: 'بازو' },
                              { key: 'waist', label: 'کمر' },
                              { key: 'hip', label: 'لگن' },
                              { key: 'thigh', label: 'ران' },
                              { key: 'calf', label: 'ساق' },
                              { key: 'wrist', label: 'مچ دست' }
                            ] as { key: keyof Measurements; label: string }[]).map(({ key, label }) => (
                              <Field key={key} label={label}>
                                <Input value={`${clientInfo?.profile_data?.measurements?.[key] ?? ''}`} onChange={(v) => {
                                  const prevMeas = clientInfo?.profile_data?.measurements || {};
                                  setProfileDataField('measurements', { ...prevMeas, [key]: v });
                                }} disabled={!isEditingProfile} />
                              </Field>
                            ))}
                          </div>
                        </div>
                      )}

                      {profileTab === 'medical' && (
                        <div className="space-y-6">
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              سبک زندگی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                              <Field label="کیفیت خواب">
                                <Select value={`${clientInfo?.profile_data?.sleep ?? ''}`} onChange={(v) => setProfileDataField('sleep', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'excellent', label: 'عالی (8+ ساعت)' },
                                  { value: 'good', label: 'خوب (7-8 ساعت)' },
                                  { value: 'fair', label: 'متوسط (5-7 ساعت)' },
                                  { value: 'poor', label: 'ضعیف (<5 ساعت)' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="استعمال دخانیات">
                                <Select value={`${clientInfo?.profile_data?.smoke ?? ''}`} onChange={(v) => setProfileDataField('smoke', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' },
                                  { value: 'quit', label: 'ترک کرده' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="مصرف الکل">
                                <Select value={`${clientInfo?.profile_data?.alcohol ?? ''}`} onChange={(v) => setProfileDataField('alcohol', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                              <Field label="مصرف کافئین">
                                <Select value={`${clientInfo?.profile_data?.caffeine ?? ''}`} onChange={(v) => setProfileDataField('caffeine', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' }
                                ]} disabled={!isEditingProfile} />
                              </Field>
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-red-500/20 bg-red-500/5">
                            <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-red-500 rounded-full" />
                              آسیب‌دیدگی‌ها
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {INJURIES_LIST.map(inj => (
                                <MedicalCheckbox
                                  key={inj}
                                  item={inj}
                                  isChecked={currentInjuries.includes(inj)}
                                  onToggle={isEditingProfile ? handleInjuryToggle : () => {}}
                                  color="red"
                                  disabled={!isEditingProfile}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-yellow-500/20 bg-yellow-500/5">
                            <h4 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-yellow-500 rounded-full" />
                              بیماری‌ها و شرایط پزشکی
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {CONDITIONS_LIST.map(cond => (
                                <MedicalCheckbox
                                  key={cond}
                                  item={cond}
                                  isChecked={currentConditions.includes(cond)}
                                  onToggle={isEditingProfile ? handleConditionToggle : () => {}}
                                  color="yellow"
                                  disabled={!isEditingProfile}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">داروهای مصرفی</h4>
                              <Textarea 
                                value={clientInfo?.profile_data?.medications ?? ''} 
                                onChange={(v) => setProfileDataField('medications', v)} 
                                rows={4}
                              placeholder="لیست داروهای مصرفی خود را وارد کنید..." disabled={!isEditingProfile}
                              />
                            </div>
                            <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">ترجیحات/محدودیت غذایی</h4>
                              <Textarea 
                                value={Array.isArray(clientInfo?.profile_data?.foodPreferences) 
                                  ? clientInfo.profile_data?.foodPreferences?.join('\n') || ''
                                  : ''} 
                                onChange={(v) => {
                                  const arr = v.split('\n').filter(Boolean);
                                  setProfileDataField('foodPreferences', arr);
                                }} disabled={!isEditingProfile}
                                rows={4}
                                placeholder="ترجیحات غذایی خود را وارد کنید..."
                              />
                            </div>
                          </div>

                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">یادداشت / وضعیت پزشکی</h4>
                            <Textarea 
                              value={clientInfo?.notes ?? ''} 
                            onChange={(v) => handleProfileChange('notes', v)} disabled={!isEditingProfile}
                              rows={3}
                              placeholder="یادداشت‌های اضافی..."
                            />
                          </div>
                        </div>
                      )}

                      {profileTab === 'coach' && (
                        <div className="space-y-6">
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--accent-color)]/30 bg-gradient-to-r from-[var(--accent-color)]/5 to-transparent">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full" />
                              اتصال به مربی
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                <label className="text-xs text-[var(--text-secondary)] mb-2 block">کد 5 رقمی مربی</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={coachCode}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                                      setCoachCode(val);
                                    }}
                                    placeholder="مثال: 12345"
                                    className="flex-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-lg font-bold text-center tracking-widest text-[var(--text-primary)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                                    maxLength={5}
                                  />
                                  <motion.button
                                    onClick={handleSearchCoach}
                                    disabled={coachCode.length !== 5 || searchingCoach}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button"
                                  >
                                    {searchingCoach ? (
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Search size={16} />
                                    )}
                                    جستجو
                                  </motion.button>
                                </div>
                              </div>
                              {coachId && (
                                <div className="flex items-end gap-2">
                                  <button
                                    onClick={() => {
                                      setCoachId('');
                                      setCoachInfo(null);
                                      setCoachDetails(null);
                                      setCoachCode('');
                                      if (user?.id) localStorage.removeItem(`client_coach_code_${user.id}`);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-semibold hover:bg-red-500/20 transition"
                                  >
                                    حذف اتصال
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-3">
                              کد ۵ رقمی مربی را از مربی خود دریافت کنید و پس از اتصال، مشخصات او نمایش داده می‌شود.
                            </p>
                          </div>

                          {coachId ? (
                            <GlowCard>
                              <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                                  {coachDetails?.avatar ? (
                                    <img src={coachDetails.avatar} alt="coach avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    (coachDetails?.name || coachInfo?.full_name || 'مربی').charAt(0)
                                  )}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-bold text-[var(--text-primary)]">{coachDetails?.name || coachInfo?.full_name || 'مربی'}</h4>
                                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/30">متصل</span>
                                  </div>
                                  <p className="text-xs text-[var(--text-secondary)] leading-5">
                                    {coachDetails?.bio || 'رزومه مربی پس از تکمیل توسط مربی نمایش داده می‌شود.'}
                                  </p>
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {coachDetails?.telegram && (
                                      <a
                                        href={`https://t.me/${sanitizeHandle(coachDetails.telegram)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--accent-color)] hover:border-[var(--accent-color)]/50"
                                      >
                                        <ExternalLink size={14} /> تلگرام
                                      </a>
                                    )}
                                    {coachDetails?.whatsapp && (
                                      <a
                                        href={`https://wa.me/${sanitizeHandle(coachDetails.whatsapp)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-emerald-600 hover:border-emerald-500/50"
                                      >
                                        <ExternalLink size={14} /> واتساپ
                                      </a>
                                    )}
                                    {coachCode && (
                                      <span className="px-3 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs font-mono tracking-widest text-[var(--text-secondary)]">
                                        کد: {coachCode}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </GlowCard>
                          ) : (
                            <EmptyState
                              icon={<UserCheck size={32} />}
                              title="مربی متصل نشده"
                              description="کد مربی را وارد کنید تا اطلاعات او نمایش داده شود."
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                          <div className="flex items-center gap-3">
                            {saveMessage && (
                              <div className="flex items-center gap-2 text-sm text-emerald-500">
                                <CheckCircle2 size={16} />
                                <span>{saveMessage}</span>
                              </div>
                            )}
                            {isProfileComplete && coachId && (
                              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                <CheckCircle2 size={14} />
                                <span>پروفایل کامل - آماده ارسال به مربی</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!isEditingProfile && (
                              <button
                                onClick={() => setIsEditingProfile(true)}
                                className="px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm font-semibold hover:border-[var(--accent-color)]/50 transition"
                                type="button"
                              >
                                ویرایش
                              </button>
                            )}
                            <motion.button
                              onClick={handleSaveProfile}
                              disabled={savingProfile || !isEditingProfile}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-6 py-3 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white font-bold text-sm shadow-lg shadow-[var(--accent-color)]/30 flex items-center gap-2 disabled:opacity-50"
                              type="button"
                            >
                              <Save size={16} />
                              {savingProfile ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}
                            </motion.button>
                          </div>
                        </div>
                  </div>
                </ProgramCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </main>
    </div>
  );
};

// React Bits Floating Action Button for ClientDashboard
const ClientDashboardWithFAB = () => (
  <>
    <ClientDashboard />
    <FloatingActionButton
      onClick={() => {
        // Scroll to top or open request modal
        const requestTab = document.querySelector('[data-tab="request"]');
        if (requestTab) {
          (requestTab as HTMLElement).click();
        }
      }}
      icon={<Send className="w-5 h-5" />}
      tooltip="ارسال درخواست جدید"
      position="bottom-right"
    />
  </>
);

export default ClientDashboardWithFAB;

type FieldProps = { label: string; children: React.ReactNode };
const Field: React.FC<FieldProps> = ({ label, children }) => (
  <label className="text-sm text-slate-600 dark:text-slate-300 flex flex-col gap-2 font-semibold">
    {label}
    {children}
  </label>
);

const Input: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean }> = (props) => (
  <input
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
    value={props.value}
    placeholder={props.placeholder}
    onChange={(e) => props.onChange(e.target.value)}
    disabled={props.disabled}
    aria-label={props.placeholder}
  />
);

const Textarea: React.FC<{ value: string; onChange: (value: string) => void; rows?: number; placeholder?: string; disabled?: boolean }> = (props) => (
  <textarea
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition resize-none disabled:opacity-60 disabled:cursor-not-allowed"
    rows={props.rows || 3}
    value={props.value}
    placeholder={props.placeholder}
    onChange={(e) => props.onChange(e.target.value)}
    disabled={props.disabled}
    aria-label={props.placeholder}
  />
);

const Select: React.FC<{ value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean }> = (props) => (
  <select
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    disabled={props.disabled}
    aria-label="انتخاب"
  >
    {props.options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);
