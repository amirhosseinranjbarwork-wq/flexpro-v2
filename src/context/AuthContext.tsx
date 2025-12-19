/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from '../lib/supabaseClient';

type AuthFn = (identifier: string, password: string) => Promise<void>;
type RegisterFn = (params: { email?: string; password: string; fullName: string; role: string; username: string }) => Promise<void>;

interface Profile {
  id?: string;
  full_name?: string;
  role?: string;
  email?: string;
  username?: string;
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
    // Always use mock mode for demo
    if (true) {
      // Check URL parameters for role
      const urlParams = new URLSearchParams(window.location.search);
      const roleFromUrl = urlParams.get('role') || 'coach'; // Default to coach
      console.log('⚡ Mock Mode: Setting up mock authentication');
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
      setSession(mockSession as any);
      setRole('coach');
      setProfile(mockProfile);
      setReady(true);
      setLoading(false);

      console.log('✅ Mock authentication setup complete');
      return;
    }

    if (!isSupabaseEnabled || !supabase) {
      console.log('Supabase disabled, running in demo mode');
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

    if (!isSupabaseEnabled || !supabase) {
      const error = new Error('Supabase auth غیرفعال است');
      if (import.meta.env.DEV) console.error('Sign in error:', error);
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
      const { error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
      if (error) {
        // تبدیل خطاهای Supabase به پیام‌های قابل فهم
        let errorMessage = 'خطا در ورود';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'ایمیل/نام کاربری یا رمز عبور اشتباه است';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'لطفا ابتدا ایمیل خود را تایید کنید';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'تعداد درخواست‌ها زیاد است. لطفا کمی صبر کنید';
        } else {
          errorMessage = error.message || 'خطا در ورود';
        }
        if (import.meta.env.DEV) console.error('Sign in error:', error);
        throw new Error(errorMessage);
      }
      // موفقیت
      if (import.meta.env.DEV) console.log('Sign in successful');
    } catch (err: unknown) {
      if (import.meta.env.DEV) console.error('Sign in error:', err);
      throw err;
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

    if (!isSupabaseEnabled || !supabase) {
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const register: RegisterFn = useCallback(async ({ email, password, fullName, role: r, username }) => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      console.log('⚡ Mock Mode: Simulating successful registration');
      // Return mock success - no actual registration needed
      return;
    }

    if (!isSupabaseEnabled || !supabase) {
      const error = new Error('Supabase auth غیرفعال است');
      if (import.meta.env.DEV) console.error('Register error:', error);
      throw error;
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
      
      if (usernameErr && usernameErr.code !== 'PGRST116') {
        if (import.meta.env.DEV) console.error('Username check error:', usernameErr);
        throw new Error('خطا در بررسی نام کاربری');
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
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: r,
          email: finalEmail,
          username
        });
        
        if (profileError) {
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

