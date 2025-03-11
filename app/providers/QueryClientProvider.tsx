"use client";
import { queryClient } from "@/lib/getQueryClient";
import { experimental_createPersister } from '@tanstack/query-persist-client-core'
// import { experimental_createPersister } from "@tanstack/react-persist-client-core";
import { HydrationBoundary, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useEffect, useState } from "react";

export default function QueryClientProvider({
  children,
  dehydratedState, // receive the dehydrated state, if available
}: {
  children: ReactNode;
  dehydratedState?: unknown;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (async () => {
        try {
          const { createStore, del, get, set } = await import("idb-keyval");
          const store = createStore("tanstack-query", "persisted-queries");

          console.log("Initializing IndexedDB store...");

          const storage = {
            getItem: async (key: string) => {
              const value = await get(key, store);
              console.log("Retrieved from IndexedDB:", { key, value });
              return value ?? null;
            },
            setItem: async (key: string, value: unknown) => {
              console.log("Storing in IndexedDB:", { key, value });
              await set(key, value, store);
            },
            removeItem: async (key: string) => {
              console.log("Removing from IndexedDB:", key);
              await del(key, store);
            },
          };

          const persister = experimental_createPersister({
            storage,
            maxAge: 1000 * 60 * 60 * 24,
            serialize: (data) => JSON.stringify(data),
            deserialize: (data) => JSON.parse(data as string),
            buster: "v1",
          });

          queryClient.setDefaultOptions({
            queries: {
              ...queryClient.getDefaultOptions().queries,
              // @ts-ignore
              persister,
            },
          });

          console.log("IndexedDB persister initialized successfully");
        } catch (error) {
          console.error("Error initializing IndexedDB persister:", error);
        }
        setMounted(true);
      })();
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <TanstackQueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState ?? {}}>
        {children}
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  );
}
