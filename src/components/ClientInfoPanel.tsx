import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Heart,
  Ruler,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Activity,
  Target,
  Droplet,
  UtensilsCrossed,
  Pill,
  AlertTriangle,
  FileText,
  Scale,
  Dumbbell,
  Plus,
  ArrowRight
} from 'lucide-react';
import type { Client, User as UserType } from '../types/index';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ClientInfoPanelProps {
  client: Client | null;
  loading?: boolean;
  onNavigateToTab?: (tab: 'training' | 'nutrition' | 'supplements') => void;
}

const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ client, loading, onNavigateToTab }) => {
  const profileData = useMemo(() => {
    if (!client?.profile_data) return null;
    return client.profile_data as UserType;
  }, [client]);

  const infoSections = useMemo(() => {
    if (!client && !profileData) return null;

    const pd = profileData || {};
    
    return {
      personal: {
        title: 'اطلاعات شخصی',
        icon: <User size={20} />,
        items: [
          { label: 'نام کامل', value: client?.full_name || pd.name || '—' },
          { label: 'جنسیت', value: client?.gender || pd.gender || '—' },
          { label: 'سن', value: client?.age || pd.age || '—', suffix: 'سال' },
          { label: 'قد', value: client?.height || pd.height || '—', suffix: 'سانتی‌متر' },
          { label: 'وزن', value: client?.weight || pd.weight || '—', suffix: 'کیلوگرم' },
          { label: 'هدف', value: client?.goal || pd.goal || pd.nutritionGoals || '—' },
          { label: 'سطح', value: pd.level || '—' },
          { label: 'روزهای تمرین', value: pd.days || '—', suffix: 'روز در هفته' },
          { label: 'فعالیت روزانه', value: pd.activity || '—' },
          { label: 'تلفن', value: pd.phone || '—', icon: <Phone size={16} /> },
          { label: 'ایمیل', value: pd.email || '—', icon: <Mail size={16} /> },
          { label: 'آدرس', value: pd.address || '—', icon: <MapPin size={16} /> },
          { label: 'شغل', value: pd.job || '—', icon: <Briefcase size={16} /> },
          { label: 'تحصیلات', value: pd.education || '—', icon: <GraduationCap size={16} /> },
          { label: 'وضعیت تأهل', value: pd.maritalStatus || '—' },
        ]
      },
      anthropometric: {
        title: 'اندازه‌گیری‌های آنتروپومتریک',
        icon: <Ruler size={20} />,
        items: [
          { label: 'وزن هدف', value: pd.targetWeight || '—', suffix: 'کیلوگرم', icon: <Target size={16} /> },
          { label: 'درصد چربی بدن', value: pd.bodyFat || '—', suffix: '%', icon: <Scale size={16} /> },
          { label: 'دور گردن', value: pd.measurements?.neck || '—', suffix: 'سانتی‌متر' },
          { label: 'دور سینه', value: pd.measurements?.chest || '—', suffix: 'سانتی‌متر' },
          { label: 'دور شانه', value: pd.measurements?.shoulder || '—', suffix: 'سانتی‌متر' },
          { label: 'دور بازو', value: pd.measurements?.arm || '—', suffix: 'سانتی‌متر' },
          { label: 'دور کمر', value: pd.measurements?.waist || '—', suffix: 'سانتی‌متر' },
          { label: 'دور باسن', value: pd.measurements?.hip || '—', suffix: 'سانتی‌متر' },
          { label: 'دور ران', value: pd.measurements?.thigh || '—', suffix: 'سانتی‌متر' },
          { label: 'دور ساق', value: pd.measurements?.calf || '—', suffix: 'سانتی‌متر' },
          { label: 'دور مچ', value: pd.measurements?.wrist || '—', suffix: 'سانتی‌متر' },
        ]
      },
      medical: {
        title: 'اطلاعات پزشکی',
        icon: <Heart size={20} />,
        items: [
          { label: 'وضعیت خواب', value: pd.sleep || '—', icon: <Activity size={16} /> },
          { label: 'مصرف سیگار', value: pd.smoke || '—' },
          { label: 'مصرف الکل', value: pd.alcohol || '—' },
          { label: 'مصرف کافئین', value: pd.caffeine || '—' },
          { label: 'آلرژی', value: pd.allergy || '—', icon: <AlertTriangle size={16} /> },
          { label: 'داروها', value: pd.medications || '—', icon: <Pill size={16} /> },
          { label: 'مشکلات پزشکی', value: pd.medicalConditions?.length ? pd.medicalConditions.join(', ') : '—', icon: <Heart size={16} /> },
          { label: 'آسیب‌ها', value: pd.injuries?.length ? pd.injuries.join(', ') : '—', icon: <AlertTriangle size={16} /> },
        ]
      },
      nutrition: {
        title: 'اطلاعات تغذیه',
        icon: <UtensilsCrossed size={20} />,
        items: [
          { label: 'نوع رژیم', value: pd.dietType || '—' },
          { label: 'اهداف تغذیه', value: pd.nutritionGoals || '—' },
          { label: 'مصرف آب', value: pd.waterIntake || '—', suffix: 'لیتر در روز', icon: <Droplet size={16} /> },
          { label: 'تعداد وعده', value: pd.mealFrequency || '—', suffix: 'وعده در روز' },
          { label: 'ترجیحات غذایی', value: pd.foodPreferences?.length ? pd.foodPreferences.join(', ') : '—' },
        ]
      },
      lifestyle: {
        title: 'سبک زندگی',
        icon: <Activity size={20} />,
        items: [
          { label: 'سابقه تمرین', value: pd.exp || '—', suffix: 'سال' },
          { label: 'کیفیت خواب', value: pd.sleep || '—' },
          { label: 'مصرف سیگار', value: pd.smoke || '—' },
          { label: 'مصرف الکل', value: pd.alcohol || '—' },
          { label: 'مصرف کافئین', value: pd.caffeine || '—' },
        ]
      }
    };
  }, [client, profileData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!client && !profileData) {
    return (
      <div className="text-center py-20 text-[var(--text-secondary)]">
        <FileText size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-semibold mb-2">اطلاعاتی ثبت نشده</p>
        <p className="text-sm">شاگرد هنوز اطلاعات خود را ثبت نکرده است.</p>
      </div>
    );
  }

  const sections = infoSections ? Object.entries(infoSections) : [];

  return (
    <div className="space-y-6">
      {/* هدر اطلاعات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 border border-[var(--glass-border)]"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {client?.full_name?.charAt(0) || profileData?.name?.charAt(0) || '👤'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              {client?.full_name || profileData?.name || 'شاگرد'}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {client?.gender && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                  {client.gender === 'male' ? 'مرد' : 'زن'}
                </span>
              )}
              {client?.age && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                  {client.age} سال
                </span>
              )}
              {client?.height && client?.weight && (
                <span className="text-xs px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)]">
                  {client.height} × {client.weight} (قد × وزن)
                </span>
              )}
              {client?.profile_completed && (
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  ✓ پروفایل کامل
                </span>
              )}
            </div>
          </div>
        </div>
        {client?.notes && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-[var(--accent-color)] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">یادداشت مربی:</p>
                <p className="text-sm text-[var(--text-primary)]">{client.notes}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* بخش‌های اطلاعات */}
      {sections.map(([key, section], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-panel rounded-3xl p-6 border border-[var(--glass-border)]"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--glass-border)]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--accent-color)]">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{section.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item, idx) => {
              if (!item.value || item.value === '—') return null;
              
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon && <span className="text-[var(--accent-color)]">{item.icon}</span>}
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">{item.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-[var(--text-primary)]">{item.value}</span>
                    {item.suffix && (
                      <span className="text-xs text-[var(--text-secondary)]">{item.suffix}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {section.items.every(item => !item.value || item.value === '—') && (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <p className="text-sm">اطلاعاتی در این بخش ثبت نشده است.</p>
            </div>
          )}
        </motion.div>
      ))}

      {/* اطلاعات زمانی */}
      {(client?.created_at || client?.updated_at) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sections.length * 0.1 }}
          className="glass-panel rounded-3xl p-4 border border-[var(--glass-border)]"
        >
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Calendar size={14} />
            {client.created_at && (
              <span>ایجاد شده: {new Date(client.created_at).toLocaleDateString('fa-IR')}</span>
            )}
            {client.updated_at && (
              <>
                <span>•</span>
                <span>آخرین به‌روزرسانی: {new Date(client.updated_at).toLocaleDateString('fa-IR')}</span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Actions for Programming */}
      {onNavigateToTab && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Target size={20} className="text-[var(--accent-color)]" />
            اقدامات سریع برنامه‌نویسی
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToTab('training')}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Dumbbell size={18} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--text-primary)]">برنامه تمرینی</p>
                  <p className="text-xs text-[var(--text-secondary)]">طراحی برنامه هفتگی</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToTab('nutrition')}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                  <UtensilsCrossed size={18} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--text-primary)]">رژیم غذایی</p>
                  <p className="text-xs text-[var(--text-secondary)]">تجویز تغذیه</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToTab('supplements')}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/30 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Pill size={18} />
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--text-primary)]">مکمل‌ها</p>
                  <p className="text-xs text-[var(--text-secondary)]">تجویز مکمل</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-purple-500 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <div className="mt-4 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToTab('training')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={18} />
              شروع برنامه‌نویسی
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientInfoPanel;

