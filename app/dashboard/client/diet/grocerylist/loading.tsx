import { Skeleton } from '@/components/ui/skeleton';

export default function GroceryListLoading() {
  return (
    <div className="py-8">
      <Skeleton className="h-9 w-60 mb-6" />

      <div className="space-y-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <div key={`grocery-skeleton-${i as number}`} className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
