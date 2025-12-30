import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, Menu, X, User as UserIcon, Dumbbell,
  UtensilsCrossed, Pill, Activity, Award, BarChart3,
  Settings, TrendingUp, Calendar, Target, Zap, Heart,
  Star, Clock, CheckCircle2, AlertCircle, Send, Copy,
  Sparkles, Trophy, Flame, ChevronRight, Plus, Bell
} from 'lucide-react';

import { 
  fetchClientById, 
  fetchWorkoutPlansByClient, 
  findCoachByCode, 
  createProgramRequest, 
  fetchRequestsByClient, 
  updateClient 
// Supabase removed - using local API
import type { WorkoutItem, Client, ProgramRequest } from '../types/index';

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" 
         style={{ animation: 'pulse 4s ease-in-out infinite reverse' }} />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
  </div>
);

// Stats Card Component
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
    <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  </motion.div>
);

// Workout Exercise Card
const ExerciseCard = ({ exercise }: { exercise: WorkoutItem }) => (
  <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="text-white font-bold mb-1">{exercise.name}</h4>
        {exercise.category && (
          <span className="text-xs text-slate-400">{exercise.category}</span>
        )}
      </div>
      <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
        <Dumbbell className="w-5 h-5 text-blue-400" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="p-2 bg-slate-900/50 rounded-lg">
        <div className="text-xs text-slate-400 mb-1">ست</div>
        <div className="text-white font-bold">{exercise.sets || '-'}</div>
      </div>
      <div className="p-2 bg-slate-900/50 rounded-lg">
        <div className="text-xs text-slate-400 mb-1">تکرار</div>
        <div className="text-white font-bold">{exercise.reps || '-'}</div>
      </div>
      <div className="p-2 bg-slate-900/50 rounded-lg">
        <div className="text-xs text-slate-400 mb-1">وزن</div>
        <div className="text-white font-bold">{exercise.weight ? `${exercise.weight}kg` : '-'}</div>
      </div>
    </div>
    {exercise.notes && (
      <p className="mt-3 text-sm text-slate-400 italic">{exercise.notes}</p>
    )}
  </div>
);

// Workout Day Card
const WorkoutDayCard = ({ day, exercises, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    onClick={onClick}
    className="group relative cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg mb-1">{day}</h3>
          <p className="text-slate-400 text-sm">{exercises.length} حرکت</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Dumbbell className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
        <span>مشاهده جزئیات</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  </motion.div>
);

// Program Request Card
const RequestCard = ({ request }: { request: ProgramRequest }) => {
  const statusConfig = {
    pending: { color: 'yellow', label: 'در انتظار', icon: Clock },
    approved: { color: 'green', label: 'تایید شده', icon: CheckCircle2 },
    rejected: { color: 'red', label: 'رد شده', icon: AlertCircle }
  };
  
  const status = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-white font-bold mb-1">{request.program_type === 'training' ? 'برنامه تمرینی' : 'برنامه تغذیه'}</h4>
          <p className="text-sm text-slate-400">{new Date(request.created_at).toLocaleDateString('fa-IR')}</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 bg-${status.color}-500/20 border border-${status.color}-500/30 rounded-lg text-${status.color}-400 text-sm`}>
          <StatusIcon className="w-4 h-4" />
          <span>{status.label}</span>
        </div>
      </div>
      {request.notes && (
        <p className="text-sm text-slate-300 mb-2">{request.notes}</p>
      )}
      {request.coach_response && (
        <div className="mt-2 p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">پاسخ مربی:</p>
          <p className="text-sm text-slate-300">{request.coach_response}</p>
        </div>
      )}
    </div>
  );
};

type TabType = 'dashboard' | 'training' | 'nutrition' | 'supplements' | 'request' | 'profile';

export default function ClientDashboard() {
  const { user, signOut, profile } = useAuth();
  const { theme, toggleTheme } = useUI();
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [requests, setRequests] = useState<ProgramRequest[]>([]);
  const [coachCode, setCoachCode] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [requestType, setRequestType] = useState<'training' | 'nutrition'>('training');
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load client data
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const [client, plans, reqs] = await Promise.all([
          fetchClientById(user.id),
          fetchWorkoutPlansByClient(user.id),
          fetchRequestsByClient(user.id)
        ]);
        
        setClientData(client);
        setWorkoutPlans(plans || []);
        setRequests(reqs || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user?.id]);

  // Stats
  const stats = useMemo(() => {
    const totalExercises = workoutPlans.reduce((sum, plan) => sum + (plan.exercises?.length || 0), 0);
    const completedWorkouts = clientData?.workoutLogs?.length || 0;
    
    return {
      totalWorkouts: workoutPlans.length,
      totalExercises,
      completedWorkouts,
      progress: clientData?.progress || 0
    };
  }, [workoutPlans, clientData]);

  // Handle coach code submission
  const handleConnectCoach = useCallback(async () => {
    if (!coachCode.trim() || !user?.id) {
      toast.error('لطفا کد مربی را وارد کنید');
      return;
    }

    try {
      const coach = await findCoachByCode(coachCode.trim());
      if (!coach) {
        toast.error('کد مربی یافت نشد');
        return;
      }

      await updateClient(user.id, { coach_id: coach.id });
      toast.success('به مربی متصل شدید');
      setCoachCode('');
    } catch (error) {
      toast.error('خطا در اتصال به مربی');
    }
  }, [coachCode, user?.id]);

  // Handle program request
  const handleSendRequest = useCallback(async () => {
    if (!user?.id || !clientData?.coach_id) {
      toast.error('ابتدا به مربی متصل شوید');
      return;
    }

    try {
      await createProgramRequest({
        client_id: user.id,
        coach_id: clientData.coach_id,
        program_type: requestType,
        notes: requestNotes,
        status: 'pending'
      });
      
      toast.success('درخواست ارسال شد');
      setRequestNotes('');
      
      // Reload requests
      const reqs = await fetchRequestsByClient(user.id);
      setRequests(reqs || []);
    } catch (error) {
      toast.error('خطا در ارسال درخواست');
    }
  }, [user?.id, clientData?.coach_id, requestType, requestNotes]);

  // Navigation items
  const navItems = [
    { id: 'dashboard' as TabType, icon: Activity, label: 'داشبورد', color: 'from-blue-500 to-cyan-500' },
    { id: 'training' as TabType, icon: Dumbbell, label: 'برنامه تمرین', color: 'from-purple-500 to-pink-500' },
    { id: 'nutrition' as TabType, icon: UtensilsCrossed, label: 'برنامه تغذیه', color: 'from-green-500 to-emerald-500' },
    { id: 'supplements' as TabType, icon: Pill, label: 'مکمل‌ها', color: 'from-pink-500 to-rose-500' },
    { id: 'request' as TabType, icon: Send, label: 'درخواست برنامه', color: 'from-orange-500 to-red-500' },
    { id: 'profile' as TabType, icon: Settings, label: 'پروفایل', color: 'from-slate-500 to-slate-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white">
      <AnimatedBackground />

      {/* Top Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  فلکس‌پرو
                </h1>
                <p className="text-xs text-slate-400">پنل شاگرد</p>
              </div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm font-bold">
                {profile?.full_name?.charAt(0) || 'S'}
              </div>
              <div className="text-sm">
                <div className="font-medium">{profile?.full_name || 'شاگرد'}</div>
                <div className="text-xs text-slate-400">
                  {clientData?.coach_id ? 'متصل به مربی' : 'بدون مربی'}
                </div>
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

        {/* Progress Card */}
        {clientData && (
          <div className="m-4 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-300 font-semibold">پیشرفت شما</span>
            </div>
            <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                className="absolute inset-y-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <div className="text-center text-2xl font-black text-white">{stats.progress}%</div>
          </div>
        )}
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
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-white mb-2">
                    سلام، {profile?.full_name || 'ورزشکار'} 💪
                  </h2>
                  <p className="text-slate-400">آماده برای یک تمرین عالی؟</p>
                </div>

                {/* No Coach Warning */}
                {!clientData?.coach_id && (
                  <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-2">شما هنوز به مربی متصل نیستید</h3>
                        <p className="text-slate-300 text-sm mb-4">
                          برای دریافت برنامه تمرینی و تغذیه‌ای، ابتدا کد مربی خود را وارد کنید.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={coachCode}
                            onChange={(e) => setCoachCode(e.target.value)}
                            placeholder="کد مربی (مثال: ABC123)"
                            className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                          />
                          <button
                            onClick={handleConnectCoach}
                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-colors"
                          >
                            اتصال
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Dumbbell}
                    label="برنامه‌های تمرین"
                    value={stats.totalWorkouts}
                    color="from-purple-500 to-pink-500"
                    delay={0}
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="تمرین‌های انجام شده"
                    value={stats.completedWorkouts}
                    color="from-green-500 to-emerald-500"
                    delay={0.1}
                  />
                  <StatCard
                    icon={Flame}
                    label="کل حرکات"
                    value={stats.totalExercises}
                    color="from-orange-500 to-red-500"
                    delay={0.2}
                  />
                  <StatCard
                    icon={Trophy}
                    label="پیشرفت"
                    value={`${stats.progress}%`}
                    color="from-blue-500 to-cyan-500"
                    delay={0.3}
                  />
                </div>

                {/* Today's Workout */}
                {workoutPlans.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">برنامه امروز</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {workoutPlans.slice(0, 3).map((plan, index) => (
                        <WorkoutDayCard
                          key={index}
                          day={plan.day || `روز ${index + 1}`}
                          exercises={plan.exercises || []}
                          onClick={() => {
                            setSelectedDay(plan.day);
                            setActiveTab('training');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Requests */}
                {requests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">درخواست‌های اخیر</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requests.slice(0, 4).map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Training Tab */}
            {activeTab === 'training' && (
              <motion.div
                key="training"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-6">برنامه تمرینی شما</h2>
                {workoutPlans.length > 0 ? (
                  <div className="space-y-6">
                    {workoutPlans.map((plan, index) => (
                      <div key={index} className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">{plan.day || `روز ${index + 1}`}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(plan.exercises || []).map((exercise: WorkoutItem, i: number) => (
                            <ExerciseCard key={i} exercise={exercise} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <Dumbbell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">هنوز برنامه تمرینی برای شما تعریف نشده</p>
                    <p className="text-slate-500 text-sm">از مربی خود درخواست برنامه تمرینی کنید</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Request Tab */}
            {activeTab === 'request' && (
              <motion.div
                key="request"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold mb-6">درخواست برنامه جدید</h2>
                
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-6">
                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">نوع برنامه</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setRequestType('training')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          requestType === 'training'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <Dumbbell className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <div className="font-bold text-white">برنامه تمرینی</div>
                      </button>
                      <button
                        onClick={() => setRequestType('nutrition')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          requestType === 'nutrition'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <div className="font-bold text-white">برنامه تغذیه</div>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">توضیحات (اختیاری)</label>
                    <textarea
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                      placeholder="توضیحات خود را در مورد برنامه مورد نیاز بنویسید..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSendRequest}
                    disabled={!clientData?.coach_id}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>ارسال درخواست</span>
                  </button>

                  {!clientData?.coach_id && (
                    <p className="text-center text-sm text-slate-400">
                      برای ارسال درخواست، ابتدا به مربی متصل شوید
                    </p>
                  )}
                </div>

                {/* Previous Requests */}
                {requests.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">درخواست‌های قبلی</h3>
                    <div className="space-y-4">
                      {requests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Other tabs */}
            {activeTab === 'nutrition' && (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">برنامه تغذیه در حال توسعه است</p>
              </div>
            )}

            {activeTab === 'supplements' && (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">مکمل‌ها در حال توسعه است</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400">تنظیمات در حال توسعه است</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
