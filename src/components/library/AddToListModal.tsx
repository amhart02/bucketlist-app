"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LibraryIdea {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  usageCount: number;
}

interface BucketList {
  _id: string;
  name: string;
  itemCount: number;
}

interface AddToListModalProps {
  idea: LibraryIdea | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddToListModal({
  idea,
  isOpen,
  onClose,
  onSuccess,
}: AddToListModalProps) {
  const router = useRouter();
  const [lists, setLists] = useState<BucketList[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");

  // Fetch user's lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLists();
    }
  }, [isOpen]);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lists");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch lists");
      const data = await res.json();
      setLists(data.lists || []);
    } catch (err) {
      console.error("Fetch lists error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async () => {
    if (!selectedListId || !idea) return;

    setAdding(true);
    try {
      const res = await fetch(`/api/lists/${selectedListId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: idea.title,
          sourceLibraryIdeaId: idea._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      onSuccess();
      onClose();
      setSelectedListId("");
    } catch (err) {
      console.error("Add to list error:", err);
      alert("Failed to add idea to list");
    } finally {
      setAdding(false);
    }
  };

  if (!isOpen || !idea) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Add to List
        </h2>

        <p className="text-gray-600 mb-6">
          Add <span className="font-semibold">"{idea.title}"</span> to one of your bucket lists:
        </p>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading your lists...</div>
        ) : lists.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">You don't have any lists yet</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first list →
            </button>
          </div>
        ) : (
          <>
            <select
              value={selectedListId}
              onChange={(e) => setSelectedListId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
            >
              <option value="">Select a list...</option>
              {lists.map((list) => (
                <option key={list._id} value={list._id}>
                  {list.name} ({list.itemCount} items)
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={adding}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToList}
                disabled={!selectedListId || adding}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : "Add to List"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
