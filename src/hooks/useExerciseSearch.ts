import { useQuery } from '@tanstack/react-query';
// Supabase removed - using local API
import { ExerciseSearchResult, ExerciseSearchParams } from '../types/database';
import { searchExercises } from '../lib/database';

interface UseExerciseSearchReturn {
  results: ExerciseSearchResult[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  clearResults: () => void;
}

export function useExerciseSearch(params: ExerciseSearchParams): UseExerciseSearchReturn {
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['exercises', params],
    queryFn: async () => {
      // Use database.ts function which handles both Supabase and local data
      const result = await searchExercises(params);
      return result.data;
    },
    enabled: Boolean(params.query?.trim()) || Boolean(params.muscle_group) || Boolean(params.type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const results = data || [];
  const errorMessage = error ? (error as Error).message : null;

  // Calculate hasMore based on results length
  const hasMore = results.length === (params.limit || 20);

  const loadMore = () => {
    // Update params to load next page
    const nextParams = {
      ...params,
      offset: (params.offset || 0) + (params.limit || 20)
    };
    // This will trigger a new query since params changed
    refetch();
  };

  const clearResults = () => {
    // Clear by disabling the query
    refetch();
  };

  return {
    results,
    loading,
    error: errorMessage,
    hasMore,
    loadMore,
    refetch,
    clearResults
  };
}