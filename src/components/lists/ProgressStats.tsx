"use client";

interface ProgressStatsProps {
  completed: number;
  total: number;
  showPercentage?: boolean;
}

export default function ProgressStats({
  completed,
  total,
  showPercentage = true,
}: ProgressStatsProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700 font-medium">
        {completed} of {total} completed
      </span>
      {showPercentage && total > 0 && (
        <span className="text-sm text-blue-600 font-semibold">
          ({percentage}%)
        </span>
      )}
    </div>
  );
}
