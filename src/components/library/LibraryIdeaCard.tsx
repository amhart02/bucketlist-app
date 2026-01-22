"use client";

interface LibraryIdea {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  usageCount: number;
}

interface LibraryIdeaCardProps {
  idea: LibraryIdea;
  onAddToList: (idea: LibraryIdea) => void;
}

export default function LibraryIdeaCard({
  idea,
  onAddToList,
}: LibraryIdeaCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {idea.title}
        </h3>
        <button
          onClick={() => onAddToList(idea)}
          className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          + Add
        </button>
      </div>

      {idea.description && (
        <p className="text-gray-600 text-sm mb-3">{idea.description}</p>
      )}

      <div className="flex items-center justify-between">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {idea.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Usage Count */}
        {idea.usageCount > 0 && (
          <span className="text-xs text-gray-500">
            {idea.usageCount} {idea.usageCount === 1 ? "person" : "people"} added this
          </span>
        )}
      </div>
    </div>
  );
}
