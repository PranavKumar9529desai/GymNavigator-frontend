export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-1/3" />

          {/* Form fields */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}

          {/* Submit button */}
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
} 