"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({
  children,
}: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * Data remains fresh for 30 seconds.
             * Prevents excessive API requests.
             */
            staleTime: 30 * 1000,

            /**
             * Cache unused queries for 5 minutes.
             */
            gcTime: 5 * 60 * 1000,

            /**
             * Retry once on failure.
             */
            retry: 1,

            /**
             * Don't refetch when user switches tabs.
             */
            refetchOnWindowFocus: false,

            /**
             * Refetch when connection returns.
             */
            refetchOnReconnect: true,

            /**
             * Avoid unnecessary refetches on mount.
             */
            refetchOnMount: false,
          },

          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}