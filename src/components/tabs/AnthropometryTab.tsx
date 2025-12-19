import React from 'react';
import { Ruler, Scale, Calculator, TrendingUp, Target, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface AnthropometryTabProps {
  form: UseUserFormReturn;
}

export const AnthropometryTab: React.FC<AnthropometryTabProps> = ({ form }) => {
  const { formData, errors, calculations, updateField, updateNestedField } = form;

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
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30"
        >
          📏
        </motion.div>
        <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">اندازه‌گیری‌های بدنی</h3>
        <p className="text-[var(--text-secondary)]">اطلاعات فیزیکی و محاسبات تغذیه‌ای</p>
      </motion.div>

      {/* Basic Measurements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Activity size={16} className="text-[var(--accent-color)]" />
            سن (سال) *
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="number"
              value={formData.age || ''}
              onChange={(e) => updateField('age', e.target.value)}
              className={`input-glass h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.age
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="25"
              min="10"
              max="120"
            />
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-lg border border-[var(--glass-border)]"
              whileHover={{ scale: 1.05 }}
            >
              سال
            </motion.div>
          </div>
          <AnimatePresence>
            {errors.age && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">⚠️</span>
                {errors.age}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Ruler size={16} className="text-[var(--accent-color)]" />
            قد (cm) *
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateField('height', e.target.value)}
              className={`input-glass pr-12 h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.height
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="175"
              min="100"
              max="250"
              step="0.1"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Ruler size={20} />
            </motion.div>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-lg border border-[var(--glass-border)]"
              whileHover={{ scale: 1.05 }}
            >
              cm
            </motion.div>
          </div>
          <AnimatePresence>
            {errors.height && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">📏</span>
                {errors.height}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="group"
        >
          <label className="block text-sm font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Scale size={16} className="text-[var(--accent-color)]" />
            وزن (kg) *
          </label>
          <div className="relative">
            <motion.input
              whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(var(--accent-color-rgb), 0.1)" }}
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateField('weight', e.target.value)}
              className={`input-glass pr-12 h-12 text-lg font-medium transition-all duration-300 border-2 ${
                errors.weight
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--glass-border)] focus:border-[var(--accent-color)]'
              }`}
              placeholder="75"
              min="30"
              max="300"
              step="0.1"
            />
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Scale size={20} />
            </motion.div>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-lg border border-[var(--glass-border)]"
              whileHover={{ scale: 1.05 }}
            >
              kg
            </motion.div>
          </div>
          <AnimatePresence>
            {errors.weight && (
              <motion.p
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="text-red-500 text-xs mt-2 flex items-center gap-1"
              >
                <span className="animate-pulse">⚖️</span>
                {errors.weight}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Body Measurements */}
      <div className="glass-card p-4 rounded-xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">اندازه‌گیری‌های بدن</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              دور کمر (cm)
            </label>
            <input
              type="number"
              value={formData.measurements?.waist || ''}
              onChange={(e) => updateNestedField('measurements', 'waist', e.target.value)}
              className="input-glass"
              placeholder="85"
              min="50"
              max="150"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              دور باسن (cm)
            </label>
            <input
              type="number"
              value={formData.measurements?.hip || ''}
              onChange={(e) => updateNestedField('measurements', 'hip', e.target.value)}
              className="input-glass"
              placeholder="95"
              min="60"
              max="150"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              دور گردن (cm)
            </label>
            <input
              type="number"
              value={formData.measurements?.neck || ''}
              onChange={(e) => updateNestedField('measurements', 'neck', e.target.value)}
              className="input-glass"
              placeholder="38"
              min="30"
              max="50"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Activity & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            سطح فعالیت روزانه
          </label>
          <select
            value={formData.activity || '1.55'}
            onChange={(e) => updateField('activity', e.target.value)}
            className="input-glass"
          >
            <option value="1.2">نشسته (کم تحرک)</option>
            <option value="1.375">کم تحرک (ورزش سبک)</option>
            <option value="1.55">متوسط (ورزش ۳-۵ روز)</option>
            <option value="1.725">فعال (ورزش ۶-۷ روز)</option>
            <option value="1.9">بسیار فعال (ورزش سنگین)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            هدف تغذیه‌ای
          </label>
          <select
            value={formData.nutritionGoals || 'maintenance'}
            onChange={(e) => updateField('nutritionGoals', e.target.value)}
            className="input-glass"
          >
            <option value="maintenance">حفظ وزن</option>
            <option value="weight-loss">کاهش وزن</option>
            <option value="weight-gain">افزایش وزن</option>
            <option value="muscle-gain">افزایش عضله</option>
            <option value="recomp">ریکامپ بدن</option>
          </select>
        </div>
      </div>

      {/* Body Fat Input */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
          درصد چربی بدن (اختیاری - اگر می‌دانید وارد کنید)
        </label>
        <div className="relative">
          <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="number"
            value={formData.bodyFat || ''}
            onChange={(e) => updateField('bodyFat', e.target.value)}
            className="input-glass pr-8"
            placeholder="۱۵.۵"
            min="3"
            max="50"
            step="0.1"
          />
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          اگر نمی‌دانید، بر اساس اندازه‌گیری‌های بالا محاسبه می‌شود
        </p>
      </div>

      {/* Training Days */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
          روزهای تمرین در هفته
        </label>
        <select
          value={formData.days || '3'}
          onChange={(e) => updateField('days', e.target.value)}
          className="input-glass"
        >
          <option value="1">۱ روز</option>
          <option value="2">۲ روز</option>
          <option value="3">۳ روز</option>
          <option value="4">۴ روز</option>
          <option value="5">۵ روز</option>
          <option value="6">۶ روز</option>
          <option value="7">۷ روز</option>
        </select>
      </div>

      {/* Calculations Display */}
      {calculations.bmr > 0 && (
        <div className="glass-card p-6 rounded-xl border border-[var(--glass-border)]">
          <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            محاسبات تغذیه‌ای و بدنی
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* BMI */}
            <div className="text-center">
              <div className={`text-2xl font-black ${calculations.bmiColor}`}>
                {calculations.bmi || 'N/A'}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">BMI</div>
              <div className={`text-xs font-semibold ${calculations.bmiColor}`}>
                {calculations.bmiCategory}
              </div>
            </div>

            {/* BMR */}
            <div className="text-center">
              <div className="text-2xl font-black text-blue-500">
                {calculations.bmr.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">کالری پایه (BMR)</div>
            </div>

            {/* TDEE */}
            <div className="text-center">
              <div className="text-2xl font-black text-green-500">
                {calculations.tdee.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">کالری روزانه (TDEE)</div>
            </div>

            {/* Target Calories */}
            <div className="text-center">
              <div className="text-2xl font-black text-purple-500">
                {calculations.targetCalories.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">کالری هدف</div>
              {calculations.calorieAdjustment !== 0 && (
                <div className={`text-xs font-semibold ${calculations.calorieAdjustment > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {calculations.calorieAdjustment > 0 ? '+' : ''}{calculations.calorieAdjustment} cal
                </div>
              )}
            </div>

            {/* Body Fat */}
            <div className="text-center">
              <div className="text-2xl font-black text-orange-500">
                {calculations.bodyFatPercent || 'N/A'}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">% چربی بدن</div>
            </div>

            {/* Ideal Weight */}
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-500">
                {calculations.idealWeightMin}-{calculations.idealWeightMax}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">وزن ایده‌آل (kg)</div>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
            <h4 className="text-md font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
              <Target className="w-4 h-4" />
              توزیع macronutrients (گرم)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-500">{calculations.protein}</div>
                <div className="text-xs text-[var(--text-secondary)]">پروتئین</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-500">{calculations.fat}</div>
                <div className="text-xs text-[var(--text-secondary)]">چربی</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-500">{calculations.carbs}</div>
                <div className="text-xs text-[var(--text-secondary)]">کربوهیدرات</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


