import React, { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  glassEffect?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * SpotlightCard: A glassmorphism card with a cursor-tracking radial gradient spotlight effect
 * Uses framer-motion for smooth animations and Tailwind for styling
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(59, 130, 246, 0.1)', // Blue by default
  glassEffect = true,
  interactive = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPos({ x, y });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (interactive) setIsHovering(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'relative overflow-hidden rounded-2xl transition-all duration-300',
        glassEffect && 'bg-white/5 border border-white/10 backdrop-blur-xl',
        interactive && 'cursor-pointer hover:border-white/20',
        onClick && 'hover:shadow-lg hover:shadow-blue-500/10',
        className
      )}
    >
      {/* Spotlight Effect */}
      {isHovering && interactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 400px at ${spotlightPos.x}px ${spotlightPos.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Static Subtle Gradient Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-40" />

      {/* Border Glow on Hover */}
      {isHovering && interactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20"
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
export default SpotlightCard;

