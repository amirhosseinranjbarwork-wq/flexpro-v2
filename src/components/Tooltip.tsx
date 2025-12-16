import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  className?: string;
  disabled?: boolean;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'auto',
  delay = 300,
  className = '',
  disabled = false,
  maxWidth = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = () => {
    if (position !== 'auto' || !tooltipRef.current || !triggerRef.current) {
      setActualPosition(position === 'auto' ? 'top' : position);
      return;
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceTop = triggerRect.top;
    const spaceBottom = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    // Determine best position based on available space
    if (spaceTop >= tooltipRect.height + 10) {
      setActualPosition('top');
    } else if (spaceBottom >= tooltipRect.height + 10) {
      setActualPosition('bottom');
    } else if (spaceLeft >= tooltipRect.width + 10) {
      setActualPosition('left');
    } else if (spaceRight >= tooltipRect.width + 10) {
      setActualPosition('right');
    } else {
      setActualPosition('top'); // fallback
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && position === 'auto') {
      // Small delay to ensure tooltip is rendered
      setTimeout(calculatePosition, 0);
    }
  }, [isVisible, position]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
          duration: 0.2
        }
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15 }
      }
    };

    switch (actualPosition) {
      case 'top':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: 5 },
          visible: { ...baseVariants.visible, y: 0 },
          exit: { ...baseVariants.exit, y: 5 }
        };
      case 'bottom':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: -5 },
          visible: { ...baseVariants.visible, y: 0 },
          exit: { ...baseVariants.exit, y: -5 }
        };
      case 'left':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: 5 },
          visible: { ...baseVariants.visible, x: 0 },
          exit: { ...baseVariants.exit, x: 5 }
        };
      case 'right':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -5 },
          visible: { ...baseVariants.visible, x: 0 },
          exit: { ...baseVariants.exit, x: -5 }
        };
      default:
        return baseVariants;
    }
  };

  const getArrowClasses = () => {
    const baseClasses = "absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45";

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 transform -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1 top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1 top-1/2 transform -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="inline-block"
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={`
              fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700
              rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 dark:border-gray-600
              pointer-events-none whitespace-nowrap max-w-xs break-words
              ${className}
            `}
            style={{
              maxWidth: `${maxWidth}px`,
              zIndex: 9999
            }}
            variants={getTooltipVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="tooltip"
          >
            {content}

            {/* Arrow */}
            <div className={getArrowClasses()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
