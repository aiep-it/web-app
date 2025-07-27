"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/types/vocabulary";
import Link from "next/link";

interface Topic {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalWords: number;
  learnedWords: number;
  isCompleted: boolean;
}

interface CategorySectionProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  isExpanded,
  onToggle
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for topics - replace with real API call
  const mockTopics: Topic[] = [
    {
      id: "1",
      name: "Basic Greetings",
      description: "Learn essential greeting words and phrases",
      progress: 75,
      totalWords: 20,
      learnedWords: 15,
      isCompleted: false
    },
    {
      id: "2", 
      name: "Family Members",
      description: "Vocabulary related to family relationships",
      progress: 100,
      totalWords: 25,
      learnedWords: 25,
      isCompleted: true
    },
    {
      id: "3",
      name: "Daily Activities",
      description: "Common verbs for everyday activities",
      progress: 40,
      totalWords: 30,
      learnedWords: 12,
      isCompleted: false
    }
  ];

  useEffect(() => {
    if (isExpanded && topics.length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTopics(mockTopics);
        setIsLoading(false);
      }, 500);
    }
  }, [isExpanded]);

  const getCategoryProgress = () => {
    if (topics.length === 0) return 0;
    const totalProgress = topics.reduce((sum, topic) => sum + topic.progress, 0);
    return Math.round(totalProgress / topics.length);
  };

  const getCategoryIcon = () => {
    return category.icon || "📚";
  };

  const getCategoryColor = () => {
    switch(category.color?.replace('bg-', '')) {
      case 'blue-500': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'green-500': return 'bg-green-50 border-green-200 text-green-700';
      case 'purple-500': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'pink-500': return 'bg-pink-50 border-pink-200 text-pink-700';
      case 'yellow-500': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'red-500': return 'bg-red-50 border-red-200 text-red-700';
      case 'orange-500': return 'bg-orange-50 border-orange-200 text-orange-700';
      default: return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Category Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Category Icon */}
            <div className={`w-12 h-12 rounded-lg ${getCategoryColor()} flex items-center justify-center text-2xl border`}>
              {getCategoryIcon()}
            </div>
            
            {/* Category Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCategoryProgress()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {getCategoryProgress()}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Expand Arrow */}
          <div className="ml-4">
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Topics List */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
              <p className="text-gray-600">Loading topics...</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/learn-vocabulary/${category.id}/topics/${topic.id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {topic.name}
                          </h4>
                          {topic.isCompleted && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {topic.description}
                        </p>
                        
                        {/* Topic Progress */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-sm">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                topic.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${topic.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {topic.learnedWords}/{topic.totalWords} words
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="ml-4">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors group-hover:shadow-sm">
                          {topic.isCompleted ? 'Review' : topic.progress > 0 ? 'Continue' : 'Start'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
