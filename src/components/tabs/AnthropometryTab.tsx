import React from 'react';
import { Ruler, Scale, Calculator, Target } from 'lucide-react';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface AnthropometryTabProps {
  form: UseUserFormReturn;
}

export const AnthropometryTab: React.FC<AnthropometryTabProps> = ({ form }) => {
  const { formData, errors, calculations, updateField, updateNestedField } = form;

  return (
    <div className="space-y-6">
      {/* Basic Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            سن (سال) *
          </label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => updateField('age', e.target.value)}
              className={`input-glass ${errors.age ? 'border-red-500' : ''}`}
              placeholder="25"
              min="10"
              max="120"
            />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            قد (cm) *
          </label>
          <div className="relative">
            <Ruler className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="number"
              value={formData.height || ''}
              onChange={(e) => updateField('height', e.target.value)}
              className={`input-glass pr-8 ${errors.height ? 'border-red-500' : ''}`}
              placeholder="175"
              min="100"
              max="250"
              step="0.1"
            />
          </div>
          {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            وزن (kg) *
          </label>
          <div className="relative">
            <Scale className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateField('weight', e.target.value)}
              className={`input-glass pr-8 ${errors.weight ? 'border-red-500' : ''}`}
              placeholder="75"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
        </div>
      </div>

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
            value={typeof formData.nutritionGoals === 'string' ? formData.nutritionGoals : 'maintenance'}
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


