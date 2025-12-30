import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './index';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component
 * Protects admin pages by checking if user has is_super_admin flag
 * Uses local authentication
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, profile, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user, profile, authLoading]);

  const checkAdminStatus = async () => {
    try {
      if (authLoading) {
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if user is admin from profile
      const isUserAdmin = profile?.is_super_admin === true || profile?.role === 'coach';
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
