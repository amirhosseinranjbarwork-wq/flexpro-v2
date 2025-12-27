/**
 * useSupplements Hook - Connected to Local API
 * Fetches supplements from SQLite backend
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplementsApi, Supplement, ApiError } from '../services/api';
import toast from 'react-hot-toast';

export interface UseSupplementsFilters {
  category?: string;
  evidence_level?: string;
  search?: string;
}

export function useSupplements(filters?: UseSupplementsFilters) {
  const queryClient = useQueryClient();

  // Fetch all supplements
  const {
    data: supplements = [],
    isLoading,
    error,
    refetch
  } = useQuery<Supplement[], ApiError>({
    queryKey: ['supplements', filters],
    queryFn: async () => {
      try {
        return await supplementsApi.getAll(filters);
      } catch (err) {
        const apiError = err as ApiError;
        toast.error(apiError.detail || 'Failed to load supplements');
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch single supplement
  const useSupplementById = (id: string) => {
    return useQuery<Supplement, ApiError>({
      queryKey: ['supplement', id],
      queryFn: async () => {
        try {
          return await supplementsApi.getById(id);
        } catch (err) {
          const apiError = err as ApiError;
          toast.error(apiError.detail || 'Failed to load supplement');
          throw err;
        }
      },
      enabled: !!id,
    });
  };

  // Create supplement
  const createMutation = useMutation({
    mutationFn: (supplement: Partial<Supplement>) => supplementsApi.create(supplement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
      toast.success('Supplement created successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to create supplement');
    },
  });

  // Update supplement
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplement> }) =>
      supplementsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
      toast.success('Supplement updated successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to update supplement');
    },
  });

  // Delete supplement
  const deleteMutation = useMutation({
    mutationFn: (id: string) => supplementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
      toast.success('Supplement deleted successfully');
    },
    onError: (error: ApiError) => {
      toast.error(error.detail || 'Failed to delete supplement');
    },
  });

  return {
    supplements,
    isLoading,
    error,
    refetch,
    useSupplementById,
    createSupplement: createMutation.mutate,
    updateSupplement: updateMutation.mutate,
    deleteSupplement: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export default useSupplements;
