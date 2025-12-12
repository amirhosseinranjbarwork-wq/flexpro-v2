import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`relative ${className}`} role="status" aria-label="در حال بارگذاری...">
      <motion.div
        className={`${sizeClasses[size]} border-[var(--accent-color)] border-t-transparent rounded-full`}
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
        }}
        style={{
          boxShadow: `0 0 25px rgba(14, 165, 233, 0.4), 0 0 50px rgba(14, 165, 233, 0.2)`
        }}
      />
      <motion.div
        className={`${sizeClasses[size]} border-[var(--accent-secondary)] border-t-transparent rounded-full absolute inset-0`}
        animate={{ 
          rotate: -360,
          scale: [1, 0.95, 1]
        }}
        transition={{ 
          rotate: { duration: 1.8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2.5, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }
        }}
        style={{
          opacity: 0.6,
          boxShadow: `0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)`
        }}
      />
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
};

export default LoadingSpinner;


