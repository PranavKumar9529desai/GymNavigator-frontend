# Next.js Client Dashboard PWA + TanStack Query Optimization

## 1. PWA Configuration

### Next.js PWA Setup
```typescript:admin/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.gymnavigator\.com\/.*\/client\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'client-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'client-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    }
  ]
});

module.exports = withPWA({
  // your existing next config
});
```

### Web Manifest
```json:public/manifest.json
{
  "name": "GymNavigator Client",
  "short_name": "GymNav",
  "description": "Your personal gym companion",
  "start_url": "/dashboard/client",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 2. TanStack Query Configuration

### Client Query Provider
```typescript:admin/app/dashboard/client/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from '@tanstack/query-persist-client-core';

export default function ClientQueryProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        retry: 2,
        refetchOnWindowFocus: false,
        networkMode: 'offlineFirst'
      }
    }
  }));

  const persister = createIDBPersister('client-query-cache');

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        buster: process.env.NEXT_PUBLIC_BUILD_ID
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
```

### Layout Integration
```typescript:admin/app/dashboard/client/layout.tsx
import ClientQueryProvider from './providers/QueryProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientQueryProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </ClientQueryProvider>
  );
}
```

## 3. Optimized Page Examples

### Dashboard Page with Prefetching
```typescript:admin/app/dashboard/client/home/dashboard/page.tsx
import { Suspense } from 'react';
import { dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import DashboardContent from './DashboardContent';
import { prefetchDashboardData } from './prefetch';

export default async function DashboardPage() {
  const queryClient = getQueryClient();
  await prefetchDashboardData(queryClient);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent dehydratedState={dehydratedState} />
      </Suspense>
    </div>
  );
}
```

### Workouts Page with Offline Support
```typescript:admin/app/dashboard/client/workouts/page.tsx
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import WorkoutsList from './WorkoutsList';
import { prefetchWorkouts } from './prefetch';

export default async function WorkoutsPage() {
  const queryClient = getQueryClient();
  await prefetchWorkouts(queryClient);
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold">Workouts</h1>
      <Hydrate state={dehydratedState}>
        <WorkoutsList />
      </Hydrate>
    </div>
  );
}
```

## 4. Performance Optimizations

1. **Route-Based Code Splitting**
   - Each route in your client dashboard is automatically code-split
   - Dynamic imports for heavy components

2. **Prefetching Strategies**
   - Prefetch data on hover for linked pages
   - Implement parallel data fetching where possible

3. **Offline Support**
   - Cache API responses using service worker
   - IndexedDB storage for larger datasets
   - Optimistic updates for better UX

4. **Performance Monitoring**
   - Implement Web Vitals tracking
   - Monitor offline usage patterns
   - Track cache hit rates

## 5. Implementation Steps

1. Install required dependencies:
```bash
npm install next-pwa @tanstack/react-query-persist-client
```

2. Update your Next.js config with PWA settings

3. Add the QueryProvider to your client layout

4. Implement prefetching for critical routes

5. Add offline fallbacks for key features

6. Test PWA functionality:
   - Offline support
   - Installation prompt
   - Cache strategies
   - Background sync

This setup provides:
- Offline support for workouts and diet plans
- Fast page loads with prefetching
- Persistent data across sessions
- Optimistic updates for better UX
- Automatic background sync 