import React from 'react';
import { motion } from 'framer-motion';

// Base skeleton component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'pulse' | 'wave' | 'shimmer' | 'bounce';
  rounded?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'pulse',
  rounded = true
}) => {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 ${
    rounded ? 'rounded' : ''
  } ${className}`;

  const getAnimation = () => {
    switch (variant) {
      case 'wave':
        return {
          background: [
            'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
          ],
          backgroundSize: '200% 100%'
        };
      case 'shimmer':
        return {
          background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          x: ['-100%', '100%']
        };
      case 'bounce':
        return {
          scale: [1, 1.05, 1],
          opacity: [0.7, 1, 0.7]
        };
      default: // pulse
        return {
          opacity: [0.5, 1, 0.5]
        };
    }
  };

  return (
    <motion.div
      className={baseClasses}
      style={{
        width,
        height,
        ...(variant === 'wave' && {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%'
        })
      }}
      animate={variant !== 'wave' ? getAnimation() : undefined}
      transition={{
        duration: variant === 'bounce' ? 1.5 : 2,
        repeat: Infinity,
        ease: variant === 'bounce' ? "easeInOut" : "easeInOut"
      }}
    />
  );
};

// Text skeleton
export const TextSkeleton: React.FC<{
  lines?: number;
  className?: string;
  variant?: SkeletonProps['variant'];
}> = ({ lines = 1, className = '', variant = 'pulse' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={index === lines - 1 && lines > 1 ? '0.75rem' : '1rem'}
          width={index === lines - 1 ? '60%' : '100%'}
          variant={variant}
        />
      ))}
    </div>
  );
};

// Card skeleton
export const CardSkeleton: React.FC<{
  className?: string;
  variant?: SkeletonProps['variant'];
  showAvatar?: boolean;
  lines?: number;
}> = ({
  className = '',
  variant = 'pulse',
  showAvatar = true,
  lines = 3
}) => {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton width="3rem" height="3rem" rounded className="flex-shrink-0" variant={variant} />
          <div className="flex-1 space-y-2">
            <Skeleton height="1rem" width="60%" variant={variant} />
            <Skeleton height="0.75rem" width="40%" variant={variant} />
          </div>
        </div>
      )}
      <TextSkeleton lines={lines} variant={variant} />
    </motion.div>
  );
};

// List skeleton
export const ListSkeleton: React.FC<{
  count?: number;
  className?: string;
  variant?: SkeletonProps['variant'];
  showAvatar?: boolean;
}> = ({
  count = 5,
  className = '',
  variant = 'pulse',
  showAvatar = false
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="flex items-center space-x-4 p-4 glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {showAvatar && (
            <Skeleton width="2.5rem" height="2.5rem" rounded variant={variant} />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton height="1rem" width="80%" variant={variant} />
            <Skeleton height="0.75rem" width="60%" variant={variant} />
          </div>
          <Skeleton width="2rem" height="2rem" rounded variant={variant} />
        </motion.div>
      ))}
    </div>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
  variant?: SkeletonProps['variant'];
}> = ({
  rows = 5,
  columns = 4,
  className = '',
  variant = 'pulse'
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex space-x-4 p-4 glass-card">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton
            key={`header-${index}`}
            height="1rem"
            width={`${100 / columns}%`}
            variant={variant}
          />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex space-x-4 p-4 glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              height="1rem"
              width={`${100 / columns}%`}
              variant={variant}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

// Dashboard skeleton
export const DashboardSkeleton: React.FC<{
  className?: string;
  variant?: SkeletonProps['variant'];
}> = ({ className = '', variant = 'pulse' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CardSkeleton showAvatar={false} lines={2} variant={variant} />
          </motion.div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={1} variant={variant}>
          <div className="mt-4 space-y-3">
            <Skeleton height="12rem" variant={variant} />
          </div>
        </CardSkeleton>
        <CardSkeleton lines={1} variant={variant}>
          <div className="mt-4 space-y-3">
            <Skeleton height="12rem" variant={variant} />
          </div>
        </CardSkeleton>
      </div>

      {/* Table */}
      <CardSkeleton lines={1} variant={variant}>
        <div className="mt-4">
          <TableSkeleton rows={3} columns={5} variant={variant} />
        </div>
      </CardSkeleton>
    </div>
  );
};

// Profile skeleton
export const ProfileSkeleton: React.FC<{
  className?: string;
  variant?: SkeletonProps['variant'];
}> = ({ className = '', variant = 'pulse' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-6">
        <Skeleton width="6rem" height="6rem" rounded variant={variant} />
        <div className="space-y-3 flex-1">
          <Skeleton height="2rem" width="60%" variant={variant} />
          <Skeleton height="1rem" width="40%" variant={variant} />
          <Skeleton height="1rem" width="50%" variant={variant} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="30%" variant={variant} />
          <Skeleton height="1rem" width="100%" variant={variant} />
          <Skeleton height="1rem" width="90%" variant={variant} />
          <Skeleton height="1rem" width="80%" variant={variant} />
        </div>
        <div className="space-y-4">
          <Skeleton height="1.5rem" width="30%" variant={variant} />
          <Skeleton height="1rem" width="100%" variant={variant} />
          <Skeleton height="1rem" width="90%" variant={variant} />
          <Skeleton height="1rem" width="80%" variant={variant} />
        </div>
      </div>
    </div>
  );
};

// Shimmer overlay for existing content
export const ShimmerOverlay: React.FC<{
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}> = ({ children, loading = true, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="space-y-4 w-full max-w-md">
            <Skeleton height="2rem" variant="shimmer" />
            <Skeleton height="1rem" width="80%" variant="shimmer" />
            <Skeleton height="1rem" width="60%" variant="shimmer" />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Skeleton;
