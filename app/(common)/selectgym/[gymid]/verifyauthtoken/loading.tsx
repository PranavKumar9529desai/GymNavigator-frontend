import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />

        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <Skeleton className="w-24 h-24 rounded-lg mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
