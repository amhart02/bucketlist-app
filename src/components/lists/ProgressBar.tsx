"use client";

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressBar({
  percentage,
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const getColor = (pct: number) => {
    if (pct === 0) return "bg-gray-300";
    if (pct < 30) return "bg-red-500";
    if (pct < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]} overflow-hidden`}>
        <div
          className={`${getColor(clampedPercentage)} ${heightClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-right">
          {clampedPercentage}% complete
        </p>
      )}
    </div>
  );
}
