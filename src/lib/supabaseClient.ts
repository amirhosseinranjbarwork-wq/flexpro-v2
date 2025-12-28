/**
 * DEPRECATED: Supabase client has been removed
 * This file exists only to prevent import errors during migration
 * All functionality has been migrated to local API (src/services/api.ts)
 */

// Stub exports to prevent import errors
export const supabase = null;
export const isSupabaseEnabled = false;

export function getSupabaseInitError(): string | null {
  return null;
}

export async function checkSupabaseHealth(): Promise<boolean> {
  return false;
}

