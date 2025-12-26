

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient<Database> | null = null;
let initError: string | null = null;

if (supabaseUrl && supabaseAnonKey) {
	try {
		// بررسی اعتبار URL
		if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
			initError = 'آدرس Supabase نامعتبر است. URL باید با http:// یا https:// شروع شود.';
			console.error('🚨', initError);
		} else if (supabaseAnonKey.length < 20) {
			initError = 'کلید Supabase نامعتبر است. طول کلید بسیار کوتاه است.';
			console.error('🚨', initError);
		} else {
			supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
				auth: {
					autoRefreshToken: true,
					persistSession: true,
					detectSessionInUrl: true
				},
				db: { schema: 'public' }
			});
			
			if (import.meta.env.DEV) {
				console.log('✅ Supabase client initialized successfully');
			}
		}
	} catch (error) {
		initError = error instanceof Error ? error.message : 'خطا در راه‌اندازی Supabase';
		console.error('🚨 Supabase init failed:', error);
	}
} else {
	const missingVars: string[] = [];
	if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
	if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
	initError = `متغیرهای محیطی زیر یافت نشد: ${missingVars.join(', ')}. لطفا فایل .env را بررسی کنید.`;
	console.error('🚨', initError);
}

export const isSupabaseEnabled = Boolean(supabase);
export { supabase };

// تابع برای دریافت خطای راه‌اندازی
export const getSupabaseInitError = (): string | null => initError;

// Stub for checkSupabaseHealth to prevent import errors
export const checkSupabaseHealth = async () => {
	if (!supabase) return false;
	
	try {
		// تست ساده برای بررسی اتصال
		const { error } = await supabase.from('profiles').select('id').limit(1);
		return !error || error.code !== 'PGRST301'; // PGRST301 = connection error
	} catch {
		return false;
	}
};

