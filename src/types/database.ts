// ============================================
// Database Types for FlexPro v2
// ============================================

// ========== Food Types ==========
export interface Food {
  id: string;
  name: string;
  category: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  base_amount: number;
  created_at: string;
  updated_at: string;
}

export interface FoodSearchResult extends Food {
  rank: number;
}

// ========== Exercise Types ==========
export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sub_muscle_target?: string;
  type: 'resistance' | 'cardio' | 'corrective' | 'warmup' | 'cooldown';
  mechanics?: 'compound' | 'isolation';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExerciseSearchResult extends Exercise {
  rank: number;
}

// ========== Search Parameters ==========
export interface FoodSearchParams {
  query: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface ExerciseSearchParams {
  query: string;
  muscle_group?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

// ========== Sync Types ==========
export interface SyncMetadata {
  id: string;
  user_id: string;
  table_name: string;
  record_id: string;
  last_synced: string;
  version: number;
}

export interface LocalChange {
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  synced?: boolean;
}

// ========== Cache Types ==========
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface SearchCache {
  foods: CacheEntry<FoodSearchResult[]>;
  exercises: CacheEntry<ExerciseSearchResult[]>;
}

// ========== API Response Types ==========
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface SearchResponse<T extends FoodSearchResult | ExerciseSearchResult> extends PaginatedResponse<T> {
  query: string;
  totalResults: number;
}