"use client";

import React from "react";
import { Category } from "@/types/vocabulary";
import { useVocabulary } from "./VocabularyContext";

interface CategoryCardProps {
  category: Category;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelectCategory
}) => {
  const { getCategoryProgress } = useVocabulary();
  const progress = getCategoryProgress(category.id);

  const handleCardClick = () => {
    if (!category.isLocked) {
      onSelectCategory(category.id);
    }
  };

  return (
    <div 
      className={`
        relative w-full max-w-sm bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group
        ${category.isLocked 
          ? 'opacity-70 cursor-not-allowed shadow-lg' 
          : 'hover:scale-[1.02] hover:shadow-2xl shadow-xl hover:-translate-y-1'
        }
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none
      `}
      onClick={handleCardClick}
      style={{
        background: category.isLocked 
          ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
          : `linear-gradient(135deg, ${category.color?.replace('bg-', '') === 'blue-500' ? '#3b82f6' : 
              category.color?.replace('bg-', '') === 'green-500' ? '#10b981' :
              category.color?.replace('bg-', '') === 'purple-500' ? '#8b5cf6' :
              category.color?.replace('bg-', '') === 'orange-500' ? '#f97316' : '#3b82f6'} 0%, ${
              category.color?.replace('bg-', '') === 'blue-500' ? '#1e40af' : 
              category.color?.replace('bg-', '') === 'green-500' ? '#047857' :
              category.color?.replace('bg-', '') === 'purple-500' ? '#6d28d9' :
              category.color?.replace('bg-', '') === 'orange-500' ? '#ea580c' : '#1e40af'} 100%)`
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
      
      {/* Lock Overlay */}
      {category.isLocked && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 p-6 pb-4">
        <div className="flex items-start gap-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg
            transform transition-transform duration-300 group-hover:scale-110
            ${category.isLocked 
              ? 'bg-gray-200 shadow-gray-300/50' 
              : 'bg-white/20 backdrop-blur-sm shadow-black/20'
            }
          `}>
            {category.icon || "📖"}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-xl font-bold mb-1 ${
              category.isLocked ? 'text-gray-600' : 'text-white'
            }`}>
              {category.name}
            </h4>
            <p className={`text-sm leading-relaxed ${
              category.isLocked ? 'text-gray-500' : 'text-white/80'
            }`}>
              {category.description}
            </p>
          </div>

          {category.isLocked && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
              Locked
            </span>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative z-20 px-6 pb-4">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${
                category.isLocked ? 'text-gray-600' : 'text-white/90'
              }`}>
                Progress
              </span>
              <span className={`text-sm font-bold ${
                category.isLocked ? 'text-gray-700' : 'text-white'
              }`}>
                {progress.overallProgress}%
              </span>
            </div>
            <div className="relative w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  progress.overallProgress === 100 
                    ? 'bg-gradient-to-r from-green-400 to-green-300' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-300'
                }`}
                style={{ 
                  width: `${progress.overallProgress}%`,
                  transform: `translateX(${category.isLocked ? '-100%' : '0'})`,
                  transition: 'width 0.5s ease-out, transform 0.3s ease-out'
                }}
              />
              {progress.overallProgress > 0 && (
                <div 
                  className="absolute top-0 h-full w-2 bg-white/40 rounded-full"
                  style={{ left: `${Math.max(0, progress.overallProgress - 2)}%` }}
                />
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`
              text-center p-3 rounded-xl backdrop-blur-sm transition-all duration-300
              ${category.isLocked 
                ? 'bg-gray-100 border border-gray-200' 
                : 'bg-white/15 border border-white/20 hover:bg-white/25'
              }
            `}>
              <div className={`text-lg font-bold ${
                category.isLocked ? 'text-gray-700' : 'text-white'
              }`}>
                {progress.completedTopics}/{progress.totalTopics}
              </div>
              <div className={`text-xs font-medium ${
                category.isLocked ? 'text-gray-500' : 'text-white/70'
              }`}>
                Topics
              </div>
            </div>
            <div className={`
              text-center p-3 rounded-xl backdrop-blur-sm transition-all duration-300
              ${category.isLocked 
                ? 'bg-gray-100 border border-gray-200' 
                : 'bg-white/15 border border-white/20 hover:bg-white/25'
              }
            `}>
              <div className={`text-lg font-bold ${
                category.isLocked ? 'text-gray-700' : 'text-white'
              }`}>
                {progress.knownWords}/{progress.totalWords}
              </div>
              <div className={`text-xs font-medium ${
                category.isLocked ? 'text-gray-500' : 'text-white/70'
              }`}>
                Words
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-20 p-6 pt-2">
        <button
          className={`
            w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform
            ${category.isLocked 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300' 
              : `
                bg-white text-gray-900 hover:bg-white/90 active:scale-95 
                shadow-lg hover:shadow-xl border-2 border-white/30
                backdrop-blur-sm hover:backdrop-blur-md
              `
            }
          `}
          disabled={category.isLocked}
          onClick={handleCardClick}
        >
          {category.isLocked ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Complete previous categories
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Start Learning</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Achievement Badge */}
      {progress.overallProgress === 100 && !category.isLocked && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
