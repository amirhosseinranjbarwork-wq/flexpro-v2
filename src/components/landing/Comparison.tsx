import React from 'react';
import { Check, X } from 'lucide-react';

export const Comparison = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            حدس زدن را متوقف کنید. <span className="text-blue-600 dark:text-blue-400">مهندسی را شروع کنید.</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            ببینید چرا مربیان نخبه از اکسل‌های ثابت به برنامه‌ریزی داینامیک کوچ می‌کنند.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Old Way */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <X size={24} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">روش سنتی</h3>
            </div>
            <ul className="space-y-4">
              {['فایل‌های PDF/Excel ثابت و استاتیک', 'محاسبه دستی حجم تمرین', 'حدس زدن وزنه‌ها و RPE', 'عدم وجود بازخورد در لحظه', 'عکس‌های پیشرفت پراکنده و نامنظم'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-500">
                  <X size={18} className="text-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* New Way */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-blue-500 shadow-xl scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              مزیت پروکوچ
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Check size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">روش پروکوچ</h3>
            </div>
            <ul className="space-y-4">
              {['تغییرات داینامیک و هوشمند', 'محاسبه خودکار حجم و شدت تمرین', 'اهداف دقیق RPE و تمپو', 'آنالیز بازخورد فوری شاگرد', 'پیگیری امن و خصوصی گالری'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium">
                  <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <Check size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
