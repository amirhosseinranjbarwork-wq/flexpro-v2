/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';
import {
  findLocalUser,
  createLocalUser,
  verifyLocalPassword,
  createLocalSession,
  getLocalSession,
  clearLocalSession,
  getLocalUserById,
} from '../utils/localAuth';
import { authApi, api } from '../services/api';

type AuthFn = (identifier: string, password: string) => Promise<void>;
type RegisterFn = (params: { email?: string; password: string; fullName: string; role: string; username: string }) => Promise<void>;

interface Profile {
  id?: string;
  full_name?: string;
  role?: string;
  email?: string;
  username?: string;
  is_super_admin?: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = async (uid: string) => {
    if (!supabase) return null;

    try {
      // Try maybeSingle first
      const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (error) {
        // Fallback to single() if maybeSingle not available
        const { data: fallbackData, error: fallbackError } = await supabase.from('profiles').select('*').eq('id', uid).single();
        if (fallbackError) {
          console.warn('loadProfile error', fallbackError.message);
          return null;
        }
        return fallbackData as Profile | null;
      }
      return data as Profile | null;
    } catch (e) {
      console.warn('loadProfile error', e);
      return null;
    }
  };

  const resolveEmail = useCallback(async (identifier: string) => {
    if (!supabase) throw new Error('Supabase auth غیرفعال است');
    
    // If it already looks like an email, use it directly
    if (identifier.includes('@')) return identifier;
    
    // For now, treat identifier as email since the database schema doesn't have a username field
    // TODO: Add username field to profiles table and implement proper username-to-email resolution
    return identifier;
  }, []);

  useEffect(() => {
    // Use mock mode only when explicitly enabled via environment variable
    const useMockMode = import.meta.env.VITE_USE_MOCK === 'true';
    
    if (useMockMode) {
      // Check URL parameters for role
      const urlParams = new URLSearchParams(window.location.search);
      const roleFromUrl = urlParams.get('role') || 'coach'; // Default to coach
      if (import.meta.env.DEV) {
        console.log('⚡ Mock Mode: Setting up mock authentication');
      }
      // Create mock user object
      const mockUser: User = {
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
      const mockSession = {
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
      setSession(mockSession as Session);
      setRole('coach');
      setProfile(mockProfile);
      setReady(true);
      setLoading(false);

      if (import.meta.env.DEV) {
        console.log('✅ Mock authentication setup complete');
      }
      return;
    }

    // Check for local session if Supabase is not available
    if (!isSupabaseEnabled || !supabase) {
      if (import.meta.env.DEV) {
        console.log('🔒 Local Mode: Checking for local session');
      }
      
      const localSession = getLocalSession();
      if (localSession) {
        const localUser = getLocalUserById(localSession.userId);
        if (localUser) {
          // Convert local user to Supabase User format
          const userObj: User = {
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

          const sessionObj: Session = {
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
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        const rMeta = data.session.user?.user_metadata?.role;
        setRole(typeof rMeta === 'string' ? rMeta : null);
        loadProfile(data.session.user.id).then((p) => {
          if (p) {
            setProfile(p);
            if (p.role) setRole(p.role);
          }
        });
      }
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      const rMeta = newSession?.user?.user_metadata?.role;
      setRole(typeof rMeta === 'string' ? rMeta : null);
      if (newSession?.user?.id) {
        loadProfile(newSession.user.id).then((p) => {
          if (p) {
            setProfile(p);
            if (p.role) setRole(p.role);
          } else {
            setProfile(null);
          }
        });
      } else {
        setProfile(null);
      }
    });
    return () => {
      active = false;
      sub?.subscription.unsubscribe();
    };
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
          username: identifier.trim(),
          password,
        });

        // Convert API response to Supabase-compatible format
        const userObj: User = {
          id: String(response.user.id),
          email: response.user.email || undefined,
          user_metadata: {
            role: response.user.role,
            full_name: response.user.full_name,
            username: response.user.username,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
        };

        const sessionObj: Session = {
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
          username: response.user.username,
          is_super_admin: response.user.is_super_admin === 1,
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
        
        const userObj: User = {
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

        const sessionObj: Session = {
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

    // Legacy Supabase code (kept for backward compatibility)
    if (!isSupabaseEnabled || !supabase) {
      return;
    }
    
    // بررسی تنظیمات Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      const error = new Error('تنظیمات Supabase یافت نشد. لطفا فایل .env را بررسی کنید.');
      if (import.meta.env.DEV) console.error('Supabase config missing:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
      throw error;
    }
    
    // بررسی اعتبار URL
    if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
      const error = new Error('آدرس Supabase نامعتبر است. لطفا URL را بررسی کنید.');
      if (import.meta.env.DEV) console.error('Invalid Supabase URL:', supabaseUrl);
      throw error;
    }
    
    // Validation ورودی‌ها
    if (!identifier || !identifier.trim()) {
      throw new Error('ایمیل یا نام کاربری الزامی است');
    }
    
    if (!password || password.length < 6) {
      throw new Error('رمز عبور باید حداقل 6 کاراکتر باشد');
    }
    
    setLoading(true);
    try {
      const emailToUse = await resolveEmail(identifier);
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
      
      if (error) {
        // اگر خطای API یا اتصال است، به حالت محلی برگرد
        const isApiError = error.message.includes('Invalid API key') || 
                          error.message.includes('invalid api') || 
                          error.message.includes('API key') ||
                          error.message.includes('Invalid URL') ||
                          error.message.includes('invalid url') ||
                          error.message.includes('Network') ||
                          error.message.includes('network') ||
                          error.message.includes('fetch');
        
        if (isApiError) {
          if (import.meta.env.DEV) {
            console.warn('🔒 Supabase API error detected, falling back to local auth');
          }
          // Fallback to local auth - execute local auth code directly
          setLoading(false);
          // Execute local auth directly
          const localUser = findLocalUser(identifier.trim());
          if (!localUser) {
            throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
          }
          if (!verifyLocalPassword(localUser, password)) {
            throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
          }
          const session = createLocalSession(localUser.id);
          const userObj: User = {
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
          const sessionObj: Session = {
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
          return;
        }
        
        // تبدیل خطاهای Supabase به پیام‌های قابل فهم
        let errorMessage = 'خطا در ورود';
        
        // بررسی انواع خطاها
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid login')) {
          errorMessage = 'ایمیل/نام کاربری یا رمز عبور اشتباه است';
        } else if (error.message.includes('Email not confirmed') || error.message.includes('email not confirmed')) {
          errorMessage = 'لطفا ابتدا ایمیل خود را تایید کنید';
        } else if (error.message.includes('Too many requests') || error.message.includes('rate limit')) {
          errorMessage = 'تعداد درخواست‌ها زیاد است. لطفا کمی صبر کنید';
        } else {
          // نمایش پیام خطای اصلی اگر قابل فهم باشد
          errorMessage = error.message || 'خطا در ورود';
        }
        
        if (import.meta.env.DEV) {
          console.error('Sign in error details:', {
            message: error.message,
            status: error.status,
            name: error.name
          });
        }
        throw new Error(errorMessage);
      }
      
      // بررسی موفقیت
      if (!data || !data.session) {
        throw new Error('ورود ناموفق بود. لطفا دوباره تلاش کنید.');
      }
      
      // موفقیت
      if (import.meta.env.DEV) console.log('Sign in successful');
    } catch (err: unknown) {
      // اگر خطای اتصال یا API است، به حالت محلی برگرد
      if (err instanceof Error) {
        const isApiError = err.message.includes('Invalid API key') || 
                          err.message.includes('invalid api') || 
                          err.message.includes('API key') ||
                          err.message.includes('Invalid URL') ||
                          err.message.includes('invalid url') ||
                          err.message.includes('Network') ||
                          err.message.includes('network') ||
                          err.message.includes('fetch') ||
                          err.message.includes('Supabase auth غیرفعال');
        
        if (isApiError) {
          if (import.meta.env.DEV) {
            console.warn('🔒 Supabase error detected, falling back to local auth');
          }
          // Fallback to local auth - execute local auth code directly
          setLoading(false);
          // Execute local auth directly
          const localUser = findLocalUser(identifier.trim());
          if (!localUser) {
            throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
          }
          if (!verifyLocalPassword(localUser, password)) {
            throw new Error('ایمیل/نام کاربری یا رمز عبور اشتباه است');
          }
          const session = createLocalSession(localUser.id);
          const userObj: User = {
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
          const sessionObj: Session = {
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
          return;
        }
      }
      
      if (import.meta.env.DEV) {
        console.error('Sign in error:', err);
        if (err instanceof Error) {
          console.error('Error stack:', err.stack);
        }
      }
      
      // اگر خطا از قبل یک Error است، آن را پرتاب کن
      if (err instanceof Error) {
        throw err;
      }
      
      // در غیر این صورت، یک خطای جدید ایجاد کن
      throw new Error('خطای غیرمنتظره در ورود. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [resolveEmail]);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating successful signup');
      // Return mock success - no actual authentication needed
      return;
    }

    if (!isSupabaseEnabled || !supabase) throw new Error('Supabase auth غیرفعال است');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
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
    
    // Clear Supabase session if available
    if (isSupabaseEnabled && supabase) {
      await supabase.auth.signOut();
    }
    
    setUser(null);
    setSession(null);
    setRole(null);
    setProfile(null);
  }, []);

  const register: RegisterFn = useCallback(async ({ email, password, fullName, role: r, username }) => {
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
        const response = await authApi.register({
          username: username.trim(),
          email: email?.trim(),
          password,
          full_name: fullName.trim(),
          role: r as 'coach' | 'client',
        });

        // Convert API response to Supabase-compatible format
        const userObj: User = {
          id: String(response.user.id),
          email: response.user.email || undefined,
          user_metadata: {
            role: response.user.role,
            full_name: response.user.full_name,
            username: response.user.username,
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          email_confirmed_at: new Date().toISOString(),
        };

        const sessionObj: Session = {
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
          username: response.user.username,
          is_super_admin: response.user.is_super_admin === 1,
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
        
        const userObj: User = {
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

        const sessionObj: Session = {
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

    // Legacy Supabase code (kept for backward compatibility)
    if (!isSupabaseEnabled || !supabase) {
      return;
    }
    
    // Validation ورودی‌ها
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
    
    setLoading(true);
    try {
      // بررسی تکراری بودن نام کاربری
      const { data: existing, error: usernameErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1)
        .maybeSingle();
      
      // اگر خطای API یا اتصال است، به حالت محلی برگرد
      if (usernameErr) {
        const isApiError = usernameErr.message.includes('Invalid API key') || 
                          usernameErr.message.includes('invalid api') || 
                          usernameErr.message.includes('API key') ||
                          usernameErr.message.includes('Invalid URL') ||
                          usernameErr.message.includes('invalid url') ||
                          usernameErr.message.includes('Network') ||
                          usernameErr.message.includes('network') ||
                          usernameErr.message.includes('fetch');
        
        if (isApiError && usernameErr.code !== 'PGRST116') {
          if (import.meta.env.DEV) {
            console.warn('🔒 Supabase API error detected, falling back to local auth');
          }
          // Fallback to local auth - execute local registration code directly
          // Validation already done above, so proceed with local registration
          const localUser = createLocalUser({
            email: email?.trim() || undefined,
            username: username.trim(),
            password,
            fullName: fullName.trim(),
            role: r as 'coach' | 'client',
          });
          const session = createLocalSession(localUser.id);
          const userObj: User = {
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
          const sessionObj: Session = {
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
          return;
        }
        
        if (usernameErr.code !== 'PGRST116') {
          if (import.meta.env.DEV) console.error('Username check error:', usernameErr);
          throw new Error('خطا در بررسی نام کاربری');
        }
      }
      
      if (existing) {
        throw new Error('نام کاربری تکراری است. لطفا نام کاربری دیگری انتخاب کنید');
      }

      const finalEmail = (email && email.trim().length > 0) ? email.trim() : `${username}-${Date.now()}@placeholder.flexpro`;

      const { data, error } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: {
          data: { role: r, full_name: fullName, username },
        }
      });
      
      if (error) {
        // اگر خطای API یا اتصال است، به حالت محلی برگرد
        const isApiError = error.message.includes('Invalid API key') || 
                          error.message.includes('invalid api') || 
                          error.message.includes('API key') ||
                          error.message.includes('Invalid URL') ||
                          error.message.includes('invalid url') ||
                          error.message.includes('Network') ||
                          error.message.includes('network') ||
                          error.message.includes('fetch');
        
        if (isApiError) {
          if (import.meta.env.DEV) {
            console.warn('🔒 Supabase API error detected, falling back to local auth');
          }
          // Fallback to local auth - execute local registration code directly
          // Validation already done above, so proceed with local registration
          const localUser = createLocalUser({
            email: email?.trim() || undefined,
            username: username.trim(),
            password,
            fullName: fullName.trim(),
            role: r as 'coach' | 'client',
          });
          const session = createLocalSession(localUser.id);
          const userObj: User = {
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
          const sessionObj: Session = {
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
          return;
        }
        
        // تبدیل خطاهای Supabase به پیام‌های قابل فهم
        let errorMessage = 'خطا در ثبت‌نام';
        if (error.message.includes('User already registered')) {
          errorMessage = 'این ایمیل قبلا ثبت شده است';
        } else if (error.message.includes('Password')) {
          errorMessage = 'رمز عبور ضعیف است';
        } else if (error.message.includes('Email')) {
          errorMessage = 'ایمیل نامعتبر است';
        } else {
          errorMessage = error.message || 'خطا در ثبت‌نام';
        }
        if (import.meta.env.DEV) console.error('Sign up error:', error);
        throw new Error(errorMessage);
      }
      
      // ثبت پروفایل
      if (data.user && supabase) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: r,
          email: finalEmail,
          username
        } as unknown as Record<string, unknown>);
        
        if (profileError) {
          // اگر خطای API است، به حالت محلی برگرد
          const isApiError = profileError.message.includes('Invalid API key') || 
                            profileError.message.includes('invalid api') || 
                            profileError.message.includes('API key') ||
                            profileError.message.includes('Invalid URL') ||
                            profileError.message.includes('invalid url') ||
                            profileError.message.includes('Network') ||
                            profileError.message.includes('network') ||
                            profileError.message.includes('fetch');
          
          if (isApiError) {
            if (import.meta.env.DEV) {
              console.warn('🔒 Supabase API error detected, falling back to local auth');
            }
            // Fallback to local auth
            setLoading(false);
            return register({ email, password, fullName, role: r, username }); // Recursive call will use local auth
          }
          
          if (import.meta.env.DEV) console.error('Profile upsert error:', profileError);
          throw new Error('خطا در ثبت پروفایل');
        }
        
        setRole(r);
        setProfile({ id: data.user.id, full_name: fullName, role: r, email: finalEmail, username });
        if (import.meta.env.DEV) console.log('Registration successful');
      } else {
        throw new Error('خطا در ایجاد کاربر');
      }
    } catch (err: unknown) {
      // اگر خطای اتصال یا API است، به حالت محلی برگرد
      if (err instanceof Error) {
        const isApiError = err.message.includes('Invalid API key') || 
                          err.message.includes('invalid api') || 
                          err.message.includes('API key') ||
                          err.message.includes('Invalid URL') ||
                          err.message.includes('invalid url') ||
                          err.message.includes('Network') ||
                          err.message.includes('network') ||
                          err.message.includes('fetch') ||
                          err.message.includes('Supabase auth غیرفعال');
        
        if (isApiError) {
          if (import.meta.env.DEV) {
            console.warn('🔒 Supabase error detected, falling back to local auth');
          }
          // Fallback to local auth
          setLoading(false);
          return register({ email, password, fullName, role: r, username }, true); // Recursive call will use local auth
        }
      }
      
      if (import.meta.env.DEV) console.error('Register error:', err);
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

