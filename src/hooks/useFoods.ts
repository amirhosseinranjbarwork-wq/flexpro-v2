/**
 * useFoods Hook - Connected to Local API
 * Fetches foods from SQLite backend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodsApi, Food, ApiError } from '../services/api';
import toast from 'react-hot-toast';

export interface UseFoodsFilters {
  category?: string;
  search?: string;
}

export function useFoods(filters?: UseFoodsFilters) {
  const queryClient = useQueryClient();

  // Fetch all foods
  const {
    data: foods = [],
    isLoading,
    error,
    refetch
  } = useQuery<Food[], ApiError>({
    queryKey: ['foods', filters],
    queryFn: async () => {
      try {
        return await foodsApi.getAll(filters);
      } catch (err) {
        const apiError = err as ApiError;
        toast.error(apiError.detail || 'Failed to load foods');
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch single food
  const useFoodById = (id: string) => {
    return useQuery<Food, ApiError>({
      queryKey: ['food', id],
      queryFn: async () => {
        try {
          return await foodsApi.getById(id);
        } catch (err) {
          const apiError = err as ApiError;
          toast.error(apiError.detail || 'Failed to load food');
          throw err;
        }
      },
      enabled: !!id,
    });
  };

  // Create food
  const createMutation = useMutation({
    mutationFn: (food: Partial<Food>) => foodsApi.create(food),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to create food');
    },
  });

  // Update food
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Food> }) =>
      foodsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to update food');
    },
  });

  // Delete food
  const deleteMutation = useMutation({
    mutationFn: (id: string) => foodsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      toast.success('Food deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to delete food');
    },
  });

  return {
    foods,
    isLoading,
    error,
    refetch,
    useFoodById,
    createFood: createMutation.mutate,
    updateFood: updateMutation.mutate,
    deleteFood: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useFoods;
