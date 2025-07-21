
"use client";

import { useState } from "react";
import { CategoryCard } from "@/components/vocabulary/CategoryCard";
import { TopicModal } from "@/components/vocabulary/TopicModal";
import { OverallProgress } from "@/components/vocabulary/OverallProgress";
import { Category } from "@/types/vocabulary";
import { useVocabulary } from "@/components/vocabulary/VocabularyContext";

export default function LearnVocabularyPage() {
  const { categories, isLoading } = useVocabulary();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedCategory(category);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading vocabulary...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative bg-white shadow-lg rounded-b-3xl border border-gray-100 mx-4 mt-4">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent rounded-b-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <span className="text-3xl">🎓</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Learn Vocabulary
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Master English vocabulary through structured learning paths designed to accelerate your language journey
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OverallProgress />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="text-center lg:text-left px-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Choose a Category
                </h2>
                <p className="text-gray-400">
                  Select a vocabulary category to start learning. Complete categories to unlock new ones!
                </p>
              </div>

              {/* Categories Path - ZigZag Starting from Left */}
              <div className="space-y-2">
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category, index) => (
                    <div key={category.id} className="relative">
                      {/* Category Card Container - ZigZag Pattern Starting Left */}
                      <div className={`
                        flex relative z-10 px-4
                        ${index % 2 === 0 ? 'justify-start' : 'justify-end'}
                      `}>
                        <CategoryCard
                          category={category}
                          onSelectCategory={handleSelectCategory}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* Coming Soon Section */}
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  More Categories Coming Soon!
                </h3>
                <p className="text-gray-400">
                  Complete current categories to unlock advanced vocabulary topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Modal */}
      <TopicModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}