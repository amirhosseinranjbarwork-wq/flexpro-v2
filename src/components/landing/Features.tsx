import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, HeartPulse, Zap } from 'lucide-react';

const features = [
  {
    icon: <Dumbbell size={32} />,
    title: 'تمرین مقاومتی',
    description: 'برنامه‌ریزی تخصصی هایپرتروفی و قدرت با منطق‌های RPE، RIR و تمپو.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: <HeartPulse size={32} />,
    title: 'تمرین کاردیو',
    description: 'تمرینات بر اساس ضربان قلب و زون‌های انرژی برای بهبود کارایی متابولیک.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: <Activity size={32} />,
    title: 'حرکات اصلاحی',
    description: 'پروتکل‌های پیشگیری از آسیب و بهبود دامنه حرکتی ادغام شده در برنامه روزانه.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: <Zap size={32} />,
    title: 'تمرین پلایومتریک',
    description: 'توسعه توان خروجی با تمرکز بر زمان تماس با زمین و تولید نیروی عمودی.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ۴ ستون اصلی <span className="text-blue-600 dark:text-blue-400">عملکرد کامل</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            اکثر اپلیکیشن‌ها فقط تکرارها را می‌شمارند. ما با ادغام تمام جنبه‌های توسعه فیزیکی، ورزشکاران کامل می‌سازیم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl border ${feature.border} ${feature.bg} dark:bg-slate-900/50 backdrop-blur-sm hover:translate-y-[-5px] transition-transform duration-300`}
            >
              <div className={`mb-4 ${feature.color}`}>{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
