import { QueryClient } from '@tanstack/react-query'

import { ApiError } from '@/shared/api'

const SECOND = 1_000
const MINUTE = 60 * SECOND

function shouldRetryQuery(
  failureCount: number,
  error: Error,
): boolean {
  if (failureCount >= 2) {
    return false
  }

  if (error instanceof ApiError) {
    /*
     * Authentication errors are handled by the API auth hooks.
     * React Query must not create an additional authentication retry loop.
     */
    if (
      error.isUnauthorized ||
      error.isForbidden ||
      error.isValidationError
    ) {
      return false
    }

    /*
     * Retry temporary network failures.
     */
    if (error.isNetworkError) {
      return true
    }

    /*
     * Retry temporary server-side failures.
     */
    if (
      error.status === 408 ||
      error.status >= 500
    ) {
      return true
    }

    return false
  }

  return failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
       * Data stays fresh for 30 seconds unless a feature
       * overrides this value.
       */
      staleTime: 30 * SECOND,

      /*
       * Keep inactive query data in memory for 10 minutes.
       */
      gcTime: 10 * MINUTE,

      retry: shouldRetryQuery,

      /*
       * Enterprise applications should not unexpectedly
       * refetch whenever the user switches browser tabs.
       */
      refetchOnWindowFocus: false,

      /*
       * Refresh stale data after the connection comes back.
       */
      refetchOnReconnect: true,
    },

    mutations: {
      /*
       * POST / PUT / PATCH / DELETE should never be retried
       * globally because a mutation may not be idempotent.
       */
      retry: false,
    },
  },
})
