"use client";

import { useState } from "react";

interface DeleteItemConfirmProps {
  itemId: string | null;
  itemText: string;
  isOpen: boolean;
  onClose: () => void;
  onItemDeleted: () => void;
}

export default function DeleteItemConfirm({
  itemId,
  itemText,
  isOpen,
  onClose,
  onItemDeleted,
}: DeleteItemConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !itemId) return null;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete item");
      }

      onItemDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Delete Item</h2>
        
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this item?
        </p>
        <p className="text-gray-900 font-medium mb-4 bg-gray-50 p-3 rounded border border-gray-200">
          "{itemText}"
        </p>
        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
