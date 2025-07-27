import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gym Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`plan-skeleton-${String.fromCharCode(65 + index)}`} className="relative rounded-lg border-2 border-slate-200 p-6 bg-white">
              {/* Featured Badge Skeleton */}
              <Skeleton className="h-6 w-20 mx-auto mb-4" />
              
              {/* Plan Header Skeleton */}
              <div className="text-center mb-4">
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>

              {/* Price Skeleton */}
              <div className="text-center mb-6">
                <Skeleton className="h-8 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>

              {/* Features Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="space-y-2">
                  {['feature-1', 'feature-2', 'feature-3'].map((featureId) => (
                    <div key={`plan-${String.fromCharCode(65 + index)}-${featureId}`} className="flex items-start">
                      <Skeleton className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="space-y-1">
                  {['slot-1', 'slot-2'].map((slotId) => (
                    <Skeleton key={`plan-${String.fromCharCode(65 + index)}-${slotId}`} className="h-4 w-24" />
                  ))}
                </div>
              </div>

              {/* Additional Info Skeleton */}
              <div className="space-y-1">
                {['info-1', 'info-2'].map((infoId) => (
                  <Skeleton key={`plan-${String.fromCharCode(65 + index)}-${infoId}`} className="h-3 w-20" />
                ))}
              </div>

              {/* Select Button Skeleton */}
              <Skeleton className="w-full h-10 mt-4 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Enrollment Button Skeleton */}
        <div className="text-center">
          <Skeleton className="h-12 w-32 mx-auto rounded-lg" />
        </div>
      </div>
    </div>
  );
} 