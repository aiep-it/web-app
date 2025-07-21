"use client";

import React from "react";
import { useVocabulary } from "./VocabularyContext";

export const OverallProgress: React.FC = () => {
  const { getOverallProgress, categories } = useVocabulary();
  const progress = getOverallProgress();

  const totalCategories = categories.length;
  const unlockedCategories = categories.filter(cat => !cat.isLocked).length;

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">
            Your Learning Progress
          </h3>
          <p className="text-sm text-gray-500">
            Keep learning to unlock new categories!
          </p>
        </div>

        {/* Main Progress */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress.percentage / 100)}`}
                className="transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {progress.percentage}%
                </div>
                <div className="text-xs text-gray-500">
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {progress.knownWords}
            </div>
            <div className="text-xs text-gray-600">
              Words Learned
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">
              {progress.totalWords}
            </div>
            <div className="text-xs text-gray-600">
              Total Words
            </div>
          </div>
        </div>

        {/* Categories Status */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Categories</span>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${unlockedCategories === totalCategories 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
              }
            `}>
              {unlockedCategories}/{totalCategories} unlocked
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="text-sm font-medium text-gray-700">
            {progress.percentage === 100 
              ? "🎉 Amazing! You've mastered all vocabulary!"
              : progress.percentage >= 75
                ? "🌟 You're doing great! Almost there!"
                : progress.percentage >= 50
                  ? "💪 Good progress! Keep it up!"
                  : progress.percentage >= 25
                    ? "📚 Nice start! Continue learning!"
                    : "🚀 Begin your vocabulary journey!"
            }
          </div>
        </div>
      </div>
    </div>
  );
};
