import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-6 p-4">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`stat-${i}-${Math.random()}`} className="p-4 rounded-lg bg-background border space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`quick-action-${i}-${Math.random()}`} className="h-20" />
          ))}
        </div>
      </div>

      {/* Trainer Info Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="p-4 rounded-lg bg-background border">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={`recent-activity-${i}-${Math.random()}`} className="flex items-center justify-between p-3 rounded-lg bg-background border">
              <div className="flex items-center gap-3">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
