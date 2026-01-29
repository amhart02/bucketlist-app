"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/Toast";

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
  const { showToast } = useToast();
  const [lists, setLists] = useState<BucketList[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [itemName, setItemName] = useState("");

  // Fetch user's lists when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLists();
      // Initialize item name with the idea title
      if (idea) {
        setItemName(idea.title);
      }
    }
  }, [isOpen, idea]);

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
    if (!idea) return;
    
    // Validate item name
    if (!itemName.trim()) {
      showToast("Please enter a name for the item", "warning");
      return;
    }
    
    // If creating new list, validate the name
    if (isCreatingNew && !newListName.trim()) {
      showToast("Please enter a name for your new list", "warning");
      return;
    }
    
    // If selecting existing list, validate selection
    if (!isCreatingNew && !selectedListId) {
      showToast("Please select a list", "warning");
      return;
    }

    setAdding(true);
    try {
      let targetListId = selectedListId;
      
      // Step 1: Create new list if needed
      if (isCreatingNew) {
        const createRes = await fetch("/api/lists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newListName.trim() }),
        });
        
        if (!createRes.ok) throw new Error("Failed to create list");
        
        const createData = await createRes.json();
        targetListId = createData.list._id;
      }
      
      // Step 2: Add item to the list (either new or selected)
      const res = await fetch(`/api/lists/${targetListId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: itemName.trim(),
          sourceLibraryIdeaId: idea._id,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      // Show success message
      showToast(isCreatingNew ? `Created list and added "${itemName}"!` : `Added "${itemName}" to your list!`, "success");
      
      onSuccess();
      onClose();
      
      // Reset state
      setSelectedListId("");
      setIsCreatingNew(false);
      setNewListName("");
      setItemName("");
    } catch (err) {
      console.error("Add to list error:", err);
      showToast("Failed to add idea to list. Please try again.", "error");
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

        {/* Editable Item Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item name
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            maxLength={200}
          />
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading your lists...</div>
        ) : lists.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">You don't have any lists yet</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-600 font-medium"
            >
              Create your first list →
            </button>
          </div>
        ) : (
          <>
            {/* Radio buttons to choose between existing or new list */}
            <div className="mb-4 space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="listChoice"
                  checked={!isCreatingNew}
                  onChange={() => {
                    setIsCreatingNew(false);
                    setNewListName("");
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-900">Add to existing list</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="listChoice"
                  checked={isCreatingNew}
                  onChange={() => {
                    setIsCreatingNew(true);
                    setSelectedListId("");
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-900">Create new list</span>
              </label>
            </div>

            {/* Show dropdown if selecting existing list */}
            {!isCreatingNew && (
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-6"
              >
                <option value="">Select a list...</option>
                {lists.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.name} ({list.itemCount} items)
                  </option>
                ))}
              </select>
            )}

            {/* Show text input if creating new list */}
            {isCreatingNew && (
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter new list name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-6"
                maxLength={100}
              />
            )}

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
                disabled={adding || !itemName.trim() || (!isCreatingNew && !selectedListId) || (isCreatingNew && !newListName.trim())}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? "Adding..." : isCreatingNew ? "Create & Add" : "Add to List"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
