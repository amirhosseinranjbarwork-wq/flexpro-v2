/**
 * Database operations for FlexPro v2
 * Centralized data access layer
 * Supports both Supabase and Local Mock Data
 */

// Supabase removed - using local API
import {
  Food,
  Exercise,
  FoodSearchResult,
  ExerciseSearchResult,
  FoodSearchParams,
  ExerciseSearchParams,
  PaginatedResponse
} from '../types/database';
import { exercises as localExercises } from '../data/exercises';
import { foods as localFoods } from '../data/foods';

// ========== Helper Functions for Local Data ==========

/**
 * Convert local exercise format to database format
 */
function convertLocalExerciseToDB(exercise: typeof localExercises[0]): Exercise {
  return {
    id: exercise.id,
    name: exercise.name,
    muscle_group: exercise.muscleGroup,
    sub_muscle_group: exercise.subMuscleGroup,
    equipment: exercise.equipment,
    type: exercise.type,
    mechanics: exercise.mechanics,
    description: exercise.description,
    instructions: exercise.instructions.join('\n'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: exercise.type === 'cardio' ? 'cardio' : 
              exercise.type === 'warmup' ? 'warmup' :
              exercise.type === 'cooldown' ? 'cooldown' :
              exercise.type === 'corrective' ? 'corrective' : 'bodybuilding',
    primary_muscle: exercise.primaryMuscles?.[0],
    secondary_muscles: exercise.secondaryMuscles,
    difficulty_level: exercise.difficulty,
    rest_interval_seconds: exercise.restTime || 60,
    unilateral: false,
    equipment_standardized: exercise.equipment.toLowerCase().includes('barbell') ? 'barbell' :
                           exercise.equipment.toLowerCase().includes('dumbbell') ? 'dumbbell' :
                           exercise.equipment.toLowerCase().includes('cable') ? 'cable' :
                           exercise.equipment.toLowerCase().includes('machine') ? 'machine' :
                           exercise.equipment.toLowerCase().includes('bodyweight') ? 'bodyweight' : 'barbell'
  } as Exercise;
}

/**
 * Convert local food format to database format
 */
function convertLocalFoodToDB(food: typeof localFoods[0]): Food {
  return {
    id: food.id,
    name: food.name,
    category: food.category,
    unit: food.unit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    base_amount: food.baseAmount,
    fiber: food.fiber,
    sugar: food.sugar,
    sodium: food.sodium,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Food;
}

/**
 * Search local exercises
 */
function searchLocalExercises(params: ExerciseSearchParams): ExerciseSearchResult[] {
  let results = localExercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    muscle_group: ex.muscleGroup,
    sub_muscle_group: ex.subMuscleGroup,
    equipment: ex.equipment,
    type: ex.type,
    category: ex.type === 'cardio' ? 'cardio' : 
              ex.type === 'warmup' ? 'warmup' :
              ex.type === 'cooldown' ? 'cooldown' :
              ex.type === 'corrective' ? 'corrective' : 'bodybuilding' as const,
    primary_muscle: ex.primaryMuscles?.[0],
    equipment_standardized: (ex.equipment.toLowerCase().includes('barbell') ? 'barbell' :
                            ex.equipment.toLowerCase().includes('dumbbell') ? 'dumbbell' :
                            ex.equipment.toLowerCase().includes('cable') ? 'cable' :
                            ex.equipment.toLowerCase().includes('machine') ? 'machine' :
                            ex.equipment.toLowerCase().includes('bodyweight') ? 'bodyweight' : 'barbell') as any,
    difficulty_level: ex.difficulty,
  }));

  // Apply filters
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(ex => 
      ex.name.toLowerCase().includes(query) ||
      ex.muscle_group.toLowerCase().includes(query)
    );
  }

  if (params.muscle_filter) {
    results = results.filter(ex => ex.muscle_group === params.muscle_filter);
  }

  if (params.type_filter) {
    results = results.filter(ex => ex.type === params.type_filter);
  }

  return results;
}

/**
 * Search local foods
 */
function searchLocalFoods(params: FoodSearchParams): FoodSearchResult[] {
  let results = localFoods.map(food => ({
    id: food.id,
    name: food.name,
    category: food.category,
    unit: food.unit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  }));

  // Apply query filter
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(food => 
      food.name.toLowerCase().includes(query) ||
      food.category.toLowerCase().includes(query)
    );
  }

  return results;
}

// ========== Food Operations ==========

export async function searchFoods(params: FoodSearchParams): Promise<PaginatedResponse<FoodSearchResult>> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    const allResults = searchLocalFoods(params);
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = allResults.slice(offset, offset + limit);
    
    return {
      data: paginatedResults,
      count: paginatedResults.length,
      hasMore: allResults.length > offset + limit,
      nextOffset: offset + paginatedResults.length
    };
  }

  try {
    const { data, error } = await supabase.rpc('search_foods', {
      search_query: params.query,
      limit_count: params.limit || 20,
      offset_count: params.offset || 0
    });

    if (error) throw error;

    const results = data as FoodSearchResult[];
    return {
      data: results,
      count: results.length,
      hasMore: results.length === (params.limit || 20),
      nextOffset: params.offset ? params.offset + results.length : results.length
    };
  } catch (error) {
    console.warn('Supabase search failed, using local data:', error);
    const allResults = searchLocalFoods(params);
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = allResults.slice(offset, offset + limit);
    
    return {
      data: paginatedResults,
      count: paginatedResults.length,
      hasMore: allResults.length > offset + limit,
      nextOffset: offset + paginatedResults.length
    };
  }
}

export async function getAllFoods(): Promise<Food[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    return localFoods.map(convertLocalFoodToDB);
  }

  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Food[];
  } catch (error) {
    console.warn('Supabase getAllFoods failed, using local data:', error);
    return localFoods.map(convertLocalFoodToDB);
  }
}

export async function getFoodsByCategory(category: string): Promise<Food[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    return localFoods
      .filter(food => food.category === category)
      .map(convertLocalFoodToDB);
  }

  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Food[];
  } catch (error) {
    console.warn('Supabase getFoodsByCategory failed, using local data:', error);
    return localFoods
      .filter(food => food.category === category)
      .map(convertLocalFoodToDB);
  }
}

// ========== Exercise Operations ==========

export async function searchExercises(params: ExerciseSearchParams): Promise<PaginatedResponse<ExerciseSearchResult>> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    const allResults = searchLocalExercises(params);
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = allResults.slice(offset, offset + limit);
    
    return {
      data: paginatedResults,
      count: paginatedResults.length,
      hasMore: allResults.length > offset + limit,
      nextOffset: offset + paginatedResults.length
    };
  }

  try {
    const { data, error } = await supabase.rpc('search_exercises', {
      search_query: params.query,
      muscle_group_filter: params.muscle_group || null,
      type_filter: params.type || null,
      limit_count: params.limit || 20,
      offset_count: params.offset || 0
    });

    if (error) throw error;

    const results = data as ExerciseSearchResult[];
    return {
      data: results,
      count: results.length,
      hasMore: results.length === (params.limit || 20),
      nextOffset: params.offset ? params.offset + results.length : results.length
    };
  } catch (error) {
    console.warn('Supabase search failed, using local data:', error);
    const allResults = searchLocalExercises(params);
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    const paginatedResults = allResults.slice(offset, offset + limit);
    
    return {
      data: paginatedResults,
      count: paginatedResults.length,
      hasMore: allResults.length > offset + limit,
      nextOffset: offset + paginatedResults.length
    };
  }
}

export async function getAllExercises(): Promise<Exercise[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    return localExercises.map(convertLocalExerciseToDB);
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('muscle_group', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Exercise[];
  } catch (error) {
    console.warn('Supabase getAllExercises failed, using local data:', error);
    return localExercises.map(convertLocalExerciseToDB);
  }
}

export async function getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    return localExercises
      .filter(ex => ex.muscleGroup === muscleGroup)
      .map(convertLocalExerciseToDB);
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('muscle_group', muscleGroup)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Exercise[];
  } catch (error) {
    console.warn('Supabase getExercisesByMuscleGroup failed, using local data:', error);
    return localExercises
      .filter(ex => ex.muscleGroup === muscleGroup)
      .map(convertLocalExerciseToDB);
  }
}

export async function getExercisesByType(type: string): Promise<Exercise[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    return localExercises
      .filter(ex => ex.type === type)
      .map(convertLocalExerciseToDB);
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('type', type)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Exercise[];
  } catch (error) {
    console.warn('Supabase getExercisesByType failed, using local data:', error);
    return localExercises
      .filter(ex => ex.type === type)
      .map(convertLocalExerciseToDB);
  }
}

// ========== Utility Functions ==========

export async function getFoodCategories(): Promise<string[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    const categories = [...new Set(localFoods.map(food => food.category))];
    return categories.sort();
  }

  try {
    const { data, error } = await supabase
      .from('foods')
      .select('category')
      .order('category');

    if (error) throw error;

    // Get unique categories
    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  } catch (error) {
    console.warn('Supabase getFoodCategories failed, using local data:', error);
    const categories = [...new Set(localFoods.map(food => food.category))];
    return categories.sort();
  }
}

export async function getMuscleGroups(): Promise<string[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    const groups = [...new Set(localExercises.map(ex => ex.muscleGroup))];
    return groups.sort();
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('muscle_group')
      .order('muscle_group');

    if (error) throw error;

    // Get unique muscle groups
    const groups = [...new Set(data.map(item => item.muscle_group))];
    return groups;
  } catch (error) {
    console.warn('Supabase getMuscleGroups failed, using local data:', error);
    const groups = [...new Set(localExercises.map(ex => ex.muscleGroup))];
    return groups.sort();
  }
}

export async function getExerciseTypes(): Promise<string[]> {
  // Use local data if Supabase is not enabled
  if (!isSupabaseEnabled || !supabase) {
    const types = [...new Set(localExercises.map(ex => ex.type))];
    return types.sort();
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('type')
      .order('type');

    if (error) throw error;

    // Get unique types
    const types = [...new Set(data.map(item => item.type))];
    return types;
  } catch (error) {
    console.warn('Supabase getExerciseTypes failed, using local data:', error);
    const types = [...new Set(localExercises.map(ex => ex.type))];
    return types.sort();
  }
}