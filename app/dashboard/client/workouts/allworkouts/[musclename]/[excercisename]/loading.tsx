import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <article className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6 lg:space-y-12">
          {/* Exercise Header Skeleton */}
          <header className="space-y-6 mb-8 lg:mb-12">
            <Skeleton className="h-12 sm:h-14 lg:h-16 w-3/4 mx-auto rounded-lg" />
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Skeleton className="h-10 w-32 rounded-full" />
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={`action-${i as number}`} className="h-9 w-9 rounded-full" />
                ))}
              </div>
            </div>
          </header>

          {/* Video Section Skeleton */}
          <section>
            <Skeleton className="w-full aspect-video rounded-2xl" />
          </section>

          {/* Exercise Details Skeleton */}
          <section className="mt-8 lg:mt-16 space-y-8">
            <Skeleton className="h-16 w-full rounded-2xl" />

            <div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Muscle Image Skeleton */}
              <Skeleton className="h-[300px] w-full rounded-2xl" />

              {/* Instructions Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={`instruction-${i as number}`} className="flex gap-4">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
