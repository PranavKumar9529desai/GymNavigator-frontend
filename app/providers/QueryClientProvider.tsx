'use client';

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            // Add other default options as needed
            refetchOnWindowFocus: false, // Disable refetch on window focus
            retry: 1, // Only retry failed requests once
          },
        },
      })
  );

  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
}
