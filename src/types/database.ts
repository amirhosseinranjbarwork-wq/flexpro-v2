// ============================================
// Supabase Database Types - Auto-generated with scientific upgrades
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ========== Exercise Types ==========

export type ExerciseCategory =
  | 'bodybuilding'
  | 'cardio'
  | 'warmup'
  | 'cooldown'
  | 'corrective'

export type ExerciseType =
  | 'resistance'
  | 'cardio'
  | 'corrective'
  | 'warmup'
  | 'cooldown'

export type ExerciseMechanics =
  | 'compound'
  | 'isolation'

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'bands'
  | 'foam_roller'
  | 'trx'
  | 'kettlebell'
  | 'medicine_ball'
  | 'battle_ropes'
  | 'treadmill'
  | 'rower'
  | 'elliptical'
  | 'bike'

export type DifficultyLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'

export interface Exercise {
  id: string
  name: string
  muscle_group: string
  sub_muscle_group?: string
  equipment?: string
  type: ExerciseType
  mechanics?: ExerciseMechanics
  description?: string
  instructions?: string
  created_at: string
  updated_at: string

  // Scientific upgrades
  category: ExerciseCategory
  primary_muscle?: string
  secondary_muscles?: string[]
  difficulty_level: DifficultyLevel
  tempo?: string // e.g., "3-0-1-0"
  default_rpe?: number // 1-10
  default_rir?: number // 0-5
  rest_interval_seconds: number
  unilateral: boolean
  equipment_standardized: EquipmentType
}

// ========== Food Types ==========

export interface Food {
  id: string
  name: string
  category: string
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
  base_amount: number
  fiber?: number
  sugar?: number
  sodium?: number
  created_at: string
  updated_at: string
}

// ========== Search Types ==========

export interface ExerciseSearchParams {
  query?: string
  muscle_filter?: string
  type_filter?: ExerciseType
  category_filter?: ExerciseCategory
  equipment_filter?: EquipmentType
  difficulty_filter?: DifficultyLevel
  limit?: number
  offset?: number
}

export interface ExerciseSearchResult {
  id: string
  name: string
  muscle_group: string
  sub_muscle_group?: string
  equipment?: string
  type: ExerciseType
  category: ExerciseCategory
  primary_muscle?: string
  equipment_standardized: EquipmentType
  difficulty_level: DifficultyLevel
  rank?: number
}

export interface FoodSearchParams {
  query?: string
  limit?: number
  offset?: number
}

export interface FoodSearchResult {
  id: string
  name: string
  category: string
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
  rank?: number
}

// ========== Pagination Types ==========

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
  nextOffset?: number
}

// ========== Workout Plan Types ==========

export interface WorkoutPlanItem {
  id: string
  workout_plan_id: string
  exercise_id: string
  exercise?: Exercise
  sets: number
  reps?: number
  weight?: number
  rpe?: number // Rate of Perceived Exertion (1-10)
  rir?: number // Reps In Reserve (0-5)
  tempo?: string // e.g., "3-0-1-0"
  rest_seconds: number
  notes?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface WorkoutPlan {
  id: string
  coach_id: string
  client_id: string
  name: string
  description?: string
  days_per_week: number
  duration_weeks?: number
  goal: string
  level: DifficultyLevel
  items: WorkoutPlanItem[]
  created_at: string
  updated_at: string
}

// ========== Profile Types ==========

export interface Profile {
  id: string
  coach_id?: string
  full_name?: string
  email?: string
  phone?: string
  profile_data?: Json
  created_at: string
  updated_at: string
}

// ========== Tables ==========

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: Exercise
        Insert: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Exercise, 'id' | 'created_at' | 'updated_at'>>
      }
      foods: {
        Row: Food
        Insert: Omit<Food, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Food, 'id' | 'created_at' | 'updated_at'>>
      }
      workout_plans: {
        Row: WorkoutPlan
        Insert: Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkoutPlan, 'id' | 'created_at' | 'updated_at'>>
      }
      workout_plan_items: {
        Row: WorkoutPlanItem
        Insert: Omit<WorkoutPlanItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WorkoutPlanItem, 'id' | 'created_at' | 'updated_at'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_exercises: {
        Args: ExerciseSearchParams
        Returns: ExerciseSearchResult[]
      }
      search_foods: {
        Args: FoodSearchParams
        Returns: FoodSearchResult[]
      }
    }
    Enums: {
      exercise_category: ExerciseCategory
      exercise_type: ExerciseType
      equipment_type: EquipmentType
      difficulty_level: DifficultyLevel
    }
  }
}
