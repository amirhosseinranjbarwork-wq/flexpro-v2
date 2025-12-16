import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { FoodSearchResult, FoodSearchParams } from '../types/database';

interface UseFoodSearchReturn {
  results: FoodSearchResult[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  clearResults: () => void;
}

export function useFoodSearch(params: FoodSearchParams): UseFoodSearchReturn {
  const {
    data,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['foods', params],
    queryFn: async () => {
      let query = supabase
        .from('foods')
        .select('*')
        .limit(params.limit || 20)
        .range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1);

      // Add search filter
      if (params.query && params.query.trim()) {
        query = query.ilike('name', `%${params.query.trim()}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as FoodSearchResult[];
    },
    enabled: Boolean(params.query?.trim()),
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