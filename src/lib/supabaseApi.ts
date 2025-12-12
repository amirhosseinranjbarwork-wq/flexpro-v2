/**
 * Supabase API Layer - Production Ready
 * 
 * This module provides a clean, type-safe interface to Supabase operations
 * with proper error handling and standardized response patterns.
 */

import { toast } from 'react-hot-toast';
import type {
  Template,
  User,
  Client,
  WorkoutPlanFromDB,
  UserPlans,
  ProgramRequest,
  ApiResponse,
  ProfileData
} from '../types/index';
import { supabase, isSupabaseEnabled } from './supabaseClient';

// ========== Centralized Error Handling ==========
interface ErrorContext {
  operation: string;
  userMessage?: string;
  showToast?: boolean;
  logError?: boolean;
}

class SupabaseErrorHandler {
  static handle(error: any, context: ErrorContext): ApiResponse<any> {
    const { operation, userMessage, showToast = true, logError = true } = context;

    // Log error for debugging
    if (logError && import.meta.env.DEV) {
      console.error(`${operation} failed:`, error);
    }

    // Show user-friendly message
    if (showToast) {
      const message = userMessage ||
        this.getUserFriendlyMessage(error, operation);
      toast.error(message);
    }

    return {
      data: null,
      error: {
        message: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
        details: error
      }
    };
  }

  private static getUserFriendlyMessage(error: any, operation: string): string {
    // Network errors
    if (!navigator.onLine) {
      return 'اتصال اینترنت شما قطع است';
    }

    // Authentication errors
    if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
      return 'لطفاً دوباره وارد شوید';
    }

    // Permission errors
    if (error?.code === 'PGRST116' || error?.message?.includes('permission')) {
      return 'دسترسی لازم برای این عملیات را ندارید';
    }

    // Duplicate key errors
    if (error?.code === '23505' || error?.message?.includes('duplicate')) {
      return 'این اطلاعات قبلاً ثبت شده است';
    }

    // Foreign key constraint errors
    if (error?.code === '23503') {
      return 'نمی‌توان این مورد را حذف کرد زیرا در جای دیگری استفاده شده';
    }

    // Generic operation-specific messages
    const operationMessages: Record<string, string> = {
      'save user': 'خطا در ذخیره اطلاعات کاربر',
      'delete user': 'خطا در حذف کاربر',
      'fetch users': 'خطا در بارگذاری لیست کاربران',
      'save template': 'خطا در ذخیره الگو',
      'fetch templates': 'خطا در بارگذاری الگوها',
      'create request': 'خطا در ارسال درخواست',
      'fetch requests': 'خطا در بارگذاری درخواست‌ها'
    };

    return operationMessages[operation.toLowerCase()] ||
           'خطایی رخ داده است. لطفاً دوباره تلاش کنید';
  }

  static success(message: string): void {
    toast.success(message);
  }

  static info(message: string): void {
    toast.info(message);
  }
}

// ========== Constants ==========
const tableUsers = 'users';
const tableTemplates = 'templates';
const tableClients = 'clients';
const tableWorkoutPlans = 'workout_plans';
const COACH_CODE_KEY = 'flexpro_coach_code';

// ========== Helper Functions ==========
const makeId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `sp-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
};

/**
 * Generate coach code from phone number (last 5 digits)
 * Returns null if phone is not provided or invalid
 */
const generateCoachCodeFromPhone = (phone: string | null | undefined): string | null => {
  if (!phone || typeof phone !== 'string') {
    return null;
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if we have at least 5 digits
  if (digitsOnly.length < 5) {
    return null;
  }
  
  // Return last 5 digits
  return digitsOnly.slice(-5);
};

const createApiResponse = <T>(data: T | null, error: Error | null): ApiResponse<T> => ({
  data,
  error
});

const handleSupabaseError = (error: unknown, operation: string): Error => {
  if (error instanceof Error) {
    if (import.meta.env.DEV) {
      console.error(`${operation} error:`, error);
    }
    return error;
  }
  return new Error(`${operation} failed: Unknown error`);
};

// ========== Users API ==========
export const fetchUsers = async (coachId?: string): Promise<ApiResponse<User[]>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<User[]>([], null);
  }

  try {
    let query = supabase.from(tableUsers).select('*');
    if (coachId) {
      query = query.eq('coach_id', coachId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return createApiResponse<User[]>(
        [],
        handleSupabaseError(error, 'fetchUsers')
      );
    }
    
    if (!data) {
      return createApiResponse<User[]>([], null);
    }
    
    return createApiResponse<User[]>(data as User[], null);
  } catch (err) {
    return createApiResponse<User[]>(
      [],
      handleSupabaseError(err, 'fetchUsers')
    );
  }
};

export const upsertUser = async (user: User): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(null, null);
  }

  try {
    const { error } = await supabase.from(tableUsers).upsert(user);
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'upsertUser')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'upsertUser')
    );
  }
};

export const removeUser = async (
  id: User['id'],
  coachId?: string
): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(null, null);
  }

  try {
    let query = supabase.from(tableUsers).delete().eq('id', id);
    if (coachId) {
      query = query.eq('coach_id', coachId);
    }
    
    const { error } = await query;
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'removeUser')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'removeUser')
    );
  }
};

// ========== Templates API ==========
export const fetchTemplates = async (coachId?: string): Promise<ApiResponse<Template[]>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<Template[]>([], null);
  }

  try {
    let query = supabase.from(tableTemplates).select('*');
    if (coachId) {
      query = query.eq('coach_id', coachId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return createApiResponse<Template[]>(
        [],
        handleSupabaseError(error, 'fetchTemplates')
      );
    }
    
    if (!data) {
      return createApiResponse<Template[]>([], null);
    }
    
    return createApiResponse<Template[]>(data as Template[], null);
  } catch (err) {
    return createApiResponse<Template[]>(
      [],
      handleSupabaseError(err, 'fetchTemplates')
    );
  }
};

export const upsertTemplate = async (template: Template): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(null, null);
  }

  try {
    const { error } = await supabase.from(tableTemplates).upsert(template);
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'upsertTemplate')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'upsertTemplate')
    );
  }
};

export const removeTemplate = async (
  id: Template['id'],
  coachId?: string
): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(null, null);
  }

  try {
    let query = supabase.from(tableTemplates).delete().eq('id', id);
    if (coachId) {
      query = query.eq('coach_id', coachId);
    }
    
    const { error } = await query;
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'removeTemplate')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'removeTemplate')
    );
  }
};

export const isSupabaseReady = isSupabaseEnabled;

// ========== Clients API ==========
export const fetchClientsByCoach = async (coachId: string): Promise<ApiResponse<Client[]>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<Client[]>([], null);
  }

  try {
    const { data, error } = await supabase
      .from(tableClients)
      .select('*')
      .eq('coach_id', coachId);
    
    if (error) {
      return createApiResponse<Client[]>(
        [],
        handleSupabaseError(error, 'fetchClientsByCoach')
      );
    }
    
    if (!data) {
      return createApiResponse<Client[]>([], null);
    }
    
    return createApiResponse<Client[]>(data as Client[], null);
  } catch (err) {
    return createApiResponse<Client[]>(
      [],
      handleSupabaseError(err, 'fetchClientsByCoach')
    );
  }
};

export const fetchClientById = async (clientId: string): Promise<ApiResponse<Client | null>> => {
  // Try localStorage first (for offline support)
  try {
    const saved = localStorage.getItem(`client_profile_${clientId}`);
    if (saved) {
      const localData = JSON.parse(saved) as Client;
      if (!isSupabaseEnabled || !supabase) {
        return createApiResponse<Client | null>(localData, null);
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<Client | null>(null, null);
  }
  
  try {
    const { data, error } = await supabase
      .from(tableClients)
      .select('*')
      .eq('id', clientId)
      .maybeSingle();
    
    if (error) {
      // Fallback to localStorage on error
      try {
        const saved = localStorage.getItem(`client_profile_${clientId}`);
        if (saved) {
          return createApiResponse<Client | null>(
            JSON.parse(saved) as Client,
            null
          );
        }
      } catch {
        // Ignore
      }
      return createApiResponse<Client | null>(
        null,
        handleSupabaseError(error, 'fetchClientById')
      );
    }
    
    return createApiResponse<Client | null>(data as Client | null, null);
  } catch (err) {
    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(`client_profile_${clientId}`);
      if (saved) {
        return createApiResponse<Client | null>(
          JSON.parse(saved) as Client,
          null
        );
      }
    } catch {
      // Ignore
    }
    return createApiResponse<Client | null>(
      null,
      handleSupabaseError(err, 'fetchClientById')
    );
  }
};

export const createClient = async (
  coachId: string,
  payload: Partial<Client>
): Promise<ApiResponse<Client>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<Client>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const insertPayload: Client = {
      ...payload,
      id: payload.id ?? makeId(),
      coach_id: coachId,
      full_name: payload.full_name ?? '',
    } as Client;
    
    const { data, error } = await supabase
      .from(tableClients)
      .insert(insertPayload)
      .select()
      .maybeSingle();
    
    if (error || !data) {
      return createApiResponse<Client>(
        null,
        handleSupabaseError(error ?? new Error('createClient failed'), 'createClient')
      );
    }
    
    return createApiResponse<Client>(data as Client, null);
  } catch (err) {
    return createApiResponse<Client>(
      null,
      handleSupabaseError(err, 'createClient')
    );
  }
};

export const upsertClient = async (
  payload: Partial<Client> & { id: string; coach_id: string }
): Promise<ApiResponse<Client>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<Client>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const { data, error } = await supabase
      .from(tableClients)
      .upsert(payload)
      .select()
      .maybeSingle();
    
    if (error || !data) {
      return createApiResponse<Client>(
        null,
        handleSupabaseError(error ?? new Error('upsertClient failed'), 'upsertClient')
      );
    }
    
    return createApiResponse<Client>(data as Client, null);
  } catch (err) {
    return createApiResponse<Client>(
      null,
      handleSupabaseError(err, 'upsertClient')
    );
  }
};

export const updateClient = async (
  id: string,
  payload: Partial<Client> & { coach_id?: string; profile_data?: ProfileData }
): Promise<Client> => {
  const effectiveCoachId = payload.coach_id || id;
  const safeProfileData: ProfileData | undefined = payload.profile_data ? { ...payload.profile_data } : undefined;
  
  const clientData: Client = {
    id,
    coach_id: effectiveCoachId,
    full_name: payload.full_name || '',
    gender: payload.gender,
    age: payload.age,
    height: payload.height,
    weight: payload.weight,
    goal: payload.goal,
    notes: payload.notes,
    profile_data: safeProfileData,
    profile_completed: payload.profile_completed ?? false,
    updated_at: new Date().toISOString(),
    created_at: payload.created_at || new Date().toISOString()
  };
  
  try {
    localStorage.setItem(`client_profile_${id}`, JSON.stringify(clientData));
  } catch {
    // ignore
  }
  
  if (!isSupabaseEnabled || !supabase) {
    return clientData;
  }
  
  try {
    const { data, error } = await supabase
      .from(tableClients)
      .upsert(clientData)
      .select()
      .maybeSingle();
    
    if (error) {
      SupabaseErrorHandler.handle(error, {
        operation: 'update client',
        userMessage: 'خطا در بروزرسانی اطلاعات مشتری'
      });
      return clientData;
    }

    return (data as Client) || clientData;
  } catch (err) {
    SupabaseErrorHandler.handle(err, {
      operation: 'update client',
      userMessage: 'خطا در بروزرسانی اطلاعات مشتری'
    });
    return clientData;
  }
};

export const deleteClient = async (id: string): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const { error } = await supabase.from(tableClients).delete().eq('id', id);
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'deleteClient')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'deleteClient')
    );
  }
};

// ========== Workout Plans API ==========
export const fetchWorkoutPlansByClient = async (
  clientId: string
): Promise<ApiResponse<WorkoutPlanFromDB[]>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<WorkoutPlanFromDB[]>([], null);
  }

  try {
    const { data, error } = await supabase
      .from(tableWorkoutPlans)
      .select('*')
      .eq('client_id', clientId);
    
    if (error) {
      return createApiResponse<WorkoutPlanFromDB[]>(
        [],
        handleSupabaseError(error, 'fetchWorkoutPlansByClient')
      );
    }
    
    if (!data) {
      return createApiResponse<WorkoutPlanFromDB[]>([], null);
    }
    
    return createApiResponse<WorkoutPlanFromDB[]>(data as WorkoutPlanFromDB[], null);
  } catch (err) {
    return createApiResponse<WorkoutPlanFromDB[]>(
      [],
      handleSupabaseError(err, 'fetchWorkoutPlansByClient')
    );
  }
};

export const fetchWorkoutPlansByCoach = async (
  coachId: string
): Promise<ApiResponse<WorkoutPlanFromDB[]>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<WorkoutPlanFromDB[]>([], null);
  }

  try {
    const { data, error } = await supabase
      .from(tableWorkoutPlans)
      .select('*')
      .eq('coach_id', coachId);
    
    if (error) {
      return createApiResponse<WorkoutPlanFromDB[]>(
        [],
        handleSupabaseError(error, 'fetchWorkoutPlansByCoach')
      );
    }
    
    if (!data) {
      return createApiResponse<WorkoutPlanFromDB[]>([], null);
    }
    
    return createApiResponse<WorkoutPlanFromDB[]>(data as WorkoutPlanFromDB[], null);
  } catch (err) {
    return createApiResponse<WorkoutPlanFromDB[]>(
      [],
      handleSupabaseError(err, 'fetchWorkoutPlansByCoach')
    );
  }
};

export const createWorkoutPlan = async (
  coachId: string,
  clientId: string,
  plan: UserPlans,
  title?: string,
  description?: string
): Promise<ApiResponse<WorkoutPlanFromDB>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const payload: Partial<WorkoutPlanFromDB> = {
      coach_id: coachId,
      client_id: clientId,
      plan_data: plan,
      title,
      description,
      id: makeId()
    };
    
    const { data, error } = await supabase
      .from(tableWorkoutPlans)
      .insert(payload)
      .select()
      .maybeSingle();
    
    if (error || !data) {
      return createApiResponse<WorkoutPlanFromDB>(
        null,
        handleSupabaseError(error ?? new Error('createWorkoutPlan failed'), 'createWorkoutPlan')
      );
    }
    
    return createApiResponse<WorkoutPlanFromDB>(data as WorkoutPlanFromDB, null);
  } catch (err) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      handleSupabaseError(err, 'createWorkoutPlan')
    );
  }
};

export const upsertWorkoutPlan = async (
  payload: Partial<WorkoutPlanFromDB> & {
    id: string;
    coach_id: string;
    client_id: string;
    plan_data: UserPlans;
  }
): Promise<ApiResponse<WorkoutPlanFromDB>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const { data, error } = await supabase
      .from(tableWorkoutPlans)
      .upsert(payload)
      .select()
      .maybeSingle();
    
    if (error || !data) {
      return createApiResponse<WorkoutPlanFromDB>(
        null,
        handleSupabaseError(error ?? new Error('upsertWorkoutPlan failed'), 'upsertWorkoutPlan')
      );
    }
    
    return createApiResponse<WorkoutPlanFromDB>(data as WorkoutPlanFromDB, null);
  } catch (err) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      handleSupabaseError(err, 'upsertWorkoutPlan')
    );
  }
};

export const updateWorkoutPlan = async (
  planId: string,
  plan: UserPlans,
  title?: string,
  description?: string
): Promise<ApiResponse<WorkoutPlanFromDB>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const payload: Partial<WorkoutPlanFromDB> = {
      plan_data: plan,
      title,
      description
    };
    
    const { data, error } = await supabase
      .from(tableWorkoutPlans)
      .update(payload)
      .eq('id', planId)
      .select()
      .maybeSingle();
    
    if (error || !data) {
      return createApiResponse<WorkoutPlanFromDB>(
        null,
        handleSupabaseError(error ?? new Error('updateWorkoutPlan failed'), 'updateWorkoutPlan')
      );
    }
    
    return createApiResponse<WorkoutPlanFromDB>(data as WorkoutPlanFromDB, null);
  } catch (err) {
    return createApiResponse<WorkoutPlanFromDB>(
      null,
      handleSupabaseError(err, 'updateWorkoutPlan')
    );
  }
};

export const deleteWorkoutPlan = async (planId: string): Promise<ApiResponse<void>> => {
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(
      null,
      new Error('Supabase unavailable')
    );
  }

  try {
    const { error } = await supabase.from(tableWorkoutPlans).delete().eq('id', planId);
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'deleteWorkoutPlan')
      );
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'deleteWorkoutPlan')
    );
  }
};

// ========== Coach Code API ==========
/**
 * Get or create coach code from phone number (last 5 digits)
 * Returns null if phone number is not set in profile
 */
export const getOrCreateCoachCode = async (coachId: string): Promise<string | null> => {
  // First, try to get phone number from profile
  let phone: string | null | undefined = null;
  
  // Check localStorage first
  try {
    const savedProfile = localStorage.getItem(`coach_profile_${coachId}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      phone = profile.phone;
    }
  } catch {
    // Ignore errors
  }
  
  // Check Supabase for phone number
  if (isSupabaseEnabled && supabase) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone, coach_code')
        .eq('id', coachId)
        .maybeSingle();
      
      if (profile) {
        // Use phone from database if available
        if (profile.phone) {
          phone = profile.phone;
        }
        
        // If coach_code exists and phone matches, return it
        if (profile.coach_code && profile.coach_code.length === 5) {
          const codeFromPhone = generateCoachCodeFromPhone(phone);
          if (codeFromPhone === profile.coach_code) {
            const localKey = `${COACH_CODE_KEY}_${coachId}`;
            localStorage.setItem(localKey, profile.coach_code);
            return profile.coach_code;
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }
  
  // If no phone number, return null
  if (!phone) {
    return null;
  }
  
  // Generate code from phone number
  const newCode = generateCoachCodeFromPhone(phone);
  
  if (!newCode) {
    return null;
  }
  
  // Check if code already exists for another coach (should be rare but possible)
  if (isSupabaseEnabled && supabase) {
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('coach_code', newCode)
        .neq('id', coachId)
        .maybeSingle();
      
      if (existing) {
        // Code conflict - this is very rare but possible
        // In this case, we still return the code but log a warning
        if (import.meta.env.DEV) {
          console.warn(`Coach code conflict: ${newCode} already exists for another coach`);
        }
      }
      
      // Save to DB
      try {
        await supabase
          .from('profiles')
          .update({ coach_code: newCode })
          .eq('id', coachId);
      } catch {
        // Ignore errors
      }
    } catch {
      // Ignore errors
    }
  }
  
  // Save to localStorage
  const localKey = `${COACH_CODE_KEY}_${coachId}`;
  localStorage.setItem(localKey, newCode);
  
  return newCode;
};

export const findCoachByCode = async (
  code: string
): Promise<{ id: string; full_name: string } | null> => {
  // Check localStorage first (for offline support)
  try {
    const allKeys = Object.keys(localStorage);
    for (const key of allKeys) {
      if (key.startsWith(`${COACH_CODE_KEY}_`)) {
        const savedCode = localStorage.getItem(key);
        if (savedCode === code) {
          const coachId = key.replace(`${COACH_CODE_KEY}_`, '');
          // Try to find coach name
          const profileKey = `coach_profile_${coachId}`;
          const profileData = localStorage.getItem(profileKey);
          if (profileData) {
            try {
              const profile = JSON.parse(profileData) as { fullName?: string };
              return { id: coachId, full_name: profile.fullName || 'مربی' };
            } catch {
              // Ignore parse errors
            }
          }
          // If no profile, try database
          if (isSupabaseEnabled && supabase) {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('id, full_name')
                .eq('id', coachId)
                .maybeSingle();
              if (data) {
                return { id: data.id, full_name: data.full_name || 'مربی' };
              }
            } catch {
              // Ignore errors
            }
          }
          return { id: coachId, full_name: 'مربی' };
        }
      }
    }
  } catch {
    // Ignore errors
  }
  
  // If not found in localStorage, check Supabase
  if (!isSupabaseEnabled || !supabase) {
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('coach_code', code)
      .eq('role', 'coach')
      .maybeSingle();
    
    if (error || !data) {
      // Try without role filter
      try {
        const { data: data2 } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('coach_code', code)
          .maybeSingle();
        if (data2) {
          return { id: data2.id, full_name: data2.full_name || 'مربی' };
        }
      } catch {
        // Ignore errors
      }
      return null;
    }
    
    return { id: data.id, full_name: data.full_name || 'مربی' };
  } catch {
    return null;
  }
};

// ========== Program Requests API ==========
const readLocalRequests = (key: string): ProgramRequest[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    return JSON.parse(saved) as ProgramRequest[];
  } catch {
    return [];
  }
};

const writeLocalRequests = (key: string, list: ProgramRequest[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // ignore
  }
};

const upsertRequestInKey = (key: string, req: ProgramRequest): void => {
  const list = readLocalRequests(key);
  const idx = list.findIndex(r => r.id === req.id);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...req };
  } else {
    list.unshift(req);
  }
  writeLocalRequests(key, list);
};

const syncRequestToLocal = (req: ProgramRequest): ProgramRequest => {
  upsertRequestInKey(`program_requests_${req.client_id}`, req);
  upsertRequestInKey(`coach_requests_${req.coach_id}`, req);
  return req;
};

const findLocalRequestById = (requestId: string): ProgramRequest | null => {
  try {
    const keys = Object.keys(localStorage).filter(
      k => k.startsWith('program_requests_') || k.startsWith('coach_requests_')
    );
    for (const key of keys) {
      const found = readLocalRequests(key).find(r => r.id === requestId);
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return null;
};

const removeRequestFromLocal = (requestId: string, coachId?: string, clientId?: string): void => {
  const keys = new Set<string>();
  if (clientId) keys.add(`program_requests_${clientId}`);
  if (coachId) keys.add(`coach_requests_${coachId}`);
  if (keys.size === 0) {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('program_requests_') || key.startsWith('coach_requests_')) {
          keys.add(key);
        }
      });
    } catch {
      // ignore
    }
  }
  keys.forEach(key => {
    const filtered = readLocalRequests(key).filter(r => r.id !== requestId);
    writeLocalRequests(key, filtered);
  });
};

export const createProgramRequest = async (
  request: Omit<ProgramRequest, 'id' | 'created_at' | 'updated_at'>
): Promise<ProgramRequest> => {
  const newRequest: ProgramRequest = {
    ...request,
    id: makeId(),
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  syncRequestToLocal(newRequest);
  
  // If Supabase is available, save there too
  if (isSupabaseEnabled && supabase) {
    try {
      const { data, error } = await supabase
        .from('program_requests')
        .insert(newRequest)
        .select()
        .maybeSingle();
      
      if (error) {
        SupabaseErrorHandler.handle(error, {
          operation: 'create request',
          userMessage: 'درخواست ارسال شد اما ممکن است تأخیر در پردازش داشته باشد'
        });
      }
      if (data) {
        const stored = data as ProgramRequest;
        syncRequestToLocal(stored);
        return stored;
      }
    } catch (err) {
      SupabaseErrorHandler.handle(err, {
        operation: 'create request',
        userMessage: 'درخواست ارسال شد اما ممکن است تأخیر در پردازش داشته باشد'
      });
    }
  }
  
  return newRequest;
};

export const fetchRequestsByCoach = async (coachId: string): Promise<ProgramRequest[]> => {
  // Read from localStorage first
  let localRequests: ProgramRequest[] = [];
  try {
    const key = `coach_requests_${coachId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      localRequests = JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }
  
  // If Supabase is not available, return localStorage data
  if (!isSupabaseEnabled || !supabase) {
    return localRequests;
  }
  
  try {
    const { data, error } = await supabase
      .from('program_requests')
      .select('*')
      .eq('coach_id', coachId)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      SupabaseErrorHandler.handle(error, {
        operation: 'fetch requests',
        showToast: false // Don't show toast for fetch operations
      });
      return localRequests;
    }
    
    const dbRequests = (data as ProgramRequest[]).map(syncRequestToLocal);
    const dbIds = new Set(dbRequests.map(r => r.id));
    const uniqueLocal = localRequests.filter(r => !dbIds.has(r.id));
    return [...dbRequests, ...uniqueLocal];
  } catch {
    return localRequests;
  }
};

export const fetchRequestsByClient = async (clientId: string): Promise<ProgramRequest[]> => {
  // Read from localStorage first
  let localRequests: ProgramRequest[] = [];
  try {
    const key = `program_requests_${clientId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      localRequests = JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }
  
  // If Supabase is not available, return localStorage data
  if (!isSupabaseEnabled || !supabase) {
    return localRequests;
  }
  
  try {
    const { data, error } = await supabase
      .from('program_requests')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      if (import.meta.env.DEV) {
        console.error('fetchRequestsByClient error', error);
      }
      return localRequests;
    }
    
    const dbRequests = (data as ProgramRequest[]).map(syncRequestToLocal);
    const dbIds = new Set(dbRequests.map(r => r.id));
    const uniqueLocal = localRequests.filter(r => !dbIds.has(r.id));
    return [...dbRequests, ...uniqueLocal];
  } catch {
    return localRequests;
  }
};

export const updateRequestStatus = async (
  requestId: string,
  status: ProgramRequest['status'],
  response?: string,
  request?: ProgramRequest
): Promise<ApiResponse<void>> => {
  const target = request || findLocalRequestById(requestId);
  if (target) {
    const updated: ProgramRequest = {
      ...target,
      status,
      coach_response: response ?? target.coach_response,
      updated_at: new Date().toISOString()
    };
    syncRequestToLocal(updated);
  }
  if (!isSupabaseEnabled || !supabase) {
    return createApiResponse<void>(undefined, null);
  }
  
  try {
    const payload: Partial<ProgramRequest> = {
      status,
      updated_at: new Date().toISOString()
    };
    if (response) {
      payload.coach_response = response;
    }
    
    const { data, error } = await supabase
      .from('program_requests')
      .update(payload)
      .eq('id', requestId)
      .select()
      .maybeSingle();
    
    if (error) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(error, 'updateRequestStatus')
      );
    }
    
    if (data) {
      syncRequestToLocal(data as ProgramRequest);
    }
    
    return createApiResponse<void>(undefined, null);
  } catch (err) {
    return createApiResponse<void>(
      null,
      handleSupabaseError(err, 'updateRequestStatus')
    );
  }
};

export const deleteProgramRequestLocally = (
  requestId: string,
  coachId?: string,
  clientId?: string
): void => {
  removeRequestFromLocal(requestId, coachId, clientId);
};

export const deleteProgramRequest = async (
  requestId: string,
  coachId?: string,
  clientId?: string
): Promise<ApiResponse<void>> => {
  // Delete from localStorage first
  deleteProgramRequestLocally(requestId, coachId, clientId);

  // Delete from Supabase if available
  if (isSupabaseEnabled && supabase) {
    try {
      const { error } = await supabase
        .from('program_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        return createApiResponse<void>(
          null,
          handleSupabaseError(error, 'deleteProgramRequest')
        );
      }
    } catch (err) {
      return createApiResponse<void>(
        null,
        handleSupabaseError(err, 'deleteProgramRequest')
      );
    }
  }

  return createApiResponse<void>(undefined, null);
};

