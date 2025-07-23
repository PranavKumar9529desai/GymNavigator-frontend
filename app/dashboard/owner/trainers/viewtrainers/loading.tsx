import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Status cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      
      {/* Filter controls skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Skeleton className="h-10 w-full sm:w-64" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>
      
      {/* Trainers table skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        {[...Array(4)].map((_, i) => (
          <Skeleton  key={ i as number }  className="h-16 w-full" />
        ))}
      </div>
      
      {/* Add trainer button skeleton */}
      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
