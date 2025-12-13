import React from 'react';
import { Heart, Pill, AlertTriangle, Stethoscope, Shield } from 'lucide-react';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface MedicalTabProps {
  form: UseUserFormReturn;
}

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

export const MedicalTab: React.FC<MedicalTabProps> = ({ form }) => {
  const { formData, updateField } = form;

  const toggleInjury = (injury: string) => {
    const currentInjuries = formData.injuries || [];
    if (currentInjuries.includes(injury)) {
      updateField('injuries', currentInjuries.filter(i => i !== injury));
    } else {
      updateField('injuries', [...currentInjuries, injury]);
    }
  };

  const toggleCondition = (condition: string) => {
    const currentConditions = formData.medicalConditions || [];
    if (currentConditions.includes(condition)) {
      updateField('medicalConditions', currentConditions.filter(c => c !== condition));
    } else {
      updateField('medicalConditions', [...currentConditions, condition]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Injuries Section */}
      <div className="glass-card p-4 rounded-xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          آسیب‌ها و محدودیت‌های جسمی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INJURIES_LIST.map(injury => (
            <label
              key={injury}
              className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${
                formData.injuries?.includes(injury)
                  ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
                  : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-red-500/30'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.injuries?.includes(injury) || false}
                onChange={() => toggleInjury(injury)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium">{injury}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medical Conditions Section */}
      <div className="glass-card p-4 rounded-xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          شرایط پزشکی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONDITIONS_LIST.map(condition => (
            <label
              key={condition}
              className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all ${
                formData.medicalConditions?.includes(condition)
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400'
                  : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-blue-500/30'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.medicalConditions?.includes(condition) || false}
                onChange={() => toggleCondition(condition)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
          <Pill className="w-4 h-4" />
          داروهای مصرفی
        </label>
        <textarea
          value={formData.medications || ''}
          onChange={(e) => updateField('medications', e.target.value)}
          className="input-glass min-h-[100px] resize-none"
          placeholder="نام داروها، دوز و زمان مصرف را وارد کنید..."
          rows={4}
        />
      </div>

      {/* Lifestyle Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            کیفیت خواب
          </label>
          <select
            value={formData.sleep || 'fair'}
            onChange={(e) => updateField('sleep', e.target.value)}
            className="input-glass"
          >
            <option value="excellent">عالی (۸+ ساعت)</option>
            <option value="good">خوب (۷-۸ ساعت)</option>
            <option value="fair">متوسط (۵-۷ ساعت)</option>
            <option value="poor">ضعیف (کمتر از ۵ ساعت)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            مصرف دخانیات
          </label>
          <select
            value={formData.smoke || 'no'}
            onChange={(e) => updateField('smoke', e.target.value)}
            className="input-glass"
          >
            <option value="no">نه</option>
            <option value="occasional">گاه‌به‌گاه</option>
            <option value="regular">روزانه</option>
            <option value="heavy">سوءمصرف</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            مصرف الکل
          </label>
          <select
            value={formData.alcohol || 'no'}
            onChange={(e) => updateField('alcohol', e.target.value)}
            className="input-glass"
          >
            <option value="no">نه</option>
            <option value="occasional">گاه‌به‌گاه</option>
            <option value="regular">روزانه</option>
            <option value="heavy">سوءمصرف</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            مصرف کافئین
          </label>
          <select
            value={formData.caffeine || 'no'}
            onChange={(e) => updateField('caffeine', e.target.value)}
            className="input-glass"
          >
            <option value="no">نه</option>
            <option value="low">کم (۱-۲ فنجان)</option>
            <option value="moderate">متوسط (۳-۴ فنجان)</option>
            <option value="high">زیاد (۵+ فنجان)</option>
          </select>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
          <Shield className="w-4 h-4 text-yellow-500" />
          آلرژی‌ها و حساسیت‌ها
        </label>
        <textarea
          value={formData.allergy || ''}
          onChange={(e) => updateField('allergy', e.target.value)}
          className="input-glass min-h-[80px] resize-none"
          placeholder="مواد غذایی، دارویی یا محیطی که به آن حساسیت دارید..."
          rows={3}
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          نکات پزشکی اضافی
        </label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          className="input-glass min-h-[100px] resize-none"
          placeholder="هرگونه اطلاعات پزشکی مهم دیگر..."
          rows={4}
        />
      </div>
    </div>
  );
};


