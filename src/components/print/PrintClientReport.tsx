import React from 'react';
import type { User } from '../../types';

interface PrintClientReportProps {
  user: User;
  onPrint: () => void;
}

const PrintClientReport: React.FC<PrintClientReportProps> = ({ user, onPrint }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          📊 گزارش اطلاعات شاگرد
        </h2>
        <p className="text-[var(--text-secondary)]">
          گزارش کامل اطلاعات و آمار {user.name}
        </p>
      </div>

      {/* پیش‌نمایش اطلاعات */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>👤</span> اطلاعات شخصی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">نام:</span>
              <span className="font-semibold text-[var(--text-primary)]">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">جنسیت:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {user.gender === 'male' ? 'آقا' : user.gender === 'female' ? 'خانم' : 'نامشخص'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">سن:</span>
              <span className="font-semibold text-[var(--text-primary)]">{user.age} سال</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">قد:</span>
              <span className="font-semibold text-[var(--text-primary)]">{user.height} سانتی‌متر</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">وزن:</span>
              <span className="font-semibold text-[var(--text-primary)]">{user.weight} کیلوگرم</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">سطح:</span>
              <span className="font-semibold text-[var(--text-primary)]">{user.level || 'نامشخص'}</span>
            </div>
          </div>
        </div>

        {user.notes && (
          <div className="mt-4">
            <span className="text-[var(--text-secondary)] block mb-2">یادداشت‌ها:</span>
            <p className="bg-[var(--bg-secondary)] p-3 rounded-lg text-[var(--text-primary)]">
              {user.notes}
            </p>
          </div>
        )}
      </div>

      {/* آمار برنامه‌ها */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>📈</span> آمار برنامه‌ها
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {user.plans?.workouts ? Object.keys(user.plans.workouts).length : 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">برنامه تمرینی</div>
          </div>

          <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {user.plans?.diet ? user.plans.diet.length : 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">وعده غذایی</div>
          </div>

          <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {user.plans?.supps ? user.plans.supps.length : 0}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">مکمل غذایی</div>
          </div>
        </div>
      </div>

      {/* اطلاعات تغذیه */}
      {user.nutritionGoals && (
        <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)]">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span>🥗</span> اهداف تغذیه‌ای
          </h3>

          <div className="space-y-3">
            {user.nutritionGoals.calories && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">کالری روزانه:</span>
                <span className="font-semibold text-[var(--text-primary)]">{user.nutritionGoals.calories} kcal</span>
              </div>
            )}
            {user.nutritionGoals.protein && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">پروتئین:</span>
                <span className="font-semibold text-[var(--text-primary)]">{user.nutritionGoals.protein}g</span>
              </div>
            )}
            {user.nutritionGoals.carbs && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">کربوهیدرات:</span>
                <span className="font-semibold text-[var(--text-primary)]">{user.nutritionGoals.carbs}g</span>
              </div>
            )}
            {user.nutritionGoals.fat && (
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">چربی:</span>
                <span className="font-semibold text-[var(--text-primary)]">{user.nutritionGoals.fat}g</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* دکمه پرینت */}
      <div className="text-center pt-6">
        <button
          onClick={onPrint}
          className="px-8 py-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          🖨️ پرینت گزارش شاگرد
        </button>
      </div>
    </div>
  );
};

export default PrintClientReport;
