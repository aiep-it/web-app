'use client';

import { TopicCard } from '@/components/vocabulary/TopicCard';
import { Roadmap } from '@/services/types/roadmap';
import { TopicData } from '@/services/types/topic';
import { Icon } from '@iconify/react';

interface RoadmapSectionProps {
  roadmap: Roadmap;
  topics: TopicData[];
  isLoading?: boolean;
}

export function RoadmapSection({ roadmap, topics, isLoading }: RoadmapSectionProps) {
  return (
    <div className="mb-8">
      {/* Roadmap Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Icon
            icon="material-symbols:folder"
            className="text-blue-500"
          />
          {roadmap.name}
        </h2>
        {roadmap.description && (
          <p className="text-gray-600 mt-2">
            {roadmap.description}
          </p>
        )}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : topics?.length > 0 ? (
          topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Icon
              icon="material-symbols:quiz-outline"
              className="text-gray-300 text-6xl mb-4 mx-auto"
            />
            <p className="text-gray-500">
              No topics available in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

