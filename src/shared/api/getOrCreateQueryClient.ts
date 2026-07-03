import { QueryClient } from "@tanstack/react-query";

/**
 * Per-request QueryClient cache for Server Components.
 *
 * **Why module-level memoization?**
 * Each `await` in an RSC triggers a microtask hop. If a page imports
 * `getOrCreateQueryClient` more than once (transitively or via React
 * Server Components' own re-rendering boundaries), returning a fresh
 * client each time would produce multiple empty caches — one would
 * get prefetched, the others would dehydrate nothing, and the client
 * would see a hydration mismatch.
 *
 * By caching the client in a module-level variable for the lifetime
 * of a single request, repeated calls during one render get the
 * same instance. When the request finishes the module is garbage
 * collected along with its cache, so no cross-request leakage is
 * possible.
 *
 * **Client side**: returns the singleton from `queryClient.ts` so the
 * prefetched data dehydrated on the server seamlessly merges with
 * the client cache.
 *
 * @see https://tanstack.com/query/v5/docs/react/guides/advanced-ssr#prefetching-and-dehydrating-data
 */
let serverQueryClient: QueryClient | undefined;

function createServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Server prefetches should never retry — fail fast so the
        // page can decide whether to redirect / show a fallback.
        retry: false,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        networkMode: "offlineFirst",
      },
    },
  });
}

export function getOrCreateQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: cache for the duration of the request.
    if (!serverQueryClient) {
      serverQueryClient = createServerQueryClient();
    }
    return serverQueryClient;
  }

  // Client: lazy import to avoid bundling server-only deps.
  // The singleton is created at module-load on the client.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { queryClient } = require("./queryClient") as typeof import("./queryClient");
  return queryClient;
}
