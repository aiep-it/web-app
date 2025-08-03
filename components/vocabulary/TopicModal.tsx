'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { selectVocabsByTopic } from '@/store/slices/vocabSlice';
import { Category, Topic } from '@/types/vocabulary';
import { useVocabulary } from './VocabularyContext';
import { useRouter } from 'next/navigation';
import { useVocabsSafe } from '@/hooks/useVocabsSafe';
import { VocabColumn } from '@/services/types/vocab';

interface TopicModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

const TopicCard: React.FC<{
  topic: Topic;
  onStartTopic: (topicId: string) => void;
  onDoExercise: (topicId: string) => void;
  progress: number;
  isCompleted: boolean;
}> = ({ topic, onStartTopic, onDoExercise, progress, isCompleted }) => {
  return (
    <div
      className={`
        relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        transition-all duration-300 cursor-pointer group
        ${
          topic.isLocked
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1'
        }
      `}
      onClick={() => !topic.isLocked && onStartTopic(topic.id)}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/30 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-100/30 rounded-full translate-y-6 -translate-x-6"></div>

      {/* Lock Overlay */}
      {topic.isLocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="relative z-20 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`
              w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg
              transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
              ${
                topic.isLocked
                  ? 'bg-gray-200 text-gray-500 shadow-gray-300/50'
                  : isCompleted
                    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-500/30'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-500/30'
              }
            `}
            >
              {topic.isLocked ? '🔒' : isCompleted ? '✓' : topic.order}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {topic.name}
              </h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                {topic.vocabulary.length} vocabulary words
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
            {topic.isLocked ? (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full border border-amber-200 shadow-sm">
                🔒 Locked
              </span>
            ) : isCompleted ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200 shadow-sm">
                ✅ Complete
              </span>
            ) : progress > 0 ? (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200 shadow-sm">
                📚 {progress}%
              </span>
            ) : (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full border border-purple-200 shadow-sm">
                ✨ New
              </span>
            )}
          </div>
        </div>

        {topic.description && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              {topic.description}
            </p>
          </div>
        )}

        {/* Progress Section */}
        {!topic.isLocked && (
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Learning Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {progress}%
              </span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
              {progress > 0 && (
                <div
                  className="absolute top-0 h-full w-1 bg-white/60 rounded-full"
                  style={{ left: `${Math.max(0, progress - 1)}%` }}
                />
              )}
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>
                {Math.round((progress / 100) * topic.vocabulary.length)} words
                learned
              </span>
              <span>
                {topic.vocabulary.length -
                  Math.round((progress / 100) * topic.vocabulary.length)}{' '}
                remaining
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`
            w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform
            ${
              topic.isLocked
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                : isCompleted
                  ? `
                  bg-gradient-to-r from-green-500 to-green-600 text-white 
                  hover:from-green-600 hover:to-green-700 active:scale-95 
                  shadow-lg hover:shadow-xl border-2 border-green-300/50
                `
                  : `
                  bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                  hover:from-blue-600 hover:to-blue-700 active:scale-95 
                  shadow-lg hover:shadow-xl border-2 border-blue-300/50
                `
            }
          `}
          disabled={topic.isLocked}
          onClick={(e) => {
            e.stopPropagation();
            !topic.isLocked && onStartTopic(topic.id);
          }}
        >
          <div className="flex items-center justify-center gap-2">
            {topic.isLocked ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Complete previous topics first
              </>
            ) : isCompleted ? (
              <>
                <span>Review Topic</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : progress > 0 ? (
              <>
                <span>Continue Learning</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Start Learning</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </div>
        </button>

        {/* Exercise Button - Always show for testing */}
        <button
          className="w-full mt-3 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform
                       bg-gradient-to-r from-purple-500 to-purple-600 text-white 
                       hover:from-purple-600 hover:to-purple-700 active:scale-95 
                       shadow-md hover:shadow-lg border-2 border-purple-300/50"
          onClick={(e) => {
            e.stopPropagation();
            onDoExercise(topic.id);
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Quiz</span>
            {isCompleted || progress === 100 ? (
              <span className="text-xs bg-green-400 px-2 py-1 rounded">✓</span>
            ) : (
              <span className="text-xs bg-orange-400 px-2 py-1 rounded">
                TEST
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Achievement Badge for Completed Topics */}
      {(isCompleted || progress === 100) && !topic.isLocked && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export const TopicModal: React.FC<TopicModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const { getTopicProgress, getCategoryProgress, isTopicCompleted } =
    useVocabulary();
  const router = useRouter();
  const { getVocabs, loading: vocabLoading } = useVocabsSafe();

  // Get all vocabs from Redux to calculate topic completion
  const allVocabs = useSelector((state: RootState) => state.vocab.vocabs);

  // Load vocabularies when modal opens (if not already loaded)
  useEffect(() => {
    if (isOpen && allVocabs.length === 0 && !vocabLoading) {
      console.log('[TopicModal] Loading vocabularies...');
      getVocabs({
        page: 1,
        size: 50,
        sort: [
          {
            field: VocabColumn.created_at,
            order: 'desc',
          },
        ],
      });
    }
  }, [isOpen, allVocabs.length, vocabLoading, getVocabs]);

  // Helper function to calculate topic completion using Redux data
  const getTopicCompletionFromRedux = (topicId: string) => {
    try {
      const topicVocabs = allVocabs.filter(
        (vocab) => vocab.topicId === topicId,
      );

      if (!Array.isArray(topicVocabs) || topicVocabs.length === 0) {
        return { progress: 0, isCompleted: false };
      }

      const knownVocabs = topicVocabs.filter((vocab) => vocab.is_learned).length;
      const progress = Math.round((knownVocabs / topicVocabs.length) * 100);
      const isCompleted = progress === 100;

      return { progress, isCompleted };
    } catch (error) {
      console.error('Error calculating topic completion:', error);
      return { progress: 0, isCompleted: false };
    }
  };

  if (!category || !isOpen) return null;

  const categoryProgress = getCategoryProgress(category.id);

  const handleStartTopic = (topicId: string) => {
    onClose();
    router.push(`/learn-vocabulary/${topicId}`);
  };

  const handleDoExercise = (topicId: string) => {
    onClose();
    router.push(`/learn-vocabulary/exercise/${topicId}/quiz`);
  };

  const handleTypeAnswer = (topicId: string) => {
    onClose();
    router.push(`/learn-vocabulary/exercise/${topicId}/type-answer`);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header with Gradient Background */}
        <div
          className="relative p-8 text-white overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${
              category.color?.replace('bg-', '') === 'blue-500'
                ? '#3b82f6'
                : category.color?.replace('bg-', '') === 'green-500'
                  ? '#10b981'
                  : category.color?.replace('bg-', '') === 'purple-500'
                    ? '#8b5cf6'
                    : category.color?.replace('bg-', '') === 'orange-500'
                      ? '#f97316'
                      : '#3b82f6'
            } 0%, ${
              category.color?.replace('bg-', '') === 'blue-500'
                ? '#1e40af'
                : category.color?.replace('bg-', '') === 'green-500'
                  ? '#047857'
                  : category.color?.replace('bg-', '') === 'purple-500'
                    ? '#6d28d9'
                    : category.color?.replace('bg-', '') === 'orange-500'
                      ? '#ea580c'
                      : '#1e40af'
            } 100%)`,
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
              {category.icon || '📖'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {category.description}
              </p>

              {/* Category Progress Summary */}
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white/90 text-sm font-medium">
                    Overall Progress: {categoryProgress.overallProgress}%
                  </div>
                  <div className="text-white/90 text-sm">
                    {categoryProgress.completedTopics}/
                    {categoryProgress.totalTopics} topics completed
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all duration-500 ease-out"
                    style={{ width: `${categoryProgress.overallProgress}%` }}
                  />
                  {categoryProgress.overallProgress > 0 && (
                    <div
                      className="absolute top-0 h-full w-1 bg-white/40 rounded-full"
                      style={{
                        left: `${Math.max(0, categoryProgress.overallProgress - 1)}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-white/70">
                  <span>{categoryProgress.knownWords} words learned</span>
                  <span>
                    {categoryProgress.totalWords - categoryProgress.knownWords}{' '}
                    remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center text-white/90 hover:text-white transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[60vh] bg-gradient-to-b from-gray-50/50 to-white">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Learning Topics
              </h3>
              <p className="text-gray-600 text-sm">
                Choose a topic to start your vocabulary journey. Complete them
                in order to unlock new challenges!
              </p>
            </div>

            <div className="grid gap-6">
              {category.topics
                .sort((a, b) => a.order - b.order)
                .map((topic) => {
                  const { progress, isCompleted } = getTopicCompletionFromRedux(
                    topic.id,
                  );
                  return (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onStartTopic={handleStartTopic}
                      onDoExercise={handleDoExercise}
                      progress={progress}
                      isCompleted={isCompleted}
                    />
                  );
                })}
            </div>

            {/* Motivational Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Ready to Master {category.name}?
              </h4>
              <p className="text-gray-600 text-sm">
                Complete all topics to unlock the next category and expand your
                vocabulary!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Practice regularly for better retention
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-gray-700 hover:text-gray-900 font-medium rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
