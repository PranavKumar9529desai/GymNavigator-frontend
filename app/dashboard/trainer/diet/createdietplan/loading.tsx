import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Skeleton className="h-32 mb-4" />
      <Skeleton className="h-64" />
    </div>
  );
} 