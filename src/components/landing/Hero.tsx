import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 border border-blue-200 dark:border-blue-800"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              نسل جدید منطق فیتنس
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.2]">
              طراحی تمرین؛ <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                با دقت جراحی و پشتوانه علمی.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
              اولین پلتفرم جامع برای مربیان حرفه‌ای، ترکیب‌کننده تمرینات مقاومتی، کاردیو، اصلاحی و پلایومتریک با پارامترهای دقیق (RPE، تمپو، و زون‌ها).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
              >
                شروع دوره آزمایشی <ArrowLeft className="mr-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200">
                <Play className="ml-2 w-5 h-5 fill-current" /> مشاهده دمو
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-950" />
                ))}
              </div>
              <p>مورد اعتماد بیش از ۱۰۰۰ مربی نخبه</p>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200 dark:border-slate-700/50 group">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" 
                alt="Fitness Technology Dashboard" 
                className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

              {/* Mockup UI Elements Overlay */}
              <div className="absolute bottom-6 right-6 left-6">
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white text-sm font-medium">وضعیت سیستم: آنلاین</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                 </div>
              </div>
              
            </div>
            
            {/* Ambient Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-2xl -z-10 rounded-[3rem]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
