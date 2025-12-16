import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, id, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />,
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
          progress: 'bg-yellow-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
          progress: 'bg-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className={`
            relative max-w-md w-full ${styles.bg} border ${styles.border}
            rounded-2xl shadow-lg backdrop-blur-xl overflow-hidden
            animate-fade-in-scale
          `}
          role="alert"
          aria-live="assertive"
        >
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              className={`absolute top-0 left-0 h-1 ${styles.progress}`}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          )}

          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {styles.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h4>

                {message && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {message}
                  </p>
                )}

                {action && (
                  <button
                    onClick={action.onClick}
                    className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    {action.label}
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => onClose(id), 300);
                }}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="بستن اعلان"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Notification Manager Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number,
    action?: { label: string; onClick: () => void }
  ) => {
    const id = Date.now().toString();
    const notification: NotificationProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: (notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      },
      action
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove after duration
    if (duration !== 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration || 5000);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success: (title: string, message?: string, duration?: number, action?: { label: string; onClick: () => void }) =>
      addNotification('success', title, message, duration, action),
    error: (title: string, message?: string, duration?: number, action?: { label: string; onClick: () => void }) =>
      addNotification('error', title, message, duration, action),
    warning: (title: string, message?: string, duration?: number, action?: { label: string; onClick: () => void }) =>
      addNotification('warning', title, message, duration, action),
    info: (title: string, message?: string, duration?: number, action?: { label: string; onClick: () => void }) =>
      addNotification('info', title, message, duration, action)
  };
};

// Notification Container Component
export const NotificationContainer: React.FC<{ notifications: NotificationProps[] }> = ({ notifications }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification {...notification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
