import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangle',
  width,
  height,
  className = '',
  animate = true
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded overflow-hidden';
  const animationClasses = animate ? 'loading-skeleton' : '';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circle':
        return 'rounded-full';
      case 'card':
        return 'rounded-2xl p-4 space-y-3';
      default:
        return 'rounded-lg';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${animationClasses} ${className}`} style={style}>
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        </motion.div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${getVariantClasses()} ${animationClasses} ${className}`}
      style={style}
      initial={{ opacity: 0.5 }}
      animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={animate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
      role="presentation"
      aria-hidden="true"
    />
  );
};

// Compound component for common skeleton patterns
export const Skeleton = {
  Text: (props: Omit<SkeletonLoaderProps, 'variant'>) => (
    <SkeletonLoader {...props} variant="text" />
  ),
  Circle: (props: Omit<SkeletonLoaderProps, 'variant'>) => (
    <SkeletonLoader {...props} variant="circle" />
  ),
  Rectangle: (props: Omit<SkeletonLoaderProps, 'variant'>) => (
    <SkeletonLoader {...props} variant="rectangle" />
  ),
  Card: (props: Omit<SkeletonLoaderProps, 'variant'>) => (
    <SkeletonLoader {...props} variant="card" />
  ),
};

export default SkeletonLoader;