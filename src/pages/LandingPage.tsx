import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, BarChart3, Shield, Users, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white overflow-hidden font-sans">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-blue-400 to-purple-500 tracking-tight">
                فلکس‌پرو
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                نسخه توسعه آفلاین
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            پلتفرم هوشمند <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              مدیریت بدنسازی
            </span>
          </h1>

          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            پیشرفته‌ترین ابزار برای مربیان و ورزشکاران حرفه‌ای.
            طراحی برنامه‌های تمرینی هوشمند، پیگیری پیشرفت لحظه‌ای و مدیریت تغذیه تخصصی در یک محیط یکپارچه و کاربرپسند.
          </p>

          {/* Action Buttons - NO LOGIN REQUIRED */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard?role=coach')}
                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 flex items-center gap-3 overflow-hidden mb-3 transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <LayoutDashboard className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span>ورود به پنل مربی</span>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
              <p className="text-sm text-slate-400 transition-colors group-hover:text-blue-400">مدیریت شاگردان، طراحی برنامه، پیگیری پیشرفت</p>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard?role=client')}
                className="group px-10 py-5 bg-slate-900 border-2 border-slate-700 hover:border-purple-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-slate-800 hover:scale-105 flex items-center gap-3 mb-3 transform hover:-translate-y-1"
              >
                <Users className="w-6 h-6 text-slate-400 group-hover:text-purple-400 transition-colors transition-transform group-hover:scale-110" />
                <span>ورود به پنل شاگرد</span>
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
              <p className="text-sm text-slate-400 transition-colors group-hover:text-purple-400">مشاهده برنامه، ثبت پیشرفت، پیگیری تغذیه</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700 rounded-xl max-w-md mx-auto">
            <div className="flex items-center gap-2 justify-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">نسخه توسعه فعال</span>
            </div>
            <p className="text-xs text-slate-500 text-center">
              دسترسی مستقیم بدون نیاز به ثبت‌نام یا رمز عبور
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              چرا فلکس‌پرو؟
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              تجربه‌ای بی‌نظیر در مدیریت بدنسازی با ابزارهای پیشرفته و رابط کاربری مدرن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-blue-500/50 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">طراحی هوشمند برنامه</h3>
                <p className="text-slate-400 leading-relaxed">ساخت برنامه‌های تمرینی و غذایی پیچیده در چند ثانیه با رابط کاربری پیشرفته و الگوریتم‌های هوشمند.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-purple-500/50 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">آنالیز پیشرفته پیشرفت</h3>
                <p className="text-slate-400 leading-relaxed">مشاهده نمودارهای دقیق حجم تمرین، شدت، تغییرات بدن و تحلیل روند پیشرفت به صورت لحظه‌ای و تعاملی.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-slate-800 hover:border-pink-500/50 transition-all backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500/20 transition-colors">
                  <Shield className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">دسترسی کامل آفلاین</h3>
                <p className="text-slate-400 leading-relaxed">کارکرد کامل بدون اینترنت، سرعت بالا، امنیت داده‌ها و پشتیبان‌گیری خودکار در نسخه توسعه.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-blue-400 to-purple-500">
                فلکس‌پرو
              </span>
            </div>
            <p className="text-slate-400 mb-6">
              پیشرفته‌ترین پلتفرم مدیریت بدنسازی و ورزش حرفه‌ای
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-500">
              <span>نسخه توسعه 2.0</span>
              <span>•</span>
              <span>طراحی و توسعه با ❤️</span>
              <span>•</span>
              <span>2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}