import React, { Suspense } from 'react';
import { X, Save, User as UserIcon, Activity, Heart, DollarSign } from 'lucide-react';
import { useUserForm } from '../hooks/useUserForm';
import { IdentityTab } from './tabs/IdentityTab';
import { AnthropometryTab } from './tabs/AnthropometryTab';
import { MedicalTab } from './tabs/MedicalTab';
import { FinancialTab } from './tabs/FinancialTab';
import type { User, UserInput } from '../types/index';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserInput) => void;
  initialData?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const form = useUserForm(initialData);

  if (!isOpen) return null;

  const tabs = [
    { id: 'identity', label: 'مشخصات هویتی', icon: <UserIcon size={16} /> },
    { id: 'anthropometry', label: 'اندازه‌گیری‌ها', icon: <Activity size={16} /> },
    { id: 'medical', label: 'وضعیت پزشکی', icon: <Heart size={16} /> },
    { id: 'financial', label: 'اطلاعات مالی', icon: <DollarSign size={16} /> }
  ];

  const renderTabContent = () => {
    switch (form.activeTab) {
      case 'identity':
        return <IdentityTab form={form} />;
      case 'anthropometry':
        return <AnthropometryTab form={form} />;
      case 'medical':
        return <MedicalTab form={form} />;
      case 'financial':
        return <FinancialTab form={form} />;
      default:
        return <IdentityTab form={form} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gradient-to-br from-[var(--glass-bg)] via-white/5 to-[var(--glass-bg)] backdrop-blur-xl rounded-3xl border border-[var(--glass-border)] shadow-2xl shadow-black/30 w-full max-w-5xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative flex items-center justify-between p-8 border-b border-[var(--glass-border)] bg-gradient-to-r from-[var(--accent-color)]/5 via-transparent to-[var(--accent-secondary)]/5"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[var(--accent-color)]/30"
            >
              {initialData ? '✏️' : '👤'}
            </motion.div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-l from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                {initialData ? 'ویرایش شاگرد' : 'افزودن شاگرد جدید'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-medium">
                {initialData ? 'اطلاعات شاگرد را بروزرسانی کنید' : 'اطلاعات کامل شاگرد جدید را وارد کنید'}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="relative z-10 p-3 rounded-2xl hover:bg-[var(--glass-bg)] transition-all duration-300 border border-transparent hover:border-[var(--glass-border)] shadow-lg"
          >
            <X size={24} className="text-[var(--text-secondary)]" />
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="relative flex bg-[var(--glass-bg)]/50 backdrop-blur-sm overflow-x-auto"
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
              whileHover={{
                scale: 1.02,
                y: -2,
                backgroundColor: form.activeTab === tab.id ? "rgba(var(--accent-color-rgb), 0.1)" : "rgba(var(--glass-bg-rgb), 0.8)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => form.setActiveTab(tab.id)}
              className={`relative flex items-center gap-3 px-6 py-5 font-bold transition-all duration-300 whitespace-nowrap border-b-2 ${
                form.activeTab === tab.id
                  ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-gradient-to-b from-[var(--accent-color)]/10 to-transparent'
                  : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--glass-border)]'
              }`}
            >
              {/* Icon with animation */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`transition-colors duration-300 ${
                  form.activeTab === tab.id ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                {tab.icon}
              </motion.div>

              {/* Label */}
              <span className="relative">
                {tab.label}
                {/* Animated underline for active tab */}
                {form.activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </span>

              {/* Progress indicator (will be implemented later) */}
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  form.activeTab === tab.id ? 'bg-[var(--accent-color)]' : 'bg-[var(--text-secondary)]/30'
                }`}
                animate={{
                  scale: form.activeTab === tab.id ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 1.5,
                  repeat: form.activeTab === tab.id ? Infinity : 0,
                  repeatDelay: 1
                }}
              />
            </motion.button>
          ))}

          {/* Active tab background glow */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] rounded-full"
            layoutId="modalActiveTabIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              width: `${100 / tabs.length}%`,
              left: `${tabs.findIndex(tab => tab.id === form.activeTab) * (100 / tabs.length)}%`
            }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          key={form.activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="p-8 max-h-[65vh] overflow-y-auto custom-scrollbar"
        >
          <Suspense fallback={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-[var(--text-secondary)] font-medium">در حال بارگذاری...</p>
            </motion.div>
          }>
            {renderTabContent()}
          </Suspense>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex items-center justify-between p-8 border-t border-[var(--glass-border)] bg-gradient-to-t from-black/5 to-transparent"
        >
          {/* Error Message */}
          <motion.div
            className="text-sm font-medium"
            animate={{
              color: Object.keys(form.errors).length > 0 ? "#ef4444" : "var(--text-secondary)"
            }}
          >
            {Object.keys(form.errors).length > 0 ? (
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  ⚠️
                </motion.div>
                لطفاً خطاهای فرم را برطرف کنید
              </motion.span>
            ) : (
              <span className="text-[var(--text-secondary)]">
                همه فیلدها تکمیل شده‌اند ✅
              </span>
            )}
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--glass-bg-rgb), 0.8)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-bold text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)] transition-all duration-300 border border-transparent hover:border-[var(--glass-border)] shadow-lg"
            >
              انصراف
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -5px rgba(var(--accent-color-rgb), 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => form.handleSubmit(onSave)}
              disabled={form.isSubmitting}
              className="relative group flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-lg text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 overflow-hidden shadow-xl"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-l from-[var(--accent-color)] via-[var(--accent-secondary)] to-purple-600 transition-all duration-300 ${
                !form.isSubmitting ? 'group-hover:scale-110' : ''
              }`} />

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                {form.isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/70 border-t-transparent rounded-full"
                    />
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Save size={20} />
                    </motion.div>
                    <span>ذخیره</span>
                  </>
                )}
              </div>

              {/* Success particles */}
              {!form.isSubmitting && (
                <>
                  <motion.div
                    className="absolute top-2 right-2 w-1 h-1 bg-white/60 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0
                    }}
                  />
                  <motion.div
                    className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1
                    }}
                  />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;