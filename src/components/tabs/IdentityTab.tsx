import React from 'react';
import { User, Phone, Mail, MapPin, GraduationCap, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface IdentityTabProps {
  form: UseUserFormReturn;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ form }) => {
  const { formData, errors, updateField } = form;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center pb-6 border-b border-[var(--glass-border)]"
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30"
        >
          👤
        </motion.div>
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">مشخصات هویتی</h3>
        <p className="text-[var(--text-secondary)]">اطلاعات شخصی و شناسایی شاگرد</p>
      </motion.div>

      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <User size={16} className="text-[var(--accent-color)]" />
            نام و نام خانوادگی *
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="text"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              className={`input-glass pr-12 h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="مثال: علی محمدی"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <User size={20} />
            </motion.div>
            {/* Floating label effect */}
            <motion.div
              className={`absolute right-12 top-3 text-xs font-medium transition-all duration-300 ${
                formData.name ? 'text-[var(--accent-color)] opacity-100' : 'text-[var(--text-secondary)] opacity-0'
              }`}
            >
              نام کامل
            </motion.div>
          </div>
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">⚠️</span>
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Phone size={16} className="text-[var(--accent-color)]" />
            شماره تلفن *
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className={`input-glass pr-12 h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Phone size={20} />
            </motion.div>
            {/* Phone indicator */}
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-lg border border-[var(--glass-border)]"
              whileHover={{ scale: 1.05 }}
            >
              ایران 🇮🇷
            </motion.div>
          </div>
          <AnimatePresence>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">📞</span>
                {errors.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Mail size={16} className="text-[var(--accent-color)]" />
            ایمیل
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className={`input-glass pr-12 h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="email@example.com"
              dir="ltr"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Mail size={20} />
            </motion.div>
            {/* Email validation indicator */}
            {formData.email && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  /^\S+@\S+\.\S+$/.test(formData.email)
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}
              >
                {/^\S+@\S+\.\S+$/.test(formData.email) ? '✓' : '?'}
              </motion.div>
            )}
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">✉️</span>
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Heart size={16} className="text-[var(--accent-color)]" />
            جنسیت
          </label>
          <div className="relative">
            <motion.select
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              value={formData.gender || 'male'}
              onChange={(e) => updateField('gender', e.target.value)}
              className="input-glass h-12 text-lg font-medium transition-all duration-300 border-2 border-[var(--glass-border)] focus:border-[var(--accent-color)] pr-12 appearance-none bg-[var(--glass-bg)]"
            >
              <option value="male">👨 مرد</option>
              <option value="female">👩 زن</option>
            </motion.select>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ rotate: 180 }}
            >
              ▼
            </motion.div>
            {/* Gender icon based on selection */}
            <motion.div
              key={formData.gender}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center"
            >
              {formData.gender === 'female' ? '👩' : '👨'}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <GraduationCap size={16} className="text-[var(--accent-color)]" />
            تحصیلات
          </label>
          <div className="relative">
            <motion.select
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              value={formData.education || ''}
              onChange={(e) => updateField('education', e.target.value)}
              className="input-glass h-12 text-lg font-medium transition-all duration-300 border-2 border-[var(--glass-border)] focus:border-[var(--accent-color)] pr-12 appearance-none bg-[var(--glass-bg)]"
            >
              <option value="">🎓 انتخاب کنید</option>
              <option value="elementary">📚 ابتدایی</option>
              <option value="middle">🏫 متوسطه</option>
              <option value="high">🎓 دیپلم</option>
              <option value="associate">🎓 کاردانی</option>
              <option value="bachelor">🎓 کارشناسی</option>
              <option value="master">🎓 کارشناسی ارشد</option>
              <option value="phd">🎓 دکتری</option>
            </motion.select>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ rotate: 180 }}
            >
              ▼
            </motion.div>
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <GraduationCap size={20} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Heart size={16} className="text-[var(--accent-color)]" />
            وضعیت تأهل
          </label>
          <div className="relative">
            <motion.select
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              value={formData.maritalStatus || 'single'}
              onChange={(e) => updateField('maritalStatus', e.target.value)}
              className="input-glass h-12 text-lg font-medium transition-all duration-300 border-2 border-[var(--glass-border)] focus:border-[var(--accent-color)] pr-12 appearance-none bg-[var(--glass-bg)]"
            >
              <option value="single">💙 مجرد</option>
              <option value="married">💍 متأهل</option>
              <option value="divorced">💔 طلاق‌گرفته</option>
              <option value="widowed">😢 بیوه</option>
            </motion.select>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ rotate: 180 }}
            >
              ▼
            </motion.div>
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Heart size={20} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        className="group"
      >
        <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
          <MapPin size={16} className="text-[var(--accent-color)]" />
          آدرس
        </label>
        <div className="relative">
          <motion.textarea
            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
            value={formData.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            className="input-glass pr-12 min-h-[100px] resize-none text-lg font-medium transition-all duration-300 border-2 border-[var(--glass-border)] focus:border-[var(--accent-color)]"
            placeholder="آدرس کامل محل سکونت را وارد کنید..."
            rows={4}
          />
          <motion.div
            className="absolute right-4 top-4 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <MapPin size={20} />
          </motion.div>
          {/* Character counter */}
          {formData.address && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute left-4 bottom-4 text-xs font-medium text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-lg border border-[var(--glass-border)]"
            >
              {formData.address.length} کاراکتر
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};


