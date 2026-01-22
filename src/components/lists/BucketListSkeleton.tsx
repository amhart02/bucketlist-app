export default function BucketListSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4"></div>

      {/* Date */}
      <div className="h-3 bg-gray-200 rounded w-32 mb-6"></div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded w-20"></div>
        <div className="h-9 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}
