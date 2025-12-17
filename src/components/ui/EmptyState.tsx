import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = '' }) => {
  return (
    <motion.div 
      className={`empty-state-enhanced ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div 
        className="empty-state-enhanced-icon"
        animate={{ 
          y: [0, -12, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-heading-3 text-[var(--text-primary)] mb-3 font-bold">{title}</h3>
      <p className="text-body-small text-[var(--text-secondary)] mb-6 max-w-md mx-auto leading-relaxed">{description}</p>
      {action && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;


