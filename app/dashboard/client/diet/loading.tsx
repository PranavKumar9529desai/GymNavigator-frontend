export default function DietLoading() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 space-y-3">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
