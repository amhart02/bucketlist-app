"use client";

import LibraryIdeaCard from "./LibraryIdeaCard";

interface LibraryIdea {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  usageCount: number;
}

interface IdeasGridProps {
  ideas: LibraryIdea[];
  onAddToList: (idea: LibraryIdea) => void;
}

export default function IdeasGrid({ ideas, onAddToList }: IdeasGridProps) {
  if (ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No ideas found</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map((idea) => (
        <LibraryIdeaCard key={idea._id} idea={idea} onAddToList={onAddToList} />
      ))}
    </div>
  );
}
