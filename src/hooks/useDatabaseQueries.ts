import { useQuery } from '@tanstack/react-query';
import { searchExercises, searchFoods, getAllExercises, getAllFoods, getExercisesByType, getExercisesByMuscleGroup, getFoodsByCategory, getFoodCategories, getMuscleGroups } from '../lib/database';
import type { Exercise, Food, ExerciseSearchParams, FoodSearchParams } from '../types/database';

/**
 * Hook for fetching exercises with caching
 * Uses React Query for efficient server state management
 */
export const useExercisesQuery = (searchParams?: ExerciseSearchParams) => {
  return useQuery({
    queryKey: ['exercises', searchParams],
    queryFn: async () => {
      const result = await searchExercises(searchParams || {});
      return result.data as Exercise[];
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
      const result = await searchFoods(searchParams || {});
      return result.data as Food[];
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
      return await getExercisesByType(type);
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
      if (!muscleGroup) return [];
      return await getExercisesByMuscleGroup(muscleGroup);
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
      if (!category) return [];
      return await getFoodsByCategory(category);
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
      return await getFoodCategories();
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
      return await getMuscleGroups();
    },
    staleTime: 1 * 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
};
