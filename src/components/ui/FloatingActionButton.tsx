import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronUp } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  tooltip?: string;
  animate?: boolean;
}

// Single FAB
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = <Plus className="w-5 h-5" />,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  disabled = false,
  tooltip,
  animate = true
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30',
    secondary: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/30',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/30',
    error: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
  };

  return (
    <>
      <motion.button
        className={`
          fixed ${positionClasses[position]} ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          ${variantClasses[variant]}
          shadow-lg hover:shadow-xl transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          z-40
        `}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        whileHover={animate && !disabled ? {
          scale: 1.1,
          boxShadow: `0 20px 40px ${variant === 'primary' ? 'rgba(59, 130, 246, 0.4)' :
                                 variant === 'secondary' ? 'rgba(139, 92, 246, 0.4)' :
                                 variant === 'success' ? 'rgba(34, 197, 94, 0.4)' :
                                 variant === 'warning' ? 'rgba(245, 158, 11, 0.4)' :
                                 'rgba(239, 68, 68, 0.4)'}`
        } : {}}
        whileTap={animate && !disabled ? { scale: 0.95 } : {}}
        animate={animate ? {
          rotate: isHovered ? 180 : 0
        } : {}}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <motion.div
          animate={animate ? { rotate: isHovered ? 45 : 0 } : {}}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && isHovered && (
          <motion.div
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none"
            style={{
              [position.includes('right') ? 'right' : 'left']: '5rem',
              [position.includes('bottom') ? 'bottom' : 'top']: position.includes('md') ? '1rem' : '1.5rem'
            }}
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {tooltip}
            <div className="absolute w-2 h-2 bg-gray-900 rotate-45"
                 style={{
                   [position.includes('right') ? 'right' : 'left']: '-4px',
                   top: '50%',
                   transform: 'translateY(-50%)'
                 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Multi-action FAB with expandable menu
interface FabAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface ExpandableFabProps extends Omit<FloatingActionButtonProps, 'onClick' | 'icon'> {
  actions: FabAction[];
  mainIcon?: React.ReactNode;
}

export const ExpandableFab: React.FC<ExpandableFabProps> = ({
  actions,
  mainIcon,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  disabled = false,
  tooltip,
  animate = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const toggleMenu = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed ${positionClasses[position]} z-30`}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                className={`
                  absolute w-12 h-12 rounded-full flex items-center justify-center
                  ${action.color || 'bg-white text-gray-700'} shadow-lg
                  hover:shadow-xl transition-all duration-300
                  focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/50
                `}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                variants={{
                  closed: {
                    scale: 0,
                    y: 0,
                    opacity: 0
                  },
                  open: {
                    scale: 1,
                    y: -(index + 1) * 60,
                    opacity: 1
                  }
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.1
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <FloatingActionButton
        onClick={toggleMenu}
        icon={
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {mainIcon || (isOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
          </motion.div>
        }
        position={position}
        size={size}
        variant={variant}
        disabled={disabled}
        tooltip={tooltip}
        animate={animate}
      />
    </>
  );
};

// Scroll to top FAB
interface ScrollFabProps extends Omit<FloatingActionButtonProps, 'onClick' | 'icon'> {
  threshold?: number;
  smooth?: boolean;
}

export const ScrollToTopFab: React.FC<ScrollFabProps> = ({
  threshold = 200,
  smooth = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) return null;

  return (
    <FloatingActionButton
      onClick={scrollToTop}
      icon={<ChevronUp className="w-5 h-5" />}
      tooltip="بازگشت به بالا"
      {...props}
    />
  );
};

// Pulse FAB for notifications
export const PulseFab: React.FC<FloatingActionButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.7)',
          '0 0 0 10px rgba(59, 130, 246, 0)',
          '0 0 0 0 rgba(59, 130, 246, 0)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <FloatingActionButton {...props} />
    </motion.div>
  );
};

export default FloatingActionButton;
