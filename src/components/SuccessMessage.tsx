import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-xs text-emerald-500 mt-1 ${className}`} role="status">
      <CheckCircle size={14} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default SuccessMessage;

















