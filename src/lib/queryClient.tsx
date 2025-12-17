import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Configure React Query with reasonable defaults
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh before background refetch
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // How long unused data is kept in cache before garbage collection
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly called cacheTime)
      
      // Retry failed requests once
      retry: 1,
      
      // Retry after exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus for now (can be enabled per query)
      refetchOnWindowFocus: false,
      
      // Refetch on mount only if data is stale
      refetchOnMount: 'stale',
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * React Query Provider Wrapper
 * Wraps application with QueryClientProvider for centralized server state management
 */
// #region agent log - hypothesis B: ReactQueryProvider initialized
fetch('http://127.0.0.1:7243/ingest/ec06820d-8d44-4cc6-8efe-2fb418aa5d14',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'queryClient.tsx:44',message:'ReactQueryProvider initialized',data:{childrenCount:React.Children.count(children),timestamp:new Date().toISOString()},sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
// #endregion

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export { queryClient };
export { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
export type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
