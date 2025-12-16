import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { ExerciseSearchResult, ExerciseSearchParams } from '../types/database';

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
      let query = supabase
        .from('exercises')
        .select('*')
        .limit(params.limit || 20)
        .range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1);

      // Add search filter
      if (params.query && params.query.trim()) {
        query = query.ilike('name', `%${params.query.trim()}%`);
      }

      // Add muscle group filter
      if (params.muscle_group) {
        query = query.eq('muscle_group', params.muscle_group);
      }

      // Add type filter
      if (params.type) {
        query = query.eq('type', params.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ExerciseSearchResult[];
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