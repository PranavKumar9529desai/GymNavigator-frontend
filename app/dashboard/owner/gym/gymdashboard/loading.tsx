import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-4">
      {/* Status cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      {/* Mobile card skeletons */}
      <div className="md:hidden space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton  key={ i as number }  className="h-24 w-full" />
        ))}
      </div>
      {/* Table skeleton for desktop */}
      <div className="hidden md:block">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
} 