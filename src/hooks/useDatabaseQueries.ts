import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Exercise, Food, ExerciseSearchParams, FoodSearchParams } from '../types/database';

/**
 * Hook for fetching exercises with caching
 * Uses React Query for efficient server state management
 */
export const useExercisesQuery = (searchParams?: ExerciseSearchParams) => {
  return useQuery({
    queryKey: ['exercises', searchParams],
    queryFn: async () => {
      if (!supabase) return [];

      // Use RPC function for search with full-text support
      const { data, error } = await supabase.rpc('search_exercises', {
        search_query: searchParams?.query || '',
        muscle_group_filter: searchParams?.muscle_group || null,
        type_filter: searchParams?.type || null,
        limit_count: searchParams?.limit || 100,
        offset_count: searchParams?.offset || 0,
      });

      if (error) throw error;
      return data as Exercise[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching foods with caching
 */
export const useFoodsQuery = (searchParams?: FoodSearchParams) => {
  return useQuery({
    queryKey: ['foods', searchParams],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase.rpc('search_foods', {
        search_query: searchParams?.query || '',
        limit_count: searchParams?.limit || 100,
        offsetcount: searchParams?.offset || 0,
      });

      if (error) throw error;
      return data as Food[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook for fetching all exercises of a specific type
 */
export const useExercisesByType = (type: 'resistance' | 'cardio' | 'corrective' | 'warmup' | 'cooldown') => {
  return useQuery({
    queryKey: ['exercises', 'by-type', type],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Exercise[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook for fetching exercises by muscle group
 */
export const useExercisesByMuscleGroup = (muscleGroup: string) => {
  return useQuery({
    queryKey: ['exercises', 'by-muscle', muscleGroup],
    queryFn: async () => {
      if (!supabase || !muscleGroup) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('muscle_group', muscleGroup)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Exercise[];
    },
    enabled: !!muscleGroup, // Only run query if muscleGroup is provided
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook for fetching all foods of a specific category
 */
export const useFoodsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['foods', 'by-category', category],
    queryFn: async () => {
      if (!supabase || !category) return [];

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Food[];
    },
    enabled: !!category,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};

/**
 * Hook for fetching food categories for filtering
 */
export const useFoodCategories = () => {
  return useQuery({
    queryKey: ['food-categories'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('foods')
        .select('category', { count: 'exact' })
        .order('category', { ascending: true });

      if (error) throw error;
      
      // Get unique categories
      const categories = Array.from(new Set(data?.map(item => item.category) || []));
      return categories as string[];
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

/**
 * Hook for fetching exercise muscle groups for filtering
 */
export const useExerciseMuscleGroups = () => {
  return useQuery({
    queryKey: ['exercise-muscle-groups'],
    queryFn: async () => {
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('exercises')
        .select('muscle_group', { count: 'exact' })
        .order('muscle_group', { ascending: true });

      if (error) throw error;
      
      // Get unique muscle groups
      const groups = Array.from(new Set(data?.map(item => item.muscle_group) || []));
      return groups as string[];
    },
    staleTime: 1 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
};
