import React from 'react';
import type { User, NutritionGoals } from '../../types';

interface PrintProgressProps {
  user: User;
  onPrint: () => void;
}

// Helper to get nutrition goals as object
const getNutritionGoals = (user: User): NutritionGoals | null => {
  if (!user.nutritionGoals) return null;
  if (typeof user.nutritionGoals === 'string') {
    try {
      return JSON.parse(user.nutritionGoals) as NutritionGoals;
    } catch {
      return null;
    }
  }
  return user.nutritionGoals;
};

const PrintProgress: React.FC<PrintProgressProps> = ({ user, onPrint }) => {
  // محاسبه BMI
  const calculateBMI = () => {
    if (!user.height || !user.weight) return null;
    const height = typeof user.height === 'string' ? parseFloat(user.height) : user.height;
    const weight = typeof user.weight === 'string' ? parseFloat(user.weight) : user.weight;
    if (isNaN(height) || isNaN(weight) || height === 0) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // دسته‌بندی BMI
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'کم‌وزن', color: 'text-blue-600', bgColor: 'bg-blue-500/10' };
    if (bmi < 25) return { category: 'طبیعی', color: 'text-green-600', bgColor: 'bg-green-500/10' };
    if (bmi < 30) return { category: 'اضافه وزن', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    if (bmi < 35) return { category: 'چاقی درجه ۱', color: 'text-orange-600', bgColor: 'bg-orange-500/10' };
    if (bmi < 40) return { category: 'چاقی درجه ۲', color: 'text-red-600', bgColor: 'bg-red-500/10' };
    return { category: 'چاقی درجه ۳', color: 'text-red-800', bgColor: 'bg-red-800/10' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          📈 گزارش پیشرفت و شاخص‌ها
        </h2>
        <p className="text-[var(--text-secondary)]">
          تحلیل وضعیت بدنی و پیشرفت {user.name}
        </p>
      </div>

      {/* شاخص‌های بدنی */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>📏</span> شاخص‌های بدنی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BMI */}
          <div className="text-center p-4 rounded-xl border border-[var(--glass-border)]">
            <div className="text-3xl font-bold text-[var(--accent-color)] mb-2">
              {bmi || 'N/A'}
            </div>
            <div className="text-sm text-[var(--text-secondary)] mb-1">شاخص توده بدنی (BMI)</div>
            {bmiInfo && (
              <div className={`text-xs px-2 py-1 rounded-full ${bmiInfo.bgColor} ${bmiInfo.color}`}>
                {bmiInfo.category}
              </div>
            )}
          </div>

          {/* قد */}
          <div className="text-center p-4 rounded-xl border border-[var(--glass-border)]">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {user.height || 'N/A'}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">قد (cm)</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">سانتی‌متر</div>
          </div>

          {/* وزن */}
          <div className="text-center p-4 rounded-xl border border-[var(--glass-border)]">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {user.weight || 'N/A'}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">وزن (kg)</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">کیلوگرم</div>
          </div>

          {/* سن */}
          <div className="text-center p-4 rounded-xl border border-[var(--glass-border)]">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {user.age || 'N/A'}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">سن</div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">سال</div>
          </div>
        </div>
      </div>

      {/* تحلیل وضعیت */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>🔍</span> تحلیل وضعیت بدنی
        </h3>

        <div className="space-y-4">
          {bmi && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">تحلیل BMI</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                شاخص توده بدنی شما {bmi} است که در دسته {bmiInfo?.category} قرار می‌گیرد.
                {parseFloat(bmi) < 18.5 && ' توصیه می‌شود با افزایش وزن سالم به وزن ایده‌آل برسید.'}
                {parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 && ' وزن شما در محدوده طبیعی قرار دارد.'}
                {parseFloat(bmi) >= 25 && parseFloat(bmi) < 30 && ' با کاهش وزن سالم می‌توانید به وزن ایده‌آل برسید.'}
                {parseFloat(bmi) >= 30 && ' کاهش وزن سالم برای بهبود وضعیت سلامتی ضروری است.'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">وضعیت تغذیه</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {user.plans?.diet && user.plans.diet.length > 0
                  ? `شما ${user.plans.diet.length} وعده غذایی برنامه‌ریزی شده دارید.`
                  : 'هیچ برنامه غذایی برنامه‌ریزی شده‌ای وجود ندارد.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">وضعیت تمرینی</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {user.plans?.workouts && Object.keys(user.plans.workouts).length > 0
                  ? `شما ${Object.keys(user.plans.workouts).length} برنامه تمرینی دارید.`
                  : 'هیچ برنامه تمرینی برنامه‌ریزی شده‌ای وجود ندارد.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* اهداف و توصیه‌ها */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>🎯</span> اهداف و توصیه‌ها
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-green-600 mt-1">✅</span>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">هدف اصلی</div>
              <div className="text-sm text-[var(--text-secondary)]">
                {getNutritionGoals(user)?.calories
                  ? `رسیدن به ${getNutritionGoals(user)?.calories} کالری روزانه`
                  : 'هدف تغذیه‌ای مشخص نشده'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">💪</span>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">تمرین منظم</div>
              <div className="text-sm text-[var(--text-secondary)]">
                حداقل ۳-۴ جلسه تمرین در هفته برای حفظ سلامتی
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-purple-600 mt-1">📊</span>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">پیگیری پیشرفت</div>
              <div className="text-sm text-[var(--text-secondary)]">
                اندازه‌گیری هفتگی وزن و BMI برای ردیابی پیشرفت
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* دکمه پرینت */}
      <div className="text-center pt-6">
        <button
          onClick={onPrint}
          className="px-8 py-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          🖨️ پرینت گزارش پیشرفت
        </button>
      </div>
    </div>
  );
};

export default PrintProgress;
