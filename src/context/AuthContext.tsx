/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  findLocalUser,
  createLocalUser,
  verifyLocalPassword,
  createLocalSession,
  getLocalSession,
  clearLocalSession,
  getLocalUserById,
} from '../utils/localAuth';
import { authApi } from '../services/api';

// Local Auth Types (replacing Supabase types)
interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    role?: string;
    full_name?: string;
    username?: string;
  };
  app_metadata?: Record<string, unknown>;
  aud: string;
  created_at: string;
  updated_at: string;
  role: string;
  email_confirmed_at?: string;
}

interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

type AuthFn = (identifier: string, password: string) => Promise<void>;
type RegisterFn = (params: { email?: string; password: string; fullName: string; role: string; username: string }, forceLocal?: boolean) => Promise<void>;

interface Profile {
  id?: string;
  full_name?: string;
  role?: string;
  email?: string;
  username?: string;
  is_super_admin?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: AuthSession | null;
  role: string | null;
  profile: Profile | null;
  loading: boolean;
  signInWithPassword: AuthFn;
  signUpWithPassword: AuthFn;
  register: RegisterFn;
  signOut: () => Promise<void>;
  ready: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);


  useEffect(() => {
    // Use mock mode when explicitly enabled (for development)
    const useMockMode = import.meta.env.VITE_USE_MOCK === 'true';
    
    if (useMockMode) {
      // Check URL parameters for role
      const urlParams = new URLSearchParams(window.location.search);
      const roleFromUrl = urlParams.get('role') || 'coach'; // Default to coach
      if (import.meta.env.DEV) {
        console.log('⚡ Mock Mode: Setting up mock authentication');
      }
      // Create mock user object
      const mockUser: AuthUser = {
        id: 'mock-user-id',
        email: 'mock@flexpro.com',
        user_metadata: { role: roleFromUrl },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      };

      // Create mock session
      const mockSession: AuthSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
        expires_in: 24 * 60 * 60, // 24 hours in seconds
        token_type: 'bearer',
        user: mockUser,
      };

      // Create mock profile
      const mockProfile: Profile = {
        id: 'mock-user-id',
        full_name: roleFromUrl === 'coach' ? 'مربی آزمایشی' : 'شاگرد آزمایشی',
        role: roleFromUrl,
        email: 'mock@flexpro.com',
        username: roleFromUrl === 'coach' ? 'mockcoach' : 'mockclient',
        is_super_admin: roleFromUrl === 'coach',
      };

      // Set mock data immediately
      setUser(mockUser);
      setSession(mockSession);
      setRole('coach');
      setProfile(mockProfile);
      setReady(true);
      setLoading(false);

      if (import.meta.env.DEV) {
        console.log('✅ Mock authentication setup complete');
      }
      return;
    }

    // Check for local session
    if (import.meta.env.DEV) {
      console.log('🔒 Local Mode: Checking for local session');
    }
    
    const localSession = getLocalSession();
    if (localSession) {
      const localUser = getLocalUserById(localSession.userId);
      if (localUser) {
        // Convert local user to AuthUser format
        const userObj: AuthUser = {
          id: localUser.id,
          email: localUser.email,
          user_metadata: { role: localUser.role, full_name: localUser.fullName, username: localUser.username },
          app_metadata: {},
          aud: 'authenticated',
          created_at: localUser.createdAt,
          updated_at: localUser.updatedAt,
          role: 'authenticated',
          email_confirmed_at: localUser.createdAt,
        };

        const sessionObj: AuthSession = {
          access_token: localSession.token,
          refresh_token: '',
          expires_at: localSession.expiresAt / 1000,
          expires_in: Math.floor((localSession.expiresAt - Date.now()) / 1000),
          token_type: 'bearer',
          user: userObj,
        };

        setUser(userObj);
        setSession(sessionObj);
        setRole(localUser.role);
        setProfile({
          id: localUser.id,
          full_name: localUser.fullName,
          role: localUser.role,
          email: localUser.email,
          username: localUser.username,
          is_super_admin: localUser.role === 'coach',
        });
        
        if (import.meta.env.DEV) {
          console.log('✅ Local session restored');
        }
      }
    }
    
    setReady(true);
  }, []);

  const signInWithPassword = useCallback(async (identifier: string, password: string) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating successful login');
      // Return mock success - no actual authentication needed
      return;
    }

    // Try API-based authentication first (local-first approach)
    setLoading(true);
    try {
      // Validation
      if (!identifier || !identifier.trim()) {
        throw new Error('ایمیل یا نام کاربری الزامی است');
      }
      
      if (!password || password.length < 6) {
        throw new Error('رمز عبور باید حداقل 6 کاراکتر باشد');
      }

      // Use API service for authentication
      try {
        const response = await authApi.login({
          email: identifier.trim(),
          password,
        });

        // Convert API response to AuthUser format
        const userObj: AuthUser = {
          id: String(response.user.id),
          email: response.user.email || undefined,
          user_metadata: {
            role: response.user.role,
            full_name: response.user.full_name,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: response.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
        };

        const sessionObj: AuthSession = {
          access_token: response.access_token,
          refresh_token: '',
          expires_at: Date.now() / 1000 + 24 * 60 * 60, // 24 hours
          expires_in: 24 * 60 * 60,
          token_type: 'bearer',
          user: userObj,
        };

        setUser(userObj);
        setSession(sessionObj);
        setRole(response.user.role);
        setProfile({
          id: String(response.user.id),
          full_name: response.user.full_name || undefined,
          role: response.user.role,
          email: response.user.email || undefined,
          is_super_admin: response.user.role === 'coach',
        });

        if (import.meta.env.DEV) {
          console.log('✅ API login successful');
        }
        return;
      } catch (apiError) {
        // If API fails, fallback to local auth (for backward compatibility)
        if (import.meta.env.DEV) {
          console.warn('API login failed, falling back to local auth:', apiError);
        }
        
        // Fallback to local authentication
        const localUser = findLocalUser(identifier.trim());
        if (!localUser) {
          throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
        }
        
        if (!verifyLocalPassword(localUser, password)) {
          throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
        }
        
        const session = createLocalSession(localUser.id);
        
        const userObj: AuthUser = {
          id: localUser.id,
          email: localUser.email,
          user_metadata: { role: localUser.role, full_name: localUser.fullName, username: localUser.username },
          app_metadata: {},
          aud: 'authenticated',
          created_at: localUser.createdAt,
          updated_at: localUser.updatedAt,
          role: 'authenticated',
          email_confirmed_at: localUser.createdAt,
        };

        const sessionObj: AuthSession = {
          access_token: session.token,
          refresh_token: '',
          expires_at: session.expiresAt / 1000,
          expires_in: Math.floor((session.expiresAt - Date.now()) / 1000),
          token_type: 'bearer',
          user: userObj,
        };
        
        setUser(userObj);
        setSession(sessionObj);
        setRole(localUser.role);
        setProfile({
          id: localUser.id,
          full_name: localUser.fullName,
          role: localUser.role,
          email: localUser.email,
          username: localUser.username,
          is_super_admin: localUser.role === 'coach',
        });
        
        if (import.meta.env.DEV) {
          console.log('✅ Local login successful (fallback)');
        }
        return;
      }
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.error('Sign in error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }

  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating successful signup');
      // Return mock success - no actual authentication needed
      return;
    }

    // Use API for signup
    setLoading(true);
    try {
      const response = await authApi.register({
        email,
        password,
        full_name: email.split('@')[0],
        role: 'client',
      });
      
      // Convert to AuthUser format
      const userObj: AuthUser = {
        id: String(response.user.id),
        email: response.user.email,
        user_metadata: {
          role: response.user.role,
          full_name: response.user.full_name,
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: response.user.created_at,
        updated_at: new Date().toISOString(),
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      };

      const sessionObj: AuthSession = {
        access_token: response.access_token,
        refresh_token: '',
        expires_at: Date.now() / 1000 + 24 * 60 * 60,
        expires_in: 24 * 60 * 60,
        token_type: 'bearer',
        user: userObj,
      };

      setUser(userObj);
      setSession(sessionObj);
      setRole(response.user.role);
      setProfile({
        id: String(response.user.id),
        full_name: response.user.full_name,
        role: response.user.role,
        email: response.user.email,
        is_super_admin: response.user.role === 'coach',
      });
    } catch {
      // Fallback to local registration
      const localUser = createLocalUser({
        email,
        username: email.split('@')[0],
        password,
        fullName: email.split('@')[0],
        role: 'client',
      });
      
      const session = createLocalSession(localUser.id);
      const userObj: AuthUser = {
        id: localUser.id,
        email: localUser.email,
        user_metadata: { role: localUser.role, full_name: localUser.fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: localUser.createdAt,
        updated_at: localUser.updatedAt,
        role: 'authenticated',
        email_confirmed_at: localUser.createdAt,
      };

      const sessionObj: AuthSession = {
        access_token: session.token,
        refresh_token: '',
        expires_at: session.expiresAt / 1000,
        expires_in: Math.floor((session.expiresAt - Date.now()) / 1000),
        token_type: 'bearer',
        user: userObj,
      };
      
      setUser(userObj);
      setSession(sessionObj);
      setRole(localUser.role);
      setProfile({
        id: localUser.id,
        full_name: localUser.fullName,
        role: localUser.role,
        email: localUser.email,
        is_super_admin: localUser.role === 'coach',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating logout');
      setUser(null);
      setSession(null);
      setRole(null);
      setProfile(null);
      return;
    }

    // Clear API token
    authApi.logout();
    
    // Clear local session
    clearLocalSession();
    
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  }, []);

  const register: RegisterFn = useCallback(async ({ email, password, fullName, role: r, username }, _forceLocal = false) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating successful registration');
      // Return mock success - no actual registration needed
      return;
    }

    // Try API-based registration first (local-first approach)
    setLoading(true);
    try {
      // Validation
      if (!fullName || !fullName.trim() || fullName.trim().length < 2) {
        throw new Error('نام کامل باید حداقل 2 کاراکتر باشد');
      }
      
      if (!username || !username.trim() || username.trim().length < 3) {
        throw new Error('نام کاربری باید حداقل 3 کاراکتر باشد');
      }
      
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error('نام کاربری باید 3 تا 20 کاراکتر و فقط شامل حروف انگلیسی، اعداد و خط زیر باشد');
      }
      
      if (email && email.trim().length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('ایمیل وارد شده معتبر نیست');
        }
      }
      
      if (!password || password.length < 8) {
        throw new Error('رمز عبور باید حداقل 8 کاراکتر باشد');
      }
      
      if (!r || (r !== 'coach' && r !== 'client')) {
        throw new Error('نقش نامعتبر است');
      }

      // Use API service for registration
      try {
        const finalEmail = (email && email.trim().length > 0) ? email.trim() : `${username}-${Date.now()}@placeholder.flexpro`;
        const response = await authApi.register({
          email: finalEmail,
          password,
          full_name: fullName.trim(),
          role: r as 'coach' | 'client',
        });

        // Convert API response to AuthUser format
        const userObj: AuthUser = {
          id: String(response.user.id),
          email: response.user.email || undefined,
          user_metadata: {
            role: response.user.role,
            full_name: response.user.full_name,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: response.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
        };

        const sessionObj: AuthSession = {
          access_token: response.access_token,
          refresh_token: '',
          expires_at: Date.now() / 1000 + 24 * 60 * 60, // 24 hours
          expires_in: 24 * 60 * 60,
          token_type: 'bearer',
          user: userObj,
        };

        setUser(userObj);
        setSession(sessionObj);
        setRole(response.user.role);
        setProfile({
          id: String(response.user.id),
          full_name: response.user.full_name || undefined,
          role: response.user.role,
          email: response.user.email || undefined,
          username: username.trim(),
          is_super_admin: response.user.role === 'coach',
        });

        if (import.meta.env.DEV) {
          console.log('✅ API registration successful');
        }
        return;
      } catch (apiError) {
        // If API fails, fallback to local registration (for backward compatibility)
        if (import.meta.env.DEV) {
          console.warn('API registration failed, falling back to local registration:', apiError);
        }
        
        // Fallback to local registration
        const localUser = createLocalUser({
          email: email?.trim() || undefined,
          username: username.trim(),
          password,
          fullName: fullName.trim(),
          role: r as 'coach' | 'client',
        });
        
        const session = createLocalSession(localUser.id);
        
        const userObj: AuthUser = {
          id: localUser.id,
          email: localUser.email,
          user_metadata: { role: localUser.role, full_name: localUser.fullName, username: localUser.username },
          app_metadata: {},
          aud: 'authenticated',
          created_at: localUser.createdAt,
          updated_at: localUser.updatedAt,
          role: 'authenticated',
          email_confirmed_at: localUser.createdAt,
        };

        const sessionObj: AuthSession = {
          access_token: session.token,
          refresh_token: '',
          expires_at: session.expiresAt / 1000,
          expires_in: Math.floor((session.expiresAt - Date.now()) / 1000),
          token_type: 'bearer',
          user: userObj,
        };
        
        setUser(userObj);
        setSession(sessionObj);
        setRole(localUser.role);
        setProfile({
          id: localUser.id,
          full_name: localUser.fullName,
          role: localUser.role,
          email: localUser.email,
          username: localUser.username,
          is_super_admin: localUser.role === 'coach',
        });
        
        if (import.meta.env.DEV) {
          console.log('✅ Local registration successful (fallback)');
        }
        return;
      }
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.error('Register error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }

  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    ready,
    role,
    profile,
    signInWithPassword,
    signUpWithPassword,
    register,
    signOut
  }), [user, session, loading, ready, role, profile, signInWithPassword, signUpWithPassword, register, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext خارج از Provider استفاده شده است');
  return ctx;
};

