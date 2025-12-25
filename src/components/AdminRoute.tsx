import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import { LoadingSpinner } from './index';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component
 * Protects admin pages by checking if user has is_super_admin flag
 * Supports both Supabase and Local Mock modes
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      // In local mode, allow access (for development)
      if (!isSupabaseEnabled || !supabase) {
        console.warn('Supabase not enabled, allowing admin access in local mode');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.is_super_admin === true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      // In case of error, allow access in local mode
      if (!isSupabaseEnabled) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
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
