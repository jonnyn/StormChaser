import { QueryClient } from '@tanstack/react-query';

import { isAppError } from '@/shared/lib/errors';

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isAppError(error) && (error.code === 'permission_denied' || error.code === 'not_found')) {
    return false;
  }
  return failureCount < 2;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000,
        retry: shouldRetry,
      },
    },
  });
}
