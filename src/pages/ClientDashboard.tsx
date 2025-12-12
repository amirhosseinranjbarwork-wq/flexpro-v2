import React, { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { fetchClientById, fetchWorkoutPlansByClient, isSupabaseReady, updateClient, findCoachByCode, createProgramRequest, fetchRequestsByClient, type ProgramRequest } from '../lib/supabaseApi';
import type { UserPlans, WorkoutItem, Client, ProfileData } from '../types/index';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
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
  AlertCircle
} from 'lucide-react';

// لیست‌های ثابت برای جلوگیری از re-render
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

// کامپوننت Checkbox بهینه شده
const MedicalCheckbox = memo(({ 
  item, 
  isChecked, 
  onToggle, 
  color 
}: { 
  item: string; 
  isChecked: boolean; 
  onToggle: (item: string) => void;
  color: 'red' | 'yellow';
}) => (
  <label 
    className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] transition-colors ${
      color === 'red' 
        ? 'hover:border-red-500/50 hover:bg-red-500/10' 
        : 'hover:border-yellow-500/50 hover:bg-yellow-500/10'
    }`}
  >
    <input 
      type="checkbox" 
      checked={isChecked}
      onChange={() => onToggle(item)}
      className={color === 'red' ? 'accent-red-500 w-4 h-4 rounded' : 'accent-yellow-500 w-4 h-4 rounded'}
    />
    <span className="text-xs text-[var(--text-primary)]">{item}</span>
  </label>
));

// کامپوننت کارت روز تمرین - طراحی مدرن
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
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--accent-color)]' : 'bg-[var(--text-secondary)]'}`}></div>
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

// کامپوننت کارت برنامه - طراحی مدرن
const ProgramCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; gradient?: string }> = ({ 
  title, 
  icon, 
  children, 
  gradient = 'from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/10' 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel rounded-3xl p-6 border border-[var(--glass-border)] shadow-xl backdrop-blur-xl relative overflow-hidden`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-50`}></div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--glass-border)]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      </div>
      {children}
    </div>
  </motion.div>
);

const ClientDashboard: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { activeUser, toggleTheme, theme } = useApp();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<UserPlans | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [section, setSection] = useState<'programs' | 'profile' | 'request'>('programs');
  const [profileTab, setProfileTab] = useState<'identity' | 'anthro' | 'medical'>('identity');
  const [programView, setProgramView] = useState<'training' | 'diet' | 'supps'>('training');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // State های درخواست برنامه
  const [coachCode, setCoachCode] = useState<string>('');
  const [coachInfo, setCoachInfo] = useState<{ id: string; full_name: string } | null>(null);
  const [searchingCoach, setSearchingCoach] = useState(false);
  const [myRequests, setMyRequests] = useState<ProgramRequest[]>([]);
  const [requestType, setRequestType] = useState<'training' | 'diet' | 'supplements' | 'all'>('all');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const greeting = useMemo(() => {
    if (fullName) return fullName;
    return user?.user_metadata?.full_name ?? user?.email ?? 'کاربر عزیز';
  }, [fullName, user?.email, user?.user_metadata?.full_name]);

  const [coachId, setCoachId] = useState<string>('');

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
        } else {
          setClientInfo({
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
  }, [user, activeUser]);

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

  // جستجوی مربی با کد 5 رقمی
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
        toast.success(`مربی پیدا شد: ${coach.full_name}`);
      } else {
        setCoachInfo(null);
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

  // بارگذاری درخواست‌های قبلی
  useEffect(() => {
    if (user?.id) {
      fetchRequestsByClient(user.id).then(setMyRequests).catch(() => {});
    }
  }, [user?.id]);

  // Handlers بهینه شده برای checkboxها
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
      
  // ارسال درخواست برنامه
  const handleSendRequest = async () => {
    if (!coachInfo || !clientInfo || !user) {
      toast.error('ابتدا مربی را انتخاب کنید');
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
    
    setSendingRequest(true);
        try {
          const profileData = (clientInfo.profile_data || {}) as ProfileData;
      const clientData = {
            id: user.id,
        name: clientInfo.full_name || user.user_metadata?.full_name || user.email || '',
            gender: clientInfo.gender,
            age: clientInfo.age,
            height: clientInfo.height,
            weight: clientInfo.weight,
        goal: profileData.goal || profileData.nutritionGoals || clientInfo.goal,
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
            notes: clientInfo.notes,
      };

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B',location:'ClientDashboard.tsx:handleSendRequest',message:'sending program request',data:{userId:user.id,coachId:coachInfo.id,coachCodeLength:coachCode?.length||0,requestType,profileComplete:isProfileComplete},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      
      const _newRequest = await createProgramRequest({
        client_id: user.id,
        client_name: clientInfo.full_name || user.user_metadata?.full_name || user.email || '',
        coach_id: coachInfo.id,
        coach_code: coachCode,
        request_type: requestType,
        status: 'pending',
        client_data: clientData
      });
      
      // به‌روزرسانی لیست درخواست‌ها
      const requests = await fetchRequestsByClient(user.id);
      setMyRequests(requests);
      
      toast.success('درخواست برنامه با موفقیت ارسال شد');
      
      // به‌روزرسانی clientInfo با coach_id
      if (coachInfo.id) {
        setCoachId(coachInfo.id);
        setClientInfo(prev => prev ? { ...prev, coach_id: coachInfo.id } : null);
      }
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

  // بررسی کامل بودن پروفایل
  const isProfileComplete = useMemo(() => {
    if (!clientInfo) return false;
    const pd = (clientInfo.profile_data || {}) as ProfileData;
    return !!(
      clientInfo.full_name &&
      clientInfo.gender &&
      clientInfo.age &&
      clientInfo.height &&
      clientInfo.weight &&
      pd.goal &&
      pd.days &&
      pd.level &&
      pd.activity &&
      pd.nutritionGoals
    );
  }, [clientInfo]);

  const handleSaveProfile = async () => {
    if (!clientInfo || !user) {
      toast.error('اطلاعات کاربر یافت نشد');
      return;
    }
    
    setSavingProfile(true);
    setSaveMessage(null);
    
    try {
      // تعیین coach_id
      const effectiveCoachId = coachId || coachInfo?.id || clientInfo.coach_id || user.id;
      
      // ساخت payload کامل
      const payload: Partial<Client> = {
        ...clientInfo,
        id: user.id,
        coach_id: effectiveCoachId,
        profile_completed: true,
        updated_at: new Date().toISOString(),
        created_at: clientInfo.created_at || new Date().toISOString()
      };

      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A',location:'ClientDashboard.tsx:handleSaveProfile',message:'about to updateClient',data:{userId:user.id,effectiveCoachId,payloadKeys:Object.keys(payload||{}),profileCompleted:payload.profile_completed},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      
      // ذخیره در جدول clients (hybrid: localStorage + Supabase)
      const savedClient = await updateClient(user.id, payload);
      
      // به‌روزرسانی state محلی
      setClientInfo(savedClient);
      setCoachId(effectiveCoachId);
      setProfileSaved(true);
      setSaveMessage('✓ ذخیره شد');
      
      toast.success('اطلاعات با موفقیت ذخیره شد');
      setTimeout(() => setSaveMessage(null), 3000);
      
      // اگر Supabase در دسترس است، sync با profiles table
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[var(--text-secondary)] font-semibold">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentDayWorkouts = selectedDay && plan?.workouts?.[selectedDay] ? plan.workouts[selectedDay] : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Header - طراحی مدرن */}
      <header className="sticky top-0 z-50 glass-panel border-b border-[var(--glass-border)] backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--text-primary)]/10 transition"
              aria-label="منو"
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">سلام، {greeting} 👋</h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">داشبورد شخصی شما</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--text-primary)]/10 transition"
              aria-label="تغییر تم"
              type="button"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition"
              aria-label="خروج"
              type="button"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - طراحی مدرن */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: mobileMenuOpen ? 0 : (window.innerWidth >= 768 ? 0 : -300) }}
          className={`fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel border-r border-[var(--glass-border)] p-6 space-y-3 backdrop-blur-xl flex flex-col`}
        >
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--glass-border)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold">
              {greeting.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">داشبورد</p>
              <p className="text-xs text-[var(--text-secondary)]">پنل شاگرد</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={() => {
                setSection('programs');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all duration-300 flex items-center gap-3 ${
                section === 'programs'
                  ? 'bg-gradient-to-r from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/10 border-[var(--accent-color)] text-[var(--accent-color)] shadow-lg'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--glass-border)] hover:bg-[var(--text-primary)]/5'
              }`}
              aria-label="برنامه‌ها"
              type="button"
            >
              <Calendar size={18} />
              <span>برنامه‌ها</span>
            </button>
            <button
              onClick={() => {
                setSection('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all duration-300 flex items-center gap-3 ${
                section === 'profile'
                  ? 'bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)] shadow-lg'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--glass-border)] hover:bg-[var(--text-primary)]/5'
              }`}
              aria-label="پروفایل کاربری"
              type="button"
            >
              <UserIcon size={18} />
              <span>پروفایل کاربری</span>
            </button>
            <button
              onClick={() => {
                setSection('request');
                setMobileMenuOpen(false);
              }}
              disabled={!isProfileComplete}
              className={`w-full text-right rounded-xl px-4 py-3 text-sm font-semibold border-2 transition-all duration-300 flex items-center gap-3 ${
                section === 'request'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-lg'
                  : !isProfileComplete
                  ? 'border-transparent text-[var(--text-secondary)]/50 cursor-not-allowed opacity-50'
                  : 'border-transparent text-[var(--text-secondary)] hover:border-[var(--glass-border)] hover:bg-[var(--text-primary)]/5'
              }`}
              aria-label="درخواست برنامه"
              type="button"
            >
              <Send size={18} />
              <div className="flex flex-col items-start">
                <span>درخواست برنامه</span>
                {!isProfileComplete && <span className="text-[10px] text-amber-500">ابتدا پروفایل را تکمیل کنید</span>}
              </div>
            </button>
          </nav>

          <div className="pt-4 border-t border-[var(--glass-border)] space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full text-right rounded-xl px-4 py-2.5 text-xs font-semibold border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--text-primary)]/5 transition flex items-center gap-2 justify-end"
              type="button"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>تغییر تم</span>
            </button>
            <button
              onClick={() => signOut()}
              className="w-full text-right rounded-xl px-4 py-2.5 text-xs font-semibold border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition flex items-center gap-2 justify-end"
              type="button"
            >
              <LogOut size={16} />
              <span>خروج</span>
            </button>
          </div>
        </motion.aside>

        {/* Overlay برای موبایل */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {section === 'programs' ? (
              <motion.div
                key="programs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* تب‌های برنامه */}
                <div className="flex flex-wrap gap-3">
                  {(['training', 'diet', 'supps'] as const).map((key) => (
                    <motion.button
                      key={key}
                      onClick={() => setProgramView(key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm border-2 transition-all duration-300 flex items-center gap-2 ${
                        programView === key
                          ? 'bg-[var(--accent-color)] text-white border-transparent shadow-lg shadow-[var(--accent-color)]/30'
                          : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--accent-color)]/50 hover:text-[var(--accent-color)]'
                      }`}
                      type="button"
                    >
                      {key === 'training' ? <Dumbbell size={18} /> : key === 'diet' ? <UtensilsCrossed size={18} /> : <Pill size={18} />}
                      <span>{key === 'training' ? 'برنامه تمرینی' : key === 'diet' ? 'رژیم غذایی' : 'مکمل‌ها'}</span>
                    </motion.button>
                  ))}
                </div>

                {/* محتوای برنامه */}
                {programView === 'training' && (
                  <ProgramCard
                    title="برنامه تمرینی هفتگی"
                    icon={<Dumbbell size={20} />}
                    gradient="from-blue-500/20 to-indigo-500/10"
                  >
                    {plan && plan.workouts ? (
                      <div className="space-y-4">
                        {/* نمایش روزهای هفته */}
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

                        {/* نمایش جزئیات روز انتخاب شده */}
                        {selectedDay && currentDayWorkouts.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel rounded-2xl p-6 border border-[var(--glass-border)]"
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
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center mx-auto mb-4">
                          <Dumbbell size={32} className="text-[var(--accent-color)]" />
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">برنامه‌ای ثبت نشده است</p>
                        <p className="text-xs text-[var(--text-secondary)]">مربی شما هنوز برنامه تمرینی تنظیم نکرده است</p>
                      </div>
                    )}
                  </ProgramCard>
                )}

                {programView === 'diet' && (
                  <ProgramCard
                    title="رژیم غذایی"
                    icon={<UtensilsCrossed size={20} />}
                    gradient="from-emerald-500/20 to-green-500/10"
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
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                          <UtensilsCrossed size={32} className="text-emerald-500" />
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">رژیم ثبت نشده است</p>
                        <p className="text-xs text-[var(--text-secondary)]">مربی شما هنوز رژیم غذایی تنظیم نکرده است</p>
                      </div>
                    )}
                  </ProgramCard>
                )}

                {programView === 'supps' && (
                  <ProgramCard
                    title="مکمل‌ها"
                    icon={<Pill size={20} />}
                    gradient="from-purple-500/20 to-pink-500/10"
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
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                          <Pill size={32} className="text-purple-500" />
                        </div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">مکملی ثبت نشده است</p>
                        <p className="text-xs text-[var(--text-secondary)]">مربی شما هنوز مکمل تنظیم نکرده است</p>
                      </div>
                    )}
                  </ProgramCard>
                )}
              </motion.div>
            ) : section === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <ProgramCard
                  title="پروفایل کاربری"
                  icon={<UserIcon size={20} />}
                  gradient="from-indigo-500/20 to-blue-500/10"
                >
                  <div className="space-y-6">
                    {/* تب‌های اطلاعات */}
                    <div className="flex flex-wrap gap-2">
                      {(['identity', 'anthro', 'medical'] as const).map((tab) => (
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
                          {tab === 'identity' ? 'مشخصات هویتی' : tab === 'anthro' ? 'مشخصات آنتروپومتریک' : 'موارد پزشکی'}
                        </button>
                      ))}
                    </div>

                    {/* فرم‌ها */}
                    <div className="space-y-4">
                      {profileTab === 'identity' && (
                        <div className="space-y-6">
                          {/* کارت اتصال به مربی */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--accent-color)]/30 bg-gradient-to-r from-[var(--accent-color)]/5 to-transparent">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              اتصال به مربی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="کد مربی (ID مربی)">
                                <Input 
                                  value={coachId ?? ''} 
                                  onChange={(v) => setCoachId(v)} 
                                  placeholder="کد مربی را از مربی خود دریافت کنید"
                                />
                              </Field>
                              <div className="flex items-end">
                                {coachId ? (
                                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                                    <span>✓</span>
                                    <span>به مربی متصل شدید</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/30">
                                    <span>⚠</span>
                                    <span>کد مربی را وارد کنید</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] mt-3">
                              برای ارسال اطلاعات به مربی، کد مربی خود را وارد کنید. کد مربی را از مربی خود بخواهید.
                            </p>
                          </div>

                          {/* کارت اطلاعات پایه */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              اطلاعات پایه
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <Field label="نام کامل">
                                <Input value={clientInfo?.full_name ?? ''} onChange={(v) => handleProfileChange('full_name', v)} placeholder="مثال: علی رضایی" />
                              </Field>
                              <Field label="جنسیت">
                                <Select value={clientInfo?.gender ?? ''} onChange={(v) => handleProfileChange('gender', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'male', label: 'آقا' },
                                  { value: 'female', label: 'خانم' }
                                ]} />
                              </Field>
                              <Field label="سن">
                                <Input value={clientInfo?.age ?? ''} onChange={(v) => handleProfileChange('age', v)} placeholder="سال" />
                              </Field>
                              <Field label="قد (cm)">
                                <Input value={clientInfo?.height ?? ''} onChange={(v) => handleProfileChange('height', v)} placeholder="مثال: 175" />
                              </Field>
                              <Field label="وزن فعلی (kg)">
                                <Input value={clientInfo?.weight ?? ''} onChange={(v) => handleProfileChange('weight', v)} placeholder="مثال: 72" />
                              </Field>
                              <Field label="وزن هدف (kg)">
                                <Input value={clientInfo?.profile_data?.targetWeight ?? ''} onChange={(v) => setProfileDataField('targetWeight', v)} placeholder="مثال: 70" />
                              </Field>
                            </div>
                          </div>

                          {/* کارت اطلاعات تماس */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              اطلاعات تماس
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="شماره تماس">
                                <Input value={clientInfo?.profile_data?.phone ?? ''} onChange={(v) => setProfileDataField('phone', v)} placeholder="09xxxxxxxxx" />
                              </Field>
                              <Field label="ایمیل">
                                <Input value={clientInfo?.profile_data?.email ?? ''} onChange={(v) => setProfileDataField('email', v)} placeholder="example@mail.com" />
                              </Field>
                              <Field label="آدرس">
                                <Input value={clientInfo?.profile_data?.address ?? ''} onChange={(v) => setProfileDataField('address', v)} placeholder="استان، شهر، خیابان..." />
                              </Field>
                            </div>
                          </div>

                          {/* کارت اطلاعات شخصی */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              اطلاعات شخصی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <Field label="شغل">
                                <Input value={clientInfo?.profile_data?.job ?? ''} onChange={(v) => setProfileDataField('job', v)} placeholder="مهندس نرم‌افزار" />
                              </Field>
                              <Field label="وضعیت تأهل">
                                <Select value={clientInfo?.profile_data?.maritalStatus ?? ''} onChange={(v) => setProfileDataField('maritalStatus', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'single', label: 'مجرد' },
                                  { value: 'married', label: 'متأهل' }
                                ]} />
                              </Field>
                              <Field label="تحصیلات">
                                <Select value={clientInfo?.profile_data?.education ?? ''} onChange={(v) => setProfileDataField('education', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'diploma', label: 'دیپلم' },
                                  { value: 'associate', label: 'فوق دیپلم' },
                                  { value: 'bachelor', label: 'لیسانس' },
                                  { value: 'master', label: 'فوق لیسانس' },
                                  { value: 'phd', label: 'دکترا' }
                                ]} />
                              </Field>
                            </div>
                          </div>

                          {/* کارت اطلاعات تمرینی */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              اطلاعات تمرینی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                              <Field label="سطح تمرین">
                                <Select value={clientInfo?.profile_data?.level ?? ''} onChange={(v) => setProfileDataField('level', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'beginner', label: 'مبتدی (0-6 ماه)' },
                                  { value: 'intermediate', label: 'متوسط (6-24 ماه)' },
                                  { value: 'advanced', label: 'پیشرفته (2-5 سال)' },
                                  { value: 'pro', label: 'حرفه‌ای (+5 سال)' }
                                ]} />
                              </Field>
                              <Field label="روز تمرین در هفته">
                                <Select value={clientInfo?.profile_data?.days ?? ''} onChange={(v) => setProfileDataField('days', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: '1', label: '1 روز' },
                                  { value: '2', label: '2 روز' },
                                  { value: '3', label: '3 روز' },
                                  { value: '4', label: '4 روز' },
                                  { value: '5', label: '5 روز' },
                                  { value: '6', label: '6 روز' },
                                  { value: '7', label: '7 روز' }
                                ]} />
                              </Field>
                              <Field label="سابقه تمرین (سال)">
                                <Input value={clientInfo?.profile_data?.exp ?? ''} onChange={(v) => setProfileDataField('exp', v)} placeholder="مثلاً 2" />
                              </Field>
                              <Field label="سطح فعالیت">
                                <Select value={clientInfo?.profile_data?.activity ?? ''} onChange={(v) => setProfileDataField('activity', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: '1.2', label: 'کم‌تحرک (شغل نشسته)' },
                                  { value: '1.375', label: 'سبک (پیاده‌روی کم)' },
                                  { value: '1.55', label: 'متوسط (فعالیت معمول)' },
                                  { value: '1.725', label: 'سنگین (شغل فیزیکی)' },
                                  { value: '1.9', label: 'خیلی سنگین (ورزشکار)' }
                                ]} />
                              </Field>
                              <Field label="هدف تمرینی">
                                <Select value={clientInfo?.profile_data?.nutritionGoals ?? ''} onChange={(v) => setProfileDataField('goal', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'weight-loss', label: 'کاهش وزن' },
                                  { value: 'weight-gain', label: 'افزایش وزن' },
                                  { value: 'muscle-gain', label: 'عضله‌سازی' },
                                  { value: 'maintenance', label: 'حفظ وزن' },
                                  { value: 'recomp', label: 'ریکامپ' }
                                ]} />
                              </Field>
                            </div>
                          </div>

                          {/* کارت هدف تغذیه */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              هدف تغذیه
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                              <Field label="هدف تغذیه‌ای">
                                <Select value={clientInfo?.profile_data?.nutritionGoals ?? ''} onChange={(v) => setProfileDataField('nutritionGoals', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'weight-loss', label: 'کاهش وزن' },
                                  { value: 'weight-gain', label: 'افزایش وزن' },
                                  { value: 'muscle-gain', label: 'عضله‌سازی' },
                                  { value: 'maintenance', label: 'حفظ وزن' },
                                  { value: 'recomp', label: 'ریکامپ' }
                                ]} />
                              </Field>
                              <Field label="نوع رژیم">
                                <Select value={clientInfo?.profile_data?.dietType ?? ''} onChange={(v) => setProfileDataField('dietType', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'normal', label: 'عادی' },
                                  { value: 'vegetarian', label: 'گیاهخوار' },
                                  { value: 'vegan', label: 'وگان' },
                                  { value: 'keto', label: 'کتوژنیک' },
                                  { value: 'paleo', label: 'پالئو' },
                                  { value: 'halal', label: 'حلال' }
                                ]} />
                              </Field>
                              <Field label="مصرف آب (لیتر)">
                                <Input value={clientInfo?.profile_data?.waterIntake ?? ''} onChange={(v) => setProfileDataField('waterIntake', v)} placeholder="مثلاً 2.5" />
                              </Field>
                              <Field label="تعداد وعده">
                                <Select value={clientInfo?.profile_data?.mealFrequency ?? ''} onChange={(v) => setProfileDataField('mealFrequency', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: '3', label: '3 وعده' },
                                  { value: '4', label: '4 وعده' },
                                  { value: '5', label: '5 وعده' },
                                  { value: '6', label: '6 وعده' },
                                  { value: '7', label: '7 وعده' }
                                ]} />
                              </Field>
                              <Field label="درصد چربی (%)">
                                <Input value={clientInfo?.profile_data?.bodyFat ?? ''} onChange={(v) => setProfileDataField('bodyFat', v)} placeholder="مثلاً 15" />
                              </Field>
                              <Field label="حساسیت غذایی">
                                <Input value={clientInfo?.profile_data?.allergy ?? ''} onChange={(v) => setProfileDataField('allergy', v)} placeholder="مثلاً لاکتوز" />
                              </Field>
                            </div>
                          </div>
                        </div>
                      )}

                      {profileTab === 'anthro' && (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-3">
                            {['neck', 'shoulder', 'chest', 'arm', 'waist', 'hip', 'thigh', 'calf', 'wrist'].map((k) => (
                              <Field key={k} label={k === 'waist' ? 'کمر' : k === 'hip' ? 'لگن' : k === 'thigh' ? 'ران' : k === 'calf' ? 'ساق' : k === 'wrist' ? 'مچ دست' : k === 'shoulder' ? 'شانه' : k === 'chest' ? 'سینه' : k === 'arm' ? 'بازو' : 'گردن'}>
                                <Input value={clientInfo?.profile_data?.measurements?.[k] ?? ''} onChange={(v) => {
                                  const prevMeas = clientInfo?.profile_data?.measurements || {};
                                  setProfileDataField('measurements', { ...prevMeas, [k]: v });
                                }} />
                              </Field>
                            ))}
                          </div>
                        </div>
                      )}

                      {profileTab === 'medical' && (
                        <div className="space-y-6">
                          {/* کارت سبک زندگی */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                              سبک زندگی
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                              <Field label="کیفیت خواب">
                                <Select value={clientInfo?.profile_data?.sleep ?? ''} onChange={(v) => setProfileDataField('sleep', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'excellent', label: 'عالی (8+ ساعت)' },
                                  { value: 'good', label: 'خوب (7-8 ساعت)' },
                                  { value: 'fair', label: 'متوسط (5-7 ساعت)' },
                                  { value: 'poor', label: 'ضعیف (<5 ساعت)' }
                                ]} />
                              </Field>
                              <Field label="استعمال دخانیات">
                                <Select value={clientInfo?.profile_data?.smoke ?? ''} onChange={(v) => setProfileDataField('smoke', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' },
                                  { value: 'quit', label: 'ترک کرده' }
                                ]} />
                              </Field>
                              <Field label="مصرف الکل">
                                <Select value={clientInfo?.profile_data?.alcohol ?? ''} onChange={(v) => setProfileDataField('alcohol', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' }
                                ]} />
                              </Field>
                              <Field label="مصرف کافئین">
                                <Select value={clientInfo?.profile_data?.caffeine ?? ''} onChange={(v) => setProfileDataField('caffeine', v)} options={[
                                  { value: '', label: 'انتخاب کنید' },
                                  { value: 'no', label: 'خیر' },
                                  { value: 'yes', label: 'بله' }
                                ]} />
                              </Field>
                            </div>
                          </div>

                          {/* کارت آسیب‌دیدگی‌ها */}
                          <div className="glass-panel rounded-2xl p-5 border border-red-500/20 bg-red-500/5">
                            <h4 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                              ⚠️ آسیب‌دیدگی‌ها و ناهنجاری‌های اسکلتی-عضلانی
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {INJURIES_LIST.map(inj => (
                                <MedicalCheckbox
                                  key={inj}
                                  item={inj}
                                  isChecked={currentInjuries.includes(inj)}
                                  onToggle={handleInjuryToggle}
                                  color="red"
                                    />
                              ))}
                            </div>
                          </div>

                          {/* کارت بیماری‌ها */}
                          <div className="glass-panel rounded-2xl p-5 border border-yellow-500/20 bg-yellow-500/5">
                            <h4 className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                              <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                              🏥 بیماری‌ها و شرایط پزشکی
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {CONDITIONS_LIST.map(cond => (
                                <MedicalCheckbox
                                  key={cond}
                                  item={cond}
                                  isChecked={currentConditions.includes(cond)}
                                  onToggle={handleConditionToggle}
                                  color="yellow"
                                    />
                              ))}
                            </div>
                          </div>

                          {/* کارت داروها و ترجیحات */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">داروهای مصرفی</h4>
                              <Textarea 
                                value={clientInfo?.profile_data?.medications ?? ''} 
                                onChange={(v) => setProfileDataField('medications', v)} 
                                rows={4}
                                placeholder="لیست داروهای مصرفی خود را وارد کنید..."
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
                                }} 
                                rows={4}
                                placeholder="ترجیحات غذایی خود را وارد کنید..."
                              />
                            </div>
                          </div>

                          {/* کارت یادداشت */}
                          <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">یادداشت / وضعیت پزشکی</h4>
                            <Textarea 
                              value={clientInfo?.notes ?? ''} 
                              onChange={(v) => handleProfileChange('notes', v)} 
                              rows={3}
                              placeholder="یادداشت‌های اضافی..."
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* دکمه ذخیره */}
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
                      <motion.button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
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
                </ProgramCard>
              </motion.div>
            ) : section === 'request' ? (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <ProgramCard 
                  title="درخواست برنامه" 
                  icon={<Send size={20} />}
                  gradient="from-emerald-500/20 to-green-500/10"
                >
                  <div className="space-y-6">
                    {/* جستجوی مربی */}
                    <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
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
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

                    {/* نوع درخواست */}
                    {coachInfo && (
                      <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-[var(--accent-color)] rounded-full"></span>
                          <FileText size={16} />
                          نوع درخواست
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { value: 'all', label: 'همه برنامه‌ها', icon: '📋', desc: 'تمرین + رژیم + مکمل' },
                            { value: 'training', label: 'برنامه تمرینی', icon: '🏋️', desc: 'فقط تمرین' },
                            { value: 'diet', label: 'رژیم غذایی', icon: '🥗', desc: 'فقط رژیم' },
                            { value: 'supplements', label: 'مکمل‌ها', icon: '💊', desc: 'فقط مکمل' },
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

                    {/* دکمه ارسال */}
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
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Send size={20} />
                          )}
                          ارسال درخواست به مربی
                        </motion.button>
                      </div>
                    )}

                    {/* درخواست‌های قبلی */}
                    {myRequests.length > 0 && (
                      <div className="glass-panel rounded-2xl p-5 border border-[var(--glass-border)]">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
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
                              {req.coach_response && (
                                <div className="text-xs text-[var(--text-secondary)] p-2 rounded-lg bg-[var(--text-primary)]/5">
                                  پاسخ مربی: {req.coach_response}
                                </div>
                              )}
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
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;

// اجزای کمکی
type FieldProps = { label: string; children: React.ReactNode };
const Field: React.FC<FieldProps> = ({ label, children }) => (
  <label className="text-sm text-slate-600 dark:text-slate-300 flex flex-col gap-2 font-semibold">
    {label}
    {children}
  </label>
);

const Input: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string }> = (props) => (
  <input
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition"
    value={props.value}
    placeholder={props.placeholder}
    onChange={(e) => props.onChange(e.target.value)}
    aria-label={props.placeholder}
  />
);

const Textarea: React.FC<{ value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }> = (props) => (
  <textarea
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition resize-none"
    rows={props.rows || 3}
    value={props.value}
    placeholder={props.placeholder}
    onChange={(e) => props.onChange(e.target.value)}
    aria-label={props.placeholder}
  />
);

const Select: React.FC<{ value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }> = (props) => (
  <select
    className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/20 transition appearance-none"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    aria-label="انتخاب"
  >
    {props.options.map((o) => (
      <option key={o.value} value={o.value}>{o.label}</option>
    ))}
  </select>
);
