"use client";

import { useState } from "react";
import Link from "next/link";
import RenameListDialog from "./RenameListDialog";
import DeleteListDialog from "./DeleteListDialog";

interface BucketList {
  _id: string;
  name: string;
  itemCount: number;
  completedCount: number;
  completionPercentage: number;
  lastActivityAt: string;
  createdAt: string;
}

interface BucketListCardProps {
  list: BucketList;
  onDeleted: () => void;
}

export default function BucketListCard({ list, onDeleted }: BucketListCardProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleRenamed = () => {
    setShowRenameDialog(false);
    window.location.reload(); // Refresh to show updated name
  };

  const handleDeleted = () => {
    setShowDeleteDialog(false);
    onDeleted();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <Link href={`/lists/${list._id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {list.name}
            </h3>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setShowRenameDialog(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Rename list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete list"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{list.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${list.completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            {list.completedCount} of {list.itemCount} completed
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          Created {new Date(list.createdAt).toLocaleDateString()}
        </div>
      </div>

      {showRenameDialog && (
        <RenameListDialog
          list={list}
          onClose={() => setShowRenameDialog(false)}
          onRenamed={handleRenamed}
        />
      )}

      {showDeleteDialog && (
        <DeleteListDialog
          list={list}
          onClose={() => setShowDeleteDialog(false)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
