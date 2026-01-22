"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddItemForm from "@/components/items/AddItemForm";
import ItemsList from "@/components/items/ItemsList";
import EmptyItemsState from "@/components/items/EmptyItemsState";
import ItemsLoading from "@/components/items/ItemsLoading";
import EditItemDialog from "@/components/items/EditItemDialog";
import DeleteItemConfirm from "@/components/items/DeleteItemConfirm";

interface BucketList {
  _id: string;
  userId: string;
  name: string;
  itemCount: number;
  completedCount: number;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

interface BucketListItem {
  _id: string;
  bucketListId: string;
  text: string;
  isCompleted: boolean;
  order: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListDetailClient({ listId }: { listId: string }) {
  const router = useRouter();
  const [list, setList] = useState<BucketList | null>(null);
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<BucketListItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [deletingItemText, setDeletingItemText] = useState<string>("");

  const fetchList = async () => {
    try {
      const res = await fetch(`/api/lists/${listId}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 403) {
        setError("You don't have permission to view this list");
        return;
      }
      if (res.status === 404) {
        setError("List not found");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch list");
      }
      const data = await res.json();
      setList(data.list);
      setItems(data.items);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [listId, router]);

  const handleToggleItem = async (itemId: string, isCompleted: boolean) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, isCompleted } : item
      )
    );

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      // Refresh to get updated counts
      await fetchList();
    } catch (err) {
      console.error("Toggle error:", err);
      // Revert optimistic update on error
      await fetchList();
    }
  };

  const handleEditItem = (item: BucketListItem) => {
    setEditingItem(item);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = items.find((i) => i._id === itemId);
    if (item) {
      setDeletingItemId(itemId);
      setDeletingItemText(item.text);
    }
  };

  const handleItemAdded = () => {
    fetchList();
  };

  const handleItemUpdated = () => {
    fetchList();
    setEditingItem(null);
  };

  const handleItemDeleted = () => {
    fetchList();
    setDeletingItemId(null);
    setDeletingItemText("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-2">{error}</p>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!list) {
    return null;
  }

  const completionPercentage =
    list.itemCount > 0 ? Math.round((list.completedCount / list.itemCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{list.name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {list.completedCount} of {list.itemCount} completed
          </span>
          {list.itemCount > 0 && (
            <span className="text-blue-600 font-medium">
              {completionPercentage}%
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {list.itemCount > 0 && (
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      <AddItemForm listId={listId} onItemAdded={handleItemAdded} />

      {/* Items List */}
      {loading ? (
        <ItemsLoading />
      ) : items.length === 0 ? (
        <EmptyItemsState />
      ) : (
        <ItemsList
          items={items}
          onToggle={handleToggleItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Edit Item Dialog */}
      <EditItemDialog
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onItemUpdated={handleItemUpdated}
      />

      {/* Delete Item Confirmation */}
      <DeleteItemConfirm
        itemId={deletingItemId}
        itemText={deletingItemText}
        isOpen={!!deletingItemId}
        onClose={() => {
          setDeletingItemId(null);
          setDeletingItemText("");
        }}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  );
}
