"use client";

import { useState } from "react";

interface BucketListItemCardProps {
  item: {
    _id: string;
    text: string;
    isCompleted: boolean;
    order: number;
    completedAt?: string;
  };
  onToggle: (itemId: string, isCompleted: boolean) => Promise<void>;
  onEdit: (item: any) => void;
  onDelete: (itemId: string) => void;
}

export default function BucketListItemCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}: BucketListItemCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(item._id, !item.isCompleted);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-gray-300 transition-colors">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.isCompleted}
        onChange={handleToggle}
        disabled={isToggling}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:cursor-wait"
      />

      {/* Text */}
      <span
        className={`flex-1 ${
          item.isCompleted
            ? "line-through text-gray-500"
            : "text-gray-900"
        }`}
      >
        {item.text}
      </span>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="text-sm text-blue-600 hover:text-blue-600 px-3 py-1 hover:bg-blue-50 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item._id)}
          className="text-sm text-red-600 hover:text-red-700 px-3 py-1 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
