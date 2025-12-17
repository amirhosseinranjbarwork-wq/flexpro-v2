

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
	try {
		supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: true
			},
			db: { schema: 'public' }
		});
	} catch (error) {
		console.error('Supabase init failed:', error);
	}
} else {
	console.error('🚨 Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file');
}

export const isSupabaseEnabled = Boolean(supabase);
export { supabase };

// Stub for checkSupabaseHealth to prevent import errors
export const checkSupabaseHealth = async () => {
	// You can implement a real health check if needed
	return Boolean(supabase);
};

