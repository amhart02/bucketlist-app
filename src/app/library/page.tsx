"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CategoryFilter from "@/components/library/CategoryFilter";
import LibrarySearch from "@/components/library/LibrarySearch";
import IdeasGrid from "@/components/library/IdeasGrid";
import AddToListModal from "@/components/library/AddToListModal";
import Pagination from "@/components/library/Pagination";
import LibrarySkeleton from "@/components/library/LibrarySkeleton";

interface Category {
  _id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

interface LibraryIdea {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  usageCount: number;
}

export default function LibraryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ideas, setIdeas] = useState<LibraryIdea[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<LibraryIdea | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch ideas when filters change OR when categories are loaded
  useEffect(() => {
    if (categories.length > 0 || searchQuery.trim() || selectedCategoryId) {
      fetchIdeas();
    }
  }, [selectedCategoryId, searchQuery, currentPage, categories]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/library/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let url: string;
      
      if (searchQuery.trim()) {
        // Search mode
        url = `/api/library/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=20`;
      } else if (selectedCategoryId) {
        // Category filter mode
        url = `/api/library/categories/${selectedCategoryId}/ideas?page=${currentPage}&limit=20`;
      } else {
        // Show all ideas from first category by default
        if (categories.length > 0) {
          url = `/api/library/categories/${categories[0]._id}/ideas?page=${currentPage}&limit=100`;
        } else {
          setLoading(false);
          return;
        }
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch ideas");
      const data = await res.json();
      
      setIdeas(data.ideas || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Fetch ideas error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedCategoryId(null);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToList = (idea: LibraryIdea) => {
    setSelectedIdea(idea);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    alert("Idea added to your list!");
    // Optionally refresh ideas to update usage count
    fetchIdeas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Idea Library
          </h1>
          <p className="text-gray-600 text-lg">
            Browse 100+ bucket list ideas and add them to your lists
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
        />

        {/* Search */}
        <LibrarySearch onSearch={handleSearch} initialValue={searchQuery} />

        {/* Ideas Grid */}
        {loading ? (
          <LibrarySkeleton />
        ) : (
          <>
            <IdeasGrid ideas={ideas} onAddToList={handleAddToList} />
            
            {/* Pagination */}
            {!searchQuery && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Add to List Modal */}
        <AddToListModal
          idea={selectedIdea}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
}
