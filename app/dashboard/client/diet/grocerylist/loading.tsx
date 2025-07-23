import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

export default function LoadingGroceryList() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-1/3 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div  key={ i as number }  className="p-4 border rounded-lg bg-white flex items-center gap-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
