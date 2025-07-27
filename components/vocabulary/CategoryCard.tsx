"use client";

import React from "react";
import { Category } from "@/types/vocabulary";

interface CategoryCardProps {
  category: Category;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelectCategory
}) => {
  // Mock progress data
  const progress = {
    overallProgress: Math.floor(Math.random() * 100),
    completedTopics: Math.floor(Math.random() * 5),
    totalTopics: 8,
    knownWords: Math.floor(Math.random() * 50),
    totalWords: 100
  };

  const handleCardClick = () => {
    onSelectCategory(category.id);
  };

  return (
    <div 
      className="relative w-full max-w-sm bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Lock Overlay */}
      {category.isLocked && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-gray-600">Coming Soon</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl flex-shrink-0">
            {category.icon || "📚"}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {category.name}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">
              Progress
            </span>
            <span className="text-gray-600">
              {progress.overallProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.overallProgress}%` }}
            ></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {progress.completedTopics}/{progress.totalTopics}
              </div>
              <div className="text-xs text-gray-600">
                Topics
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {progress.knownWords}
              </div>
              <div className="text-xs text-gray-600">
                Words Learned
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <div className="w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              {progress.overallProgress === 100 ? 'Review' : progress.overallProgress > 0 ? 'Continue Learning' : 'Start Learning'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
