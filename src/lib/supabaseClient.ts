import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate environment variables
if (import.meta.env.DEV) {
  if (!supabaseUrl) {
    console.warn('⚠️ VITE_SUPABASE_URL is not set in environment variables');
  }
  if (!supabaseAnonKey) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY is not set in environment variables');
  }
}

let supabase: SupabaseClient<Database> | null = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      },
      db: {
        schema: 'public'
      }
    });

    // Test connection on initialization
    if (import.meta.env.DEV) {
      supabase.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error('❌ Supabase connection failed:', error.message);
        } else {
          console.log('✅ Supabase connection established');
        }
      });
    }
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    supabase = null;
  }
}

export const isSupabaseEnabled = Boolean(supabase);

// Health check function
export const checkSupabaseHealth = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

export { supabase };
export type { Database } from '../types/database';

