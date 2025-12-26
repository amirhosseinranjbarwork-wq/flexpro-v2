import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, HeartPulse, Zap } from 'lucide-react';

const features = [
  {
    icon: <Dumbbell size={32} />,
    title: 'Resistance',
    description: 'Hypertrophy focused programming with RPE, RIR, and Tempo logic built-in.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    icon: <HeartPulse size={32} />,
    title: 'Cardio',
    description: 'Zone-based training targeting specific energy systems for metabolic efficiency.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: <Activity size={32} />,
    title: 'Corrective',
    description: 'Mobility protocols and injury prevention integrated into daily routines.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: <Zap size={32} />,
    title: 'Plyometric',
    description: 'Power development with ground contact time and vertical force production focus.',
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
            The 4 Pillars of <span className="text-blue-600 dark:text-blue-400">Total Performance</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Most apps only track reps. We engineer complete athletes by integrating every aspect of physical development.
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
