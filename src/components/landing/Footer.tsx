import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ProCoach
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
              تنها پلتفرمی که فاصله بین علوم ورزشی بالینی و مربیگری عملی را پر می‌کند.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">محصول</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">امکانات</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">تعرفه‌ها</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">متدولوژی</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">نمونه کارها</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">شرکت</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">درباره ما</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">بلاگ</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">فرصت‌های شغلی</a></li>
              <li><Link to="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400">ورود</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ProCoach. تمامی حقوق محفوظ است.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">حریم خصوصی</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white">قوانین و مقررات</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
