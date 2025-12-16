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

// Preset counter variants for common use cases
export const StatCounter: React.FC<{
  value: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}> = ({ value, label, icon, color = 'text-blue-600' }) => (
  <motion.div
    className="glass-card p-6 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05 }}
  >
    {icon && (
      <div className="flex justify-center mb-3">
        <motion.div
          className={`${color} text-3xl`}
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {icon}
        </motion.div>
      </div>
    )}
    <AnimatedCounter
      value={value}
      className={`${color} block`}
      fontSize="text-3xl"
    />
    <p className="text-gray-600 dark:text-gray-300 mt-2 font-medium">{label}</p>
  </motion.div>
);

// Floating counter for notifications/badges
export const FloatingCounter: React.FC<{
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
}> = ({ value, max = 99, size = 'md', variant = 'primary' }) => {
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

  const displayValue = value > max ? `${max}+` : value;

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
