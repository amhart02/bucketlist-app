"use client";

import { useEffect, useState } from "react";

interface OverallStats {
  totalLists: number;
  totalItems: number;
  completedItems: number;
  completionPercentage: number;
}

export default function OverallProgress() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/lists");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      
      // Calculate overall stats from lists
      const lists = data.lists || [];
      const totalItems = lists.reduce((sum: number, list: any) => sum + list.itemCount, 0);
      const completedItems = lists.reduce((sum: number, list: any) => sum + list.completedCount, 0);
      const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

      setStats({
        totalLists: lists.length,
        totalItems,
        completedItems,
        completionPercentage,
      });
    } catch (err) {
      console.error("Fetch stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Progress</h2>
      
      <div className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.totalLists}</p>
            <p className="text-sm text-gray-600">Lists</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.completedItems}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.totalItems}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
        </div>

        {/* Progress Bar */}
        {stats.totalItems > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-sm font-bold text-blue-600">{stats.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        {stats.totalItems === 0 && (
          <p className="text-sm text-gray-600 text-center py-2">
            Start adding items to track your progress!
          </p>
        )}
        {stats.totalItems > 0 && stats.completionPercentage === 100 && (
          <p className="text-sm text-green-600 text-center py-2 font-semibold">
            🎉 Amazing! You've completed everything!
          </p>
        )}
        {stats.totalItems > 0 && stats.completionPercentage > 0 && stats.completionPercentage < 100 && (
          <p className="text-sm text-gray-600 text-center py-2">
            Keep going! {stats.totalItems - stats.completedItems} items left to complete
          </p>
        )}
      </div>
    </div>
  );
}
