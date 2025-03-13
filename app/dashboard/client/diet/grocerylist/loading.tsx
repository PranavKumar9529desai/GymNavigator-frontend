export default function GroceryListLoading() {
  return (
    <div className="py-8">
      <div className="h-9 bg-gray-200 animate-pulse rounded w-60 mb-6"></div>
      <div className="space-y-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <div key={`skeleton-${i}`} className="flex items-center space-x-3">
            <div className="h-5 w-5 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-full max-w-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
