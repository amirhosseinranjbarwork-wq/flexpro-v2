import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'tilt' | 'morph' | 'border' | 'shadow';
  onClick?: () => void;
  disabled?: boolean;
}

// Default card with subtle hover effects
export const HoverCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  disabled = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glow':
        return {
          hover: {
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 0.4)'
          }
        };
      case 'tilt':
        return {
          hover: { rotateY: 5, rotateX: 5 }
        };
      case 'morph':
        return {
          hover: {
            borderRadius: '2rem',
            scale: 1.05
          }
        };
      case 'border':
        return {
          hover: {
            borderColor: 'rgba(59, 130, 246, 0.6)',
            borderWidth: '2px'
          }
        };
      case 'shadow':
        return {
          hover: {
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)'
          }
        };
      default:
        return {
          hover: {
            y: -8,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <motion.div
      className={`glass-card cursor-pointer select-none ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={!disabled ? variantStyles.hover : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </motion.div>
  );
};

// Card with magnetic hover effect
export const MagneticCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  onClick,
  disabled = false
}) => {
  return (
    <motion.div
      className={`glass-card cursor-pointer select-none ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        rotateX: 2,
        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      onClick={!disabled ? onClick : undefined}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <motion.div
        style={{
          transformStyle: "preserve-3d"
        }}
        whileHover={{
          rotateY: -2,
          rotateX: -2
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Card with reveal animation
export const RevealCard: React.FC<EnhancedCardProps & {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}> = ({
  frontContent,
  backContent,
  className = '',
  onClick,
  disabled = false
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsFlipped(!isFlipped);
      onClick?.();
    }
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        perspective: "1000px",
        minHeight: "200px"
      }}
      onClick={handleClick}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden"
        }}
      >
        <div className="glass-card p-6 h-full flex items-center justify-center">
          {frontContent}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden"
        }}
      >
        <div className="glass-card p-6 h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          {backContent}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Card with ripple effect on click
export const RippleCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  onClick,
  disabled = false
}) => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.div
      className={`glass-card cursor-pointer select-none relative overflow-hidden ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onClick={handleClick}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: 20,
            opacity: 0
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Card with morphing background
export const MorphingCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  onClick,
  disabled = false
}) => {
  return (
    <motion.div
      className={`relative cursor-pointer select-none overflow-hidden ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      whileHover={{
        scale: 1.02
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
        initial={{ opacity: 0 }}
        whileHover={{
          opacity: 1,
          background: [
            "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
            "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2))",
            "linear-gradient(225deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
            "linear-gradient(315deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Content */}
      <div className="relative z-10 glass-card">
        {children}
      </div>
    </motion.div>
  );
};

// Floating card with continuous animation
export const FloatingCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  onClick,
  disabled = false
}) => {
  return (
    <motion.div
      className={`glass-card cursor-pointer select-none ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 1, 0, -1, 0]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        boxShadow: '0 25px 50px rgba(59, 130, 246, 0.3)',
        animate: {
          rotate: [0, 2, 0, -2, 0],
          y: [-5, -15, -5]
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={!disabled ? onClick : undefined}
    >
      {children}
    </motion.div>
  );
};

export default HoverCard;
