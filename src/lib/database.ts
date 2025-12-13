/**
 * Database operations for FlexPro v2
 * Centralized data access layer
 */

import { supabase } from './supabaseClient';
import {
  Food,
  Exercise,
  FoodSearchResult,
  ExerciseSearchResult,
  FoodSearchParams,
  ExerciseSearchParams,
  PaginatedResponse
} from '../types/database';

// ========== Food Operations ==========

export async function searchFoods(params: FoodSearchParams): Promise<PaginatedResponse<FoodSearchResult>> {
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
}

export async function getAllFoods(): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Food[];
}

export async function getFoodsByCategory(category: string): Promise<Food[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('category', category)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Food[];
}

// ========== Exercise Operations ==========

export async function searchExercises(params: ExerciseSearchParams): Promise<PaginatedResponse<ExerciseSearchResult>> {
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
}

export async function getAllExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Exercise[];
}

export async function getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('muscle_group', muscleGroup)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Exercise[];
}

export async function getExercisesByType(type: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('type', type)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Exercise[];
}

// ========== Utility Functions ==========

export async function getFoodCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('foods')
    .select('category')
    .order('category');

  if (error) throw error;

  // Get unique categories
  const categories = [...new Set(data.map(item => item.category))];
  return categories;
}

export async function getMuscleGroups(): Promise<string[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('muscle_group')
    .order('muscle_group');

  if (error) throw error;

  // Get unique muscle groups
  const groups = [...new Set(data.map(item => item.muscle_group))];
  return groups;
}

export async function getExerciseTypes(): Promise<string[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('type')
    .order('type');

  if (error) throw error;

  // Get unique types
  const types = [...new Set(data.map(item => item.type))];
  return types;
}