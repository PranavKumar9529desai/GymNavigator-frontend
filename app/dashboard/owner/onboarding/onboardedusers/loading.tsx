import { Skeleton } from '@/components/ui/skeleton';

export default function loading() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}
