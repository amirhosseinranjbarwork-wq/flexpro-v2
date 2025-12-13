import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FoodSearchResult, FoodSearchParams } from '../types/database';
import { useDebounce } from './useDebounce';

interface UseFoodSearchReturn {
  search: (params: FoodSearchParams) => Promise<void>;
  results: FoodSearchResult[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  clearResults: () => void;
}

export function useFoodSearch(): UseFoodSearchReturn {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced search function
  const debouncedSearch = useDebounce(async (params: FoodSearchParams) => {
    if (!params.query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('search_foods', {
        search_query: params.query,
        limit_count: params.limit || 20,
        offset_count: params.offset || 0
      });

      if (rpcError) throw rpcError;

      const searchResults = data as FoodSearchResult[];
      const totalResults = searchResults.length;

      if (params.offset === 0) {
        setResults(searchResults);
      } else {
        setResults(prev => [...prev, ...searchResults]);
      }

      setHasMore(totalResults === (params.limit || 20));
      setCurrentOffset((params.offset || 0) + (params.limit || 20));
      setCurrentQuery(params.query);

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'خطا در جستجو');
        console.error('Food search error:', err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, 300);

  const search = useCallback(async (params: FoodSearchParams) => {
    await debouncedSearch(params);
  }, [debouncedSearch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !currentQuery) return;

    await search({
      query: currentQuery,
      limit: 20,
      offset: currentOffset
    });
  }, [hasMore, loading, currentQuery, currentOffset, search]);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasMore(false);
    setCurrentOffset(0);
    setCurrentQuery('');
    setError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    search,
    results,
    loading,
    error,
    hasMore,
    loadMore,
    clearResults
  };
}