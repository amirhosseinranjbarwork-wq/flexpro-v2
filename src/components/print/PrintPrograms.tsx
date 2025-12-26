import React from 'react';
import type { User } from '../../types';

interface PrintProgramsProps {
  user: User;
  onPrint: (type: 'workout' | 'diet' | 'supplements' | 'all') => void;
}

const PrintPrograms: React.FC<PrintProgramsProps> = ({ user, onPrint }) => {
  const hasWorkoutProgram =
    !!user.plans?.workouts &&
    Object.values(user.plans.workouts).some((day) => (day?.length ?? 0) > 0);
  const hasDietProgram =
    (user.plans?.diet?.length ?? 0) > 0 || (user.plans?.dietRest?.length ?? 0) > 0;
  const hasSupplementProgram = user.plans?.supps && user.plans.supps.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          🏋️ پرینت برنامه‌های ساخته شده
        </h2>
        <p className="text-[var(--text-secondary)]">
          برنامه‌های تمرینی، غذایی و مکمل {user.name} را پرینت کنید
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* برنامه تمرینی */}
        <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg">
              💪
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">برنامه تمرینی</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {hasWorkoutProgram ? `${Object.values(user.plans.workouts).filter(d => (d?.length ?? 0) > 0).length} جلسه` : 'برنامه‌ای موجود نیست'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onPrint('workout')}
              disabled={!hasWorkoutProgram}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                hasWorkoutProgram
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasWorkoutProgram ? '🖨️ پرینت برنامه تمرینی' : 'برنامه‌ای موجود نیست'}
            </button>
          </div>
        </div>

        {/* برنامه غذایی */}
        <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              🥗
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">برنامه غذایی</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {hasDietProgram ? `${(user.plans.diet?.length ?? 0) + (user.plans.dietRest?.length ?? 0)} آیتم` : 'برنامه‌ای موجود نیست'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onPrint('diet')}
              disabled={!hasDietProgram}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                hasDietProgram
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasDietProgram ? '🖨️ پرینت برنامه غذایی' : 'برنامه‌ای موجود نیست'}
            </button>
          </div>
        </div>

        {/* برنامه مکمل */}
        <div className="glass-card p-6 rounded-2xl border border-[var(--glass-border)] hover:border-[var(--accent-color)]/30 transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
              💊
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">برنامه مکمل</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {hasSupplementProgram ? `${user.plans.supps.length} مکمل` : 'برنامه‌ای موجود نیست'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onPrint('supplements')}
              disabled={!hasSupplementProgram}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                hasSupplementProgram
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasSupplementProgram ? '🖨️ پرینت برنامه مکمل' : 'برنامه‌ای موجود نیست'}
            </button>
          </div>
        </div>
      </div>

      {/* پرینت همه برنامه‌ها */}
      {(hasWorkoutProgram || hasDietProgram || hasSupplementProgram) && (
        <div className="mt-8 p-6 glass-card rounded-2xl border border-[var(--glass-border)]">
          <div className="text-center">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              📋 پرینت همه برنامه‌ها
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              همه برنامه‌های {user.name} را در یک فایل پرینت کنید
            </p>
            <button
              onClick={() => onPrint('all')}
              className="px-8 py-4 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-secondary)] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              🖨️ پرینت همه برنامه‌ها
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintPrograms;
