import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingMyWorkouts() {
  return (
    <div className="space-y-10">
      {/* Workout Section Skeleton */}
      <section>
        <div className="relative mb-6 rounded-2xl overflow-hidden">
          <Skeleton className="h-32 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div  key={ i as number }  className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <Skeleton className="h-16 w-full" />
              <div className="p-5">
                <div className="space-y-5">
                  {[1, 2].map((j) => (
                    <div key={j} className="overflow-hidden rounded-lg bg-blue-50">
                      <Skeleton className="h-8 w-1/2 mb-2" />
                      <div className="flex flex-col gap-4">
                        <Skeleton className="w-full h-48 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                          </div>
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diet Section Skeleton */}
      <section>
        <div className="relative mb-6 rounded-2xl overflow-hidden">
          <Skeleton className="h-32 w-full bg-gradient-to-r from-green-500 to-teal-600" />
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div  key={ i as number }  className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <Skeleton className="h-16 w-full" />
              <div className="p-5">
                <div className="mb-5">
                  <Skeleton className="h-5 w-1/4 mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
                <div className="mb-5">
                  <Skeleton className="h-5 w-1/4 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
