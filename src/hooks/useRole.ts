import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/index';

interface UseRoleResult {
  role: Role | null;
  profile: { role: Role; coach_code?: string } | null;
  loading: boolean;
}

/**
 * Custom hook to securely derive user role from Supabase user metadata or profile
 * Never relies on localStorage for security checks
 */
export const useRole = (): UseRoleResult => {
  const { user, profile, loading } = useAuth();

  const derivedRole: Role | null = useMemo(() => {
    // First check profile from database (most reliable)
    if (profile?.role === 'coach' || profile?.role === 'client') {
      return profile.role as Role;
    }

    // Fallback to user metadata (set during registration)
    const metadataRole = user?.user_metadata?.role;
    if (metadataRole === 'coach' || metadataRole === 'client') {
      return metadataRole as Role;
    }

    // If no role found, return null (user should set role)
    return null;
  }, [user, profile]);

  const derivedProfile = useMemo(() => {
    // Only return profile if it has a valid role
    if (profile?.role === 'coach' || profile?.role === 'client') {
      return profile as { role: Role; coach_code?: string };
    }
    return null;
  }, [profile]);

  return {
    role: derivedRole,
    profile: derivedProfile,
    loading,
  };
};

