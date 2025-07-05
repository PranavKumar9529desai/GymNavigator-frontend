import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center space-y-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-80" />
        <Skeleton className="h-64 w-64 rounded-lg" />
      </div>
    </div>
  );
}
