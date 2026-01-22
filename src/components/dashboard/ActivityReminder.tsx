"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { findInactiveLists, getDaysSinceActivity, formatDaysSince } from "@/lib/utils/reminders";

interface BucketList {
  _id: string;
  name: string;
  lastActivityAt: string;
  itemCount: number;
  completedCount: number;
}

interface ActivityReminderProps {
  lists: BucketList[];
  maxDisplay?: number;
}

export default function ActivityReminder({
  lists,
  maxDisplay = 3,
}: ActivityReminderProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Load dismissed lists from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("dismissedReminders");
    if (stored) {
      try {
        setDismissed(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse dismissed reminders:", e);
      }
    }
  }, []);

  const inactiveLists = findInactiveLists(lists)
    .filter((list) => !dismissed.includes(list._id))
    .slice(0, maxDisplay) as BucketList[];

  const handleDismiss = (listId: string) => {
    const newDismissed = [...dismissed, listId];
    setDismissed(newDismissed);
    localStorage.setItem("dismissedReminders", JSON.stringify(newDismissed));
  };

  const handleDismissAll = () => {
    const allIds = inactiveLists.map((list) => list._id);
    const newDismissed = [...dismissed, ...allIds];
    setDismissed(newDismissed);
    localStorage.setItem("dismissedReminders", JSON.stringify(newDismissed));
  };

  if (inactiveLists.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏰</span>
          <div>
            <h3 className="font-semibold text-gray-900">Activity Reminder</h3>
            <p className="text-sm text-gray-600">
              These lists haven't been updated in a while
            </p>
          </div>
        </div>
        <button
          onClick={handleDismissAll}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Dismiss all
        </button>
      </div>

      <div className="space-y-3">
        {inactiveLists.map((list) => {
          const daysSince = getDaysSinceActivity(list.lastActivityAt);
          return (
            <div
              key={list._id}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-yellow-100"
            >
              <div className="flex-1">
                <Link
                  href={`/lists/${list._id}`}
                  className="font-medium text-gray-900 hover:text-blue-600"
                >
                  {list.name}
                </Link>
                <p className="text-sm text-gray-500">
                  Last activity: {formatDaysSince(daysSince)} • {list.completedCount}/
                  {list.itemCount} completed
                </p>
              </div>
              <button
                onClick={() => handleDismiss(list._id)}
                className="ml-4 text-gray-400 hover:text-gray-600"
                title="Dismiss"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        💡 Tip: Regular updates help you stay on track with your goals!
      </p>
    </div>
  );
}
