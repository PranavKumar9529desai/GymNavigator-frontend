# GymNavigator Architecture Guide

## 1. Data Fetching Patterns

### A. Server-Side Prefetching (Using getQueryClient)

Use for:

- Initial page loads with critical data
- SEO-critical content
- Large datasets that need server processing

```typescript
// Example: /dashboard/overview/page.tsx
import { getQueryClient } from "@/lib/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function DashboardOverviewPage() {
  const queryClient = getQueryClient();

  // Parallel data fetching
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user-stats"],
      queryFn: fetchUserStats,
    }),
    queryClient.prefetchQuery({
      queryKey: ["recent-activities"],
      queryFn: fetchRecentActivities,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContent />
    </HydrationBoundary>
  );
}
```

### B. Offline-First Features (Using IndexedDB Persistence)

Use for:

- User-generated content
- Frequent updates
- Features that need offline support

```typescript
// Example: /attendance/markattendance/_components/AttendanceContent.tsx
"use client";

export default function AttendanceContent() {
  const mutation = useMutation({
    mutationFn: markAttendance,
    onMutate: async (newAttendance) => {
      await queryClient.cancelQueries({ queryKey: ["attendance"] });
      const previousAttendance = queryClient.getQueryData(["attendance"]);

      queryClient.setQueryData(["attendance"], (old) => ({
        ...old,
        today: true,
      }));

      return { previousAttendance };
    },
    onError: (err, newAttendance, context) => {
      queryClient.setQueryData(["attendance"], context.previousAttendance);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}
```

### C. Real-Time Updates (Using Server + Client Hybrid)

Use for:

- Live workout tracking
- Group activities
- Chat features

```typescript
// Example: /workouts/live/_components/LiveWorkout.tsx
"use client";

export default function LiveWorkout() {
  // Real-time updates
  const { data } = useQuery({
    queryKey: ["live-workout"],
    queryFn: fetchLiveWorkoutData,
    refetchInterval: 1000, // Poll every second
  });

  // Offline persistence for backup
  const mutation = useMutation({
    mutationFn: updateWorkoutProgress,
    onMutate: async (newProgress) => {
      // Optimistic update
    },
  });
}
```

## 2. Feature-Specific Patterns

### A. Dashboard & Analytics

```typescript
// pages/dashboard/page.tsx
export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // Heavy computation on server
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: computeDashboardStats,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardAnalytics />
    </HydrationBoundary>
  );
}
```

### B. Workout Management

```typescript
// pages/workouts/page.tsx
export default function WorkoutsPage() {
  // No server prefetch needed - use IndexedDB
  return <WorkoutsList />;
}

// _components/WorkoutsList.tsx
("use client");

export default function WorkoutsList() {
  const { data } = useQuery({
    queryKey: ["workouts"],
    queryFn: fetchWorkouts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    // Will be persisted in IndexedDB automatically
  });
}
```

### C. Attendance System

```typescript
// Current implementation is correct
export default function MarkAttendancePage() {
  return (
    <Suspense fallback={<MarkAttendanceLoading />}>
      <AttendanceContent />
    </Suspense>
  );
}
```

## 3. Data Flow Patterns

### A. Server-Side Flow

1. Initial request hits server component
2. getQueryClient prefetches critical data
3. Data is dehydrated and sent to client
4. Client hydrates with initial data
5. Subsequent updates use IndexedDB cache

### B. Offline-First Flow

1. Check IndexedDB cache first
2. Show cached data immediately
3. Attempt background sync with server
4. Update UI optimistically
5. Rollback on error

### C. Real-Time Flow

1. Initial data from server prefetch
2. Subscribe to real-time updates
3. Cache updates in IndexedDB
4. Fallback to cached data when offline
5. Sync when back online

## 4. When to Use What

### Use Server Prefetching (getQueryClient) for:

- ✅ Dashboard statistics
- ✅ User profile initial load
- ✅ Workout plans catalog
- ✅ Exercise library
- ✅ Initial app configuration

### Use IndexedDB Persistence for:

- ✅ Attendance marking
- ✅ Workout tracking
- ✅ Personal notes
- ✅ Progress photos
- ✅ Exercise logs

### Use Hybrid Approach for:

- ✅ Group workouts
- ✅ Trainer communications
- ✅ Leaderboards
- ✅ Social features

## 5. Implementation Checklist

### For Server-Heavy Features:

```typescript
// 1. Create server action
async function fetchData() {
  // Heavy computation
}

// 2. Server component
export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    /*...*/
  });
  return <HydrationBoundary>{/*...*/}</HydrationBoundary>;
}
```

### For Offline-First Features:

```typescript
// 1. Client component
"use client";

// 2. Use mutations with optimistic updates
const mutation = useMutation({
  /*...*/
});

// 3. Implement error boundaries
<ErrorBoundary fallback={<OfflineFallback />}>{/*...*/}</ErrorBoundary>;
```

## 6. Performance Optimization

### Server Components:

- Parallel data fetching
- Streaming with Suspense
- Route prefetching

### Client Components:

- IndexedDB caching
- Optimistic updates
- Background sync

### Network:

- Stale-while-revalidate
- Offline fallbacks
- Progressive enhancement
