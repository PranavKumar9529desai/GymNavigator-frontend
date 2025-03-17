import { Skeleton } from '@/components/ui/skeleton';

export default function ViewDietLoading() {
  const skeletonMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 text-center">
        Today's Diet Plan
      </h1>
      <div className="space-y-8">
        {skeletonMealTypes.map((type) => (
          <div key={`skeleton-${type}`} className="relative">
            <div className="flex items-center mb-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="ml-6 pl-8 border-l-2 border-dashed border-gray-200 pb-8">
              <div className="bg-gray-100 rounded-lg p-4 border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
