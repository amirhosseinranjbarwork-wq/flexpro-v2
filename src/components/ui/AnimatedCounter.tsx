import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  fontSize?: string;
  color?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  fontSize = 'text-4xl',
  color = 'text-blue-600'
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest * Math.pow(10, decimals)) / Math.pow(10, decimals)
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier
    });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, motionValue, rounded]);

  return (
    <motion.span
      className={`${fontSize} ${color} font-bold ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Enhanced stat card with mini chart and trend indicators
export const StatCounter: React.FC<{
  value: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: { value: number; positive: boolean };
  miniChart?: number[];
  gradient?: string;
}> = ({
  value,
  label,
  icon,
  color = 'text-blue-600',
  trend,
  miniChart,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}) => {
  const getIconColor = () => {
    if (color.includes('blue')) return 'text-blue-500';
    if (color.includes('green')) return 'text-green-500';
    if (color.includes('yellow')) return 'text-yellow-500';
    if (color.includes('purple')) return 'text-purple-500';
    return color;
  };

  const iconColor = getIconColor();

  return (
    <motion.div
      className="relative group overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"
        style={{ background: gradient }}
      />

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
           style={{ background: `${gradient}, transparent 70%` }} />

      <div className="relative glass-card p-6 border border-[var(--glass-border)] group-hover:border-[var(--accent-color)]/30 transition-all duration-300 rounded-2xl h-full">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
               style={{ backgroundColor: `${gradient.split(',')[0].replace('linear-gradient(135deg, ', '').replace(' 0%', '')}20` }}>
            {icon}
          </div>

          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                trend.positive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
            >
              <motion.div
                animate={{ y: trend.positive ? -2 : 2 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              >
                {trend.positive ? '↗' : '↘'}
              </motion.div>
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>

        {/* Main counter */}
        <div className="mb-2">
          <AnimatedCounter
            value={value}
            className={`${color} font-black`}
            fontSize="text-4xl"
          />
        </div>

        {/* Label */}
        <p className="text-[var(--text-secondary)] font-medium mb-3">{label}</p>

        {/* Mini chart */}
        {miniChart && miniChart.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end gap-1 h-8">
              {miniChart.slice(-7).map((val, index) => {
                const maxVal = Math.max(...miniChart);
                const height = maxVal > 0 ? (val / maxVal) * 100 : 0;
                return (
                  <motion.div
                    key={index}
                    className="flex-1 bg-gradient-to-t rounded-sm opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: gradient,
                      height: `${Math.max(height, 10)}%`
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 opacity-70">۷ روز گذشته</p>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
             style={{
               background: `radial-gradient(circle at center, ${gradient.split(',')[0].replace('linear-gradient(135deg, ', '').replace(' 0%', '')}10, transparent 70%)`
             }} />
      </div>
    </motion.div>
  );
};

// Floating counter for notifications/badges
export const FloatingCounter: React.FC<{
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
}> = ({ value, max: _max = 99, size = 'md', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-2.5 py-1.5'
  };

  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white'
  };

  return (
    <motion.div
      className={`
        absolute -top-2 -right-2 rounded-full font-bold
        ${sizeClasses[size]} ${variantClasses[variant]}
        shadow-lg border-2 border-white dark:border-gray-800
        flex items-center justify-center min-w-[1.5rem] min-h-[1.5rem]
      `}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ scale: 1.1 }}
    >
      <AnimatedCounter value={value} duration={0.5} />
    </motion.div>
  );
};

// Progress counter with percentage
export const ProgressCounter: React.FC<{
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}> = ({ current, total, label, showPercentage = true }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <AnimatedCounter
              value={percentage}
              suffix="%"
              className="text-sm font-bold text-blue-600"
              duration={1}
            />
          )}
        </div>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
          <AnimatedCounter value={current} duration={1} />
          <span className="mx-1">/</span>
          {total}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCounter;
