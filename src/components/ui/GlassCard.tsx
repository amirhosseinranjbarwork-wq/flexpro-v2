import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'minimal';
  glow?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glow = false,
  animate = true,
  onClick
}) => {
  const baseClasses = 'relative rounded-2xl border backdrop-blur-xl transition-all duration-300';

  const variants = {
    default: 'bg-white/10 dark:bg-black/40 border-white/20 shadow-2xl',
    elevated: 'bg-white/15 dark:bg-black/50 border-white/30 shadow-3xl',
    minimal: 'bg-white/5 dark:bg-black/20 border-white/10 shadow-lg'
  };

  const glowClass = glow ? 'shadow-lg shadow-white/20 dark:shadow-white/10' : '';

  const cardContent = (
    <div
      className={`${baseClasses} ${variants[variant]} ${glowClass} ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={onClick ? { scale: 1.02 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default GlassCard;


