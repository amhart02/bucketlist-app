"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BucketListsGrid from "@/components/lists/BucketListsGrid";
import CreateListButton from "@/components/lists/CreateListButton";
import EmptyListsState from "@/components/lists/EmptyListsState";
import BucketListSkeleton from "@/components/lists/BucketListSkeleton";
import OverallProgress from "@/components/dashboard/OverallProgress";
import ActivityReminder from "@/components/dashboard/ActivityReminder";

interface BucketList {
  _id: string;
  name: string;
  itemCount: number;
  completedCount: number;
  completionPercentage: number;
  lastActivityAt: string;
  createdAt: string;
}

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lists, setLists] = useState<BucketList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchLists();
    }
  }, [status, router]);

  const fetchLists = async () => {
    try {
      const res = await fetch("/api/lists");
      if (!res.ok) throw new Error("Failed to fetch lists");
      const data = await res.json();
      setLists(data.lists || []);
    } catch (err) {
      setError("Failed to load your bucket lists");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListCreated = () => {
    fetchLists();
  };

  const handleListDeleted = () => {
    fetchLists();
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BucketListSkeleton />
            <BucketListSkeleton />
            <BucketListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bucket Lists</h1>
            <p className="mt-2 text-gray-600">
              {lists.length === 0
                ? "Start creating your bucket lists"
                : `${lists.length} ${lists.length === 1 ? "list" : "lists"}`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/library"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              📚 Browse Ideas
            </Link>
            <CreateListButton onListCreated={handleListCreated} />
          </div>
        </div>

        {/* Overall Progress Widget */}
        {lists.length > 0 && (
          <div className="mb-8">
            <OverallProgress />
          </div>
        )}

        {/* Activity Reminders */}
        {lists.length > 0 && (
          <ActivityReminder lists={lists} />
        )}

        {lists.length === 0 ? (
          <EmptyListsState />
        ) : (
          <BucketListsGrid lists={lists} onListDeleted={handleListDeleted} />
        )}
      </div>
    </div>
  );
}
