"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface BucketList {
  _id: string;
  name: string;
  lastActivityAt: string;
}

export default function NotificationBell() {
  const [inactiveLists, setInactiveLists] = useState<BucketList[]>([]);
  const [viewedListIds, setViewedListIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load viewed notifications from localStorage
    const stored = localStorage.getItem("viewedNotifications");
    if (stored) {
      setViewedListIds(new Set(JSON.parse(stored)));
    }
    
    fetchInactiveLists();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInactiveLists = async () => {
    try {
      const res = await fetch("/api/lists");
      if (!res.ok) return;
      
      const data = await res.json();
      const lists = data.lists || [];
      
      // TEMPORARY: Show all lists as inactive for demo purposes
      // Filter lists that haven't been updated in 7 days
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      
      const inactive = lists.filter((list: BucketList) => {
        // DEMO MODE: Treat all lists as inactive
        return true;
        
        // REAL CODE (uncomment to restore):
        // const lastActivity = new Date(list.lastActivityAt);
        // return lastActivity < oneWeekAgo;
      });
      
      setInactiveLists(inactive);
    } catch (err) {
      console.error("Failed to fetch inactive lists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (listId: string) => {
    // Mark this notification as viewed
    const newViewedIds = new Set(viewedListIds);
    newViewedIds.add(listId);
    setViewedListIds(newViewedIds);
    
    // Save to localStorage
    localStorage.setItem("viewedNotifications", JSON.stringify(Array.from(newViewedIds)));
    
    setIsOpen(false);
  };

  // Filter out viewed notifications
  const unviewedLists = inactiveLists.filter(list => !viewedListIds.has(list._id));

  const getTimeSinceUpdate = (lastActivityAt: string) => {
    const now = new Date();
    const lastActivity = new Date(lastActivityAt);
    const diffInDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        title="Notifications"
      >
        {/* Bell Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Badge */}
        {unviewedLists.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unviewedLists.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {unviewedLists.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">All caught up!</p>
                <p className="text-xs mt-1">No lists need attention</p>
              </div>
            ) : (
              unviewedLists.map((list) => (
                <Link
                  key={list._id}
                  href={`/lists/${list._id}`}
                  onClick={() => handleNotificationClick(list._id)}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {list.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        No activity for {getTimeSinceUpdate(list.lastActivityAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          {unviewedLists.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all lists →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
