import React from 'react';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
  variant?: 'default' | 'card' | 'table';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ lines = 3, className = '', variant = 'default' }) => {
  if (variant === 'card') {
    return (
      <div className={`glass-card p-6 space-y-4 ${className}`}>
        <div className="skeleton-title w-3/4"></div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="skeleton-text"
              style={{ width: i === lines - 1 ? '60%' : '100%' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton-circle w-10 h-10"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton-title w-1/4"></div>
              <div className="skeleton-text w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-text"
          style={{ width: i === lines - 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;


