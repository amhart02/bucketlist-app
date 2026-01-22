"use client";

import { useState } from "react";

interface BucketList {
  _id: string;
  name: string;
}

interface DeleteListDialogProps {
  list: BucketList;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteListDialog({ list, onClose, onDeleted }: DeleteListDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/lists/${list._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete list");
        setIsLoading(false);
        return;
      }

      onDeleted();
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Delete List</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete <strong>&quot;{list.name}&quot;</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This will permanently delete the list and all its items. This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 font-semibold"
          >
            {isLoading ? "Deleting..." : "Delete List"}
          </button>
        </div>
      </div>
    </div>
  );
}
