import React from 'react';
import { motion } from 'framer-motion';

export const BodyMap = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
              Interactive Programming
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Select the muscle. <br />
              <span className="text-indigo-600 dark:text-indigo-400">Build the workout.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Forget complex spreadsheets. Our visual interface allows you to target specific muscle groups and automatically generates scientifically backed exercises.
            </p>
            <ul className="space-y-4">
              {['Visual Muscle Selection', 'Instant Volume Calculation', 'Injury-aware Substitutions'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="relative z-10 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
              {/* Abstract Body Map Representation */}
              <div className="aspect-[3/4] relative bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                 <svg viewBox="0 0 200 400" className="w-full h-full opacity-50 dark:opacity-30">
                    <path d="M100,50 C120,50 130,70 130,90 C130,110 160,120 160,150 C160,200 130,220 130,300 L140,380 L110,380 L105,300 L95,300 L90,380 L60,380 L70,300 C70,220 40,200 40,150 C40,120 70,110 70,90 C70,70 80,50 100,50" fill="currentColor" className="text-slate-400" />
                 </svg>
                 
                 {/* Interactive Hotspots Animation */}
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute top-[30%] left-[30%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer"
                 />
                 <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="absolute top-[40%] right-[35%] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] cursor-pointer"
                 />
                 
                 {/* Floating Tooltip */}
                 <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute top-[25%] left-[40%] bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 text-xs"
                 >
                    <div className="font-bold text-slate-900 dark:text-white">Pectoralis Major</div>
                    <div className="text-slate-500">Target: Hypertrophy</div>
                 </motion.div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
