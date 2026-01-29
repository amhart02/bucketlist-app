"use client";

import { useState } from "react";
import CreateListDialog from "./CreateListDialog";

interface CreateListButtonProps {
  onListCreated: () => void;
}

export default function CreateListButton({ onListCreated }: CreateListButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleCreated = () => {
    setShowDialog(false);
    onListCreated();
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create List
      </button>

      {showDialog && (
        <CreateListDialog onClose={() => setShowDialog(false)} onCreated={handleCreated} />
      )}
    </>
  );
}
