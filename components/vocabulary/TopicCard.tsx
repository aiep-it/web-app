import { TopicData } from '@/services/types/topic';
import { Icon } from '@iconify/react';
import { Button } from '@heroui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { selectVocabsByTopic } from '@/store/slices/vocabSlice';
import { VocabLearningModal } from './VocabLearningModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFullPathFile } from '@/utils/expections';
import useVocabsSafe from '@/hooks/useVocabsSafe';
import { VocabColumn } from '@/services/types/vocab';

interface TopicCardProps {
  topic: TopicData;
  isWorkspace?: boolean; // Optional prop to indicate if this is for a workspace
}

// Default image for all topic cards
const DEFAULT_TOPIC_IMAGE =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

export function TopicCard({ topic, isWorkspace = false }: TopicCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { getVocabs, loading: vocabLoading } = useVocabsSafe();

  // Get all vocabs from Redux to calculate topic completion
  const allVocabs = useSelector((state: RootState) => state.vocab.vocabs);

  // Load vocabularies when modal opens (if not already loaded)
  useEffect(() => {
    if (allVocabs.length === 0 && !vocabLoading) {
      getVocabs({
        page: 1,
        size: 50,
        sort: [
          {
            field: VocabColumn.created_at,
            order: 'desc',
          },
        ],
        // filters: topic?.id
        // ? {
        //     topicId: topic.id,
        //   }
        // : {},
      });
    }
  }, [allVocabs.length, vocabLoading, getVocabs]);

  // Get vocabularies for this topic from Redux
  const topicVocabs = useSelector((state: RootState) => {
    try {
      const vocabs = selectVocabsByTopic(state, topic.id);

      // const vocabs = await getByTopicId(topic.id)
      console.log(
        `TopicCard[${topic.id}]: Found ${vocabs.length} vocabs:`,
        vocabs,
      );
      return vocabs;
    } catch (error) {
      console.error('Error selecting vocabs for topic:', topic.id, error);
      return [];
    }
  });

  // Calculate vocab count with fallback
  const vocabCount = Array.isArray(topicVocabs) ? topicVocabs.length : 0;

  // Calculate progress based on known vocabs
  const knownVocabs = topicVocabs.filter((vocab) => vocab.is_know).length;
  const progressPercentage =
    vocabCount > 0 ? Math.round((knownVocabs / vocabCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Topic Image */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
        <img
          src={
            topic.coverImage
              ? getFullPathFile(topic.coverImage)
              : DEFAULT_TOPIC_IMAGE
          }
          alt={topic.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to gradient if image fails to load
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

        {/* Stats - Horizontal Layout */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:book-2"
              className="text-blue-500 text-lg"
            />
            <div>
              <span className="font-bold text-gray-800 text-sm">
                {vocabCount}
              </span>
              <span className="text-xs text-gray-500 ml-1">Words</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:schedule"
              className="text-purple-500 text-lg"
            />
            <div>
              <span className="font-bold text-gray-800 text-sm">
                {Math.max(15, vocabCount * 2)}
              </span>
              <span className="text-xs text-gray-500 ml-1">mins</span>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:star"
              className="text-yellow-500 text-lg"
            />
            <div>
              <span className="font-bold text-gray-800 text-sm">
                {topic.suggestionLevel ? `Level ${topic.suggestionLevel}` : 'Medium'}
              </span>
            </div>
          </div> */}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-bold text-gray-800">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

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
            className="w-full  transition-all duration-300 shadow-sm mt-3"
            size="sm"
            color="primary"
            variant="faded"
            onPress={() => router.push(`/my-workspace/${topic.id}`)}
          >
            {/* <Icon icon="material-symbols:play-arrow" className="mr-1" /> */}
            Detail
          </Button>
        )}
      </div>

      {/* Vocab Learning Modal */}
      <VocabLearningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        topic={topic}
      />
    </div>
  );
}
