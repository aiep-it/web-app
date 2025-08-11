import { TopicData } from '@/services/types/topic';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/button';
import { VocabLearningModal } from './VocabLearningModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCmsAssetUrl } from '@/utils/index';
import { CONTENT } from '@/constant/content';

interface TopicCardProps {
  topic: TopicData;
  isWorkspace?: boolean; // Optional prop to indicate if this is for a workspace
}

export function TopicCard({ topic, isWorkspace = false }: TopicCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Topic Image */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
        <img
          src={
            topic.coverImage
              ? getCmsAssetUrl(topic.coverImage)
              : CONTENT.DEFAULT_TOPIC_IMAGE
          }
          alt={topic.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />

        {/* Gradient Fallback */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white"
          style={{ display: 'none' }}
        >
          <div className="text-center">
            <Icon
              icon="material-symbols:quiz"
              className="text-4xl mb-1 mx-auto opacity-80"
            />
            <div className="text-sm font-semibold opacity-90">
              {topic.title}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              topic.status === 'SETTUPED'
                ? 'bg-green-500/90 text-white'
                : topic.status === 'INIT'
                  ? 'bg-yellow-500/90 text-white'
                  : 'bg-gray-500/90 text-white'
            }`}
          >
            {topic.status === 'SETTUPED'
              ? 'ACTIVE'
              : topic.status === 'INIT'
                ? 'DRAFT'
                : 'REMOVED'}
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Icon
              icon="material-symbols:signal-cellular-alt"
              className="text-orange-300 text-sm"
            />
            <span>Level {topic.suggestionLevel}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-gray-800 text-medium mb-2 line-clamp-2">
          {topic.title}
        </h3>

        {/* Description */}
        {topic.description ? (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {topic.description}
          </p>
        ) : (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            No description for this topic.
          </p>
        )}

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
          size="sm"
          onPress={() => setIsModalOpen(true)}
        >
          <Icon icon="material-symbols:play-arrow" className="mr-1" />
          Start Learning
        </Button>
        {isWorkspace && (
          <Button
            className="w-full transition-all duration-300 shadow-sm mt-3 h-8"
            size="sm"
            color="primary"
            variant="bordered"
            onPress={() => router.push(`/my-workspace/${topic.id}`)}
          >
            <Icon icon="material-symbols:info-outline" className="mr-1 text-sm" />
            Detail
          </Button>
        )}
      </div>

      {/* Vocab Learning Modal */}
      <VocabLearningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={topic}
        isWorkspace={isWorkspace}
      />
    </div>
  );
}
