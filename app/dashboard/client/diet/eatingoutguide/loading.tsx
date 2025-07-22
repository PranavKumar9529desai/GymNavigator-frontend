import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingEatingOutGuide() {
  return (
    <div className="py-8">
      <Skeleton className="h-10 w-1/3 mb-6" />
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg bg-white">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
