import { QueryClient } from "@tanstack/react-query";

/** Extracted as a factory so SSR can set per-request defaults. */
function getDefaultOptions() {
  return {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
      networkMode: "offlineFirst" as const,
    },
    mutations: {
      retry: 0,
      networkMode: "offlineFirst" as const,
    },
  } as const;
}

/** Returns a new QueryClient per call. Use in tests for isolation. */
export function createQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: getDefaultOptions() });
}

/** Singleton for app runtime. SSR-safe (QueryClient doesn't touch browser APIs). */
export const queryClient = createQueryClient();
