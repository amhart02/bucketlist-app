"use client";

interface Category {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {/* All Categories Button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            selectedCategoryId === null
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Ideas
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category._id)}
            className={`px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
              selectedCategoryId === category._id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
