import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
    <Skeleton className="aspect-video w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-5 w-1/4 mt-4" />
    </div>
  </div>
);

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <header className="mb-8 text-center space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </header>

        {/* Category Skeleton */}
        <div className="p-4">
          <nav className="mb-4">
            <div className="grid grid-cols-2 md:flex md:flex-row gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full md:w-32" />
              ))}
            </div>
          </nav>

          {/* Search Bar Skeleton */}
          <Skeleton className="h-10 w-full mt-4" />
        </div>

        {/* Muscle Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
} 