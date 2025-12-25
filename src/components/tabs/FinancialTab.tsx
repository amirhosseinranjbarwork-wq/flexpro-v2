import React from 'react';
import { DollarSign, Calendar, Clock, FileText, TrendingUp } from 'lucide-react';
import type { UseUserFormReturn } from '../../hooks/useUserForm';

interface FinancialTabProps {
  form: UseUserFormReturn;
}

export const FinancialTab: React.FC<FinancialTabProps> = ({ form }) => {
  const { formData, errors, updateField, updateNestedField } = form;

  const calculateTotalAmount = () => {
    const { amount = 0, duration = 1 } = formData.financial || {};
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return (numAmount || 0) * duration;
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('fa-IR').format(numAmount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Financial Information */}
      <div className="glass-card p-6 rounded-xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)] flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          اطلاعات مالی و قرارداد
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              مبلغ هر جلسه (تومان)
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="number"
                value={formData.financial?.amount || ''}
                onChange={(e) => updateNestedField('financial', 'amount', e.target.value)}
                className={`input-glass pr-8 ${errors.financial ? 'border-red-500' : ''}`}
                placeholder="۱۰۰,۰۰۰"
                min="0"
                step="10000"
              />
            </div>
            {errors.financial && <p className="text-red-500 text-xs mt-1">{errors.financial}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
              مدت قرارداد (ماه)
            </label>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <select
                value={formData.financial?.duration || 1}
                onChange={(e) => updateNestedField('financial', 'duration', parseInt(e.target.value) || 1)}
                className="input-glass pr-8"
              >
                <option value="1">۱ ماه</option>
                <option value="2">۲ ماه</option>
                <option value="3">۳ ماه</option>
                <option value="6">۶ ماه</option>
                <option value="12">۱۲ ماه</option>
              </select>
            </div>
          </div>
        </div>

        {/* Total Amount Display */}
        {(Number(formData.financial?.amount) || 0) > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--text-secondary)]">مجموع مبلغ قرارداد</div>
                <div className="text-2xl font-black text-green-600 dark:text-green-400">
                  {formatCurrency(calculateTotalAmount())} تومان
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        )}
      </div>

      {/* Contract Start Date */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)] flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          تاریخ شروع قرارداد
        </label>
        <input
          type="date"
          value={formData.financial?.startDate || ''}
          onChange={(e) => updateNestedField('financial', 'startDate', e.target.value)}
          className="input-glass"
        />
      </div>

      {/* Experience & Fitness Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            سابقه ورزشی
          </label>
          <select
            value={formData.exp || ''}
            onChange={(e) => updateField('exp', e.target.value)}
            className="input-glass"
          >
            <option value="">انتخاب کنید</option>
            <option value="beginner">مبتدی (کمتر از ۶ ماه)</option>
            <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
            <option value="advanced">پیشرفته (۲ تا ۵ سال)</option>
            <option value="expert">حرفه‌ای (بیشتر از ۵ سال)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            سطح فعلی تناسب اندام
          </label>
          <select
            value={formData.level || 'beginner'}
            onChange={(e) => updateField('level', e.target.value)}
            className="input-glass"
          >
            <option value="beginner">مبتدی</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">پیشرفته</option>
          </select>
        </div>
      </div>

      {/* Job & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            شغل
          </label>
          <input
            type="text"
            value={formData.job || ''}
            onChange={(e) => updateField('job', e.target.value)}
            className="input-glass"
            placeholder="شغل فعلی"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
            سطح فعالیت شغلی
          </label>
          <select
            value={formData.activity || '1.2'}
            onChange={(e) => updateField('activity', e.target.value)}
            className="input-glass"
          >
            <option value="1.2">نشسته (اداری)</option>
            <option value="1.375">ایستاده (معلم، فروشنده)</option>
            <option value="1.55">فعال (پرستار، مکانیک)</option>
            <option value="1.725">بسیار فعال (ساختمانی، نظامی)</option>
            <option value="1.9">سنگین (کشاورزی، معدن)</option>
          </select>
        </div>
      </div>

      {/* Contract Summary */}
      <div className="glass-card p-4 rounded-xl border border-[var(--glass-border)]">
        <h4 className="text-md font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
          <FileText className="w-4 h-4" />
          خلاصه قرارداد
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">مبلغ هر جلسه:</span>
            <span className="font-semibold">{formatCurrency(formData.financial?.amount || 0)} تومان</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">مدت قرارداد:</span>
            <span className="font-semibold">{formData.financial?.duration || 1} ماه</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">تاریخ شروع:</span>
            <span className="font-semibold">
              {formData.financial?.startDate
                ? new Date(formData.financial.startDate).toLocaleDateString('fa-IR')
                : 'مشخص نشده'
              }
            </span>
          </div>

          <div className="flex justify-between border-t border-[var(--glass-border)] pt-2 mt-2">
            <span className="text-[var(--text-primary)] font-bold">مجموع کل:</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {formatCurrency(calculateTotalAmount())} تومان
            </span>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      {(Number(formData.financial?.amount) || 0) > 0 && (formData.financial?.duration || 1) > 1 && (
        <div className="glass-card p-4 rounded-xl border border-[var(--glass-border)]">
          <h4 className="text-md font-bold mb-3 text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4" />
            برنامه پرداخت
          </h4>

          <div className="space-y-2">
            {Array.from({ length: formData.financial?.duration || 1 }, (_, index) => {
              const monthNumber = index + 1;
              const paymentDate = formData.financial?.startDate
                ? (() => {
                    const date = new Date(formData.financial!.startDate!);
                    date.setMonth(date.getMonth() + index);
                    return date;
                  })()
                : null;

              return (
                <div key={monthNumber} className="flex justify-between items-center p-2 rounded-lg bg-[var(--glass-bg)]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] text-white text-xs flex items-center justify-center font-bold">
                      {monthNumber}
                    </div>
                    <span className="text-sm">
                      ماه {monthNumber}
                      {paymentDate && (
                        <span className="text-[var(--text-secondary)] mr-2">
                          ({paymentDate.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })})
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(formData.financial?.amount || 0)} تومان
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


