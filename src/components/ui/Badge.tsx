import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gradient';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  animated?: boolean;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const getBadgeClasses = (variant: BadgeVariant, size: BadgeSize, animated: boolean) => {
  const baseClasses = "inline-flex items-center rounded-full text-xs font-medium transition-all duration-200";

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    primary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    secondary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${animated ? 'animate-pulse' : ''}`;
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    animated = false,
    dot = false,
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
  return (
    <motion.span
      ref={ref}
      className={cn(getBadgeClasses(variant, size, animated), className)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.3
        }}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "inline-block w-2 h-2 rounded-full mr-1.5",
              variant === 'success' && "bg-green-400",
              variant === 'warning' && "bg-yellow-400",
              variant === 'error' && "bg-red-400",
              variant === 'primary' && "bg-blue-400",
              variant === 'secondary' && "bg-purple-400",
              variant === 'gradient' && "bg-white/80",
              !['success', 'warning', 'error', 'primary', 'secondary', 'gradient'].includes(variant || 'default') && "bg-gray-400"
            )}
          />
        )}

        {children}

        {removable && (
          <button
            onClick={onRemove}
            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            aria-label="حذف برچسب"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </motion.span>
    );
  }
);

Badge.displayName = "Badge";

// Preset badge components
export const StatusBadge: React.FC<{
  status: 'online' | 'offline' | 'away' | 'busy';
  children?: React.ReactNode;
}> = ({ status, children }) => {
  const statusConfig = {
    online: { variant: 'success' as const, text: 'آنلاین' },
    offline: { variant: 'default' as const, text: 'آفلاین' },
    away: { variant: 'warning' as const, text: 'دور از دسترس' },
    busy: { variant: 'error' as const, text: 'مشغول' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} dot>
      {children || config.text}
    </Badge>
  );
};

export const PriorityBadge: React.FC<{
  priority: 'low' | 'medium' | 'high' | 'urgent';
  children?: React.ReactNode;
}> = ({ priority, children }) => {
  const priorityConfig = {
    low: { variant: 'default' as const, text: 'کم' },
    medium: { variant: 'warning' as const, text: 'متوسط' },
    high: { variant: 'error' as const, text: 'بالا' },
    urgent: { variant: 'error' as const, animated: true, text: 'فوری' },
  };

  const config = priorityConfig[priority];

  return (
    <Badge variant={config.variant} animated={config.animated}>
      {children || config.text}
    </Badge>
  );
};

export default Badge;

