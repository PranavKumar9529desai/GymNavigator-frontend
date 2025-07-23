import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Status cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      
      {/* Filter and search skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>
      
      {/* Users-Trainers assignment table skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        {[...Array(6)].map((_, i) => (
          <Skeleton  key={ i as number }  className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
