"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { toast } from 'react-hot-toast';

import { useLearningPage } from '@/hooks/useLearningPage';
import { LoadingSpinner } from '@/shared/components/spinner';

interface LearningPageProps {
  params: {
    topicId: string;
  };
}

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;
  
  // Use custom hook for all learning page logic
  const {
    topic,
    topicVocabs,
    isLoadingTopic,
    isLoadingVocabs,
    currentWord,
    currentWordIndex,
    totalWords,
    progress,
    showMeaning,
    isComplete,
    isSpeaking,
    isUpdating,
    isClient,
    knownWordsCount,
    completionRate,
    speakWord,
    handleContinue,
    handleAlreadyKnow,
    handleRevealMeaning,
    handleRestart,
  } = useLearningPage(topicId);

  // Redirect if topic not found
  useEffect(() => {
    if (!isLoadingTopic && !topic && topicId) {
      toast.error('Topic not found');
      router.push("/learn-vocabulary");
    }
  }, [isLoadingTopic, topic, topicId, router]);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return <LoadingSpinner.Page label="Initializing..." />;
  }

  // Show loading while fetching topic or vocabs
  if (isLoadingTopic || isLoadingVocabs) {
    return isLoadingTopic ? <LoadingSpinner.Topic /> : <LoadingSpinner.Vocabulary />;
  }

  if (topicVocabs.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No vocabulary found for this topic</h2>
          <Button
            onClick={() => router.push("/learn-vocabulary")}
            color="primary"
            startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
          >
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Topic not found</h2>
          <Button
            onClick={() => router.push("/learn-vocabulary")}
            color="primary"
            startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
          >
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            {/* Success Animation */}
            <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-8 relative">
              <span className="text-6xl animate-bounce">🎉</span>
              <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Topic Completed!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Great job completing "{topic?.title || 'this topic'}"
            </p>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">{totalWords}</div>
                  <div className="text-sm text-gray-600">Words Studied</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">{knownWordsCount}</div>
                  <div className="text-sm text-gray-600">Words Known</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">{completionRate}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleRestart}
                color="success"
                size="lg"
                className="w-full max-w-md mx-auto h-12 font-semibold"
                startContent={<Icon icon="mdi:refresh" className="text-xl" />}
              >
                Study Again
              </Button>
              <Button
                onClick={() => router.push("/learn-vocabulary")}
                color="default"
                variant="flat"
                size="lg"
                className="w-full max-w-md mx-auto h-12 font-semibold"
                startContent={<Icon icon="mdi:arrow-left" className="text-xl" />}
              >
                Back to Categories
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Learning Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => router.push("/learn-vocabulary")}
              color="primary"
              variant="light"
              size="sm"
              startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
            >
              Back to Topics
            </Button>
            <div className="text-sm text-gray-500">
              {currentWordIndex + 1} of {totalWords}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-gray-600">
            {progress}% Complete - {topic?.title}
          </div>
        </div>

        {/* Word Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

          <div className="relative z-10 text-center">
            {/* Word */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-5xl font-bold text-gray-900">
                  {currentWord?.word}
                </h2>
                <button
                  onClick={() => currentWord && speakWord(currentWord.word)}
                  disabled={isSpeaking}
                  className={`
                    inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                    ${isSpeaking 
                      ? 'bg-blue-200 text-blue-700 scale-110' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110'
                    }
                  `}
                  title="Pronounce word"
                >
                  <Icon 
                    icon={isSpeaking ? "mdi:volume-high" : "mdi:volume"} 
                    className={`text-xl ${isSpeaking ? 'animate-pulse' : ''}`} 
                  />
                </button>
              </div>
              
              {!showMeaning ? (
                <Button
                  onClick={handleRevealMeaning}
                  color="primary"
                  variant="ghost"
                  size="lg"
                  startContent={<Icon icon="mdi:eye" className="text-lg" />}
                >
                  Show Meaning
                </Button>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-2xl font-semibold text-blue-600">
                    {currentWord?.meaning}
                  </p>
                  {currentWord?.example && (
                    <div className="bg-gray-50 rounded-xl p-4 relative">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-gray-700 italic flex-1">
                          "{currentWord.example}"
                        </p>
                        <button
                          onClick={() => currentWord?.example && speakWord(currentWord.example)}
                          disabled={isSpeaking}
                          className={`
                            inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 flex-shrink-0
                            ${isSpeaking 
                              ? 'bg-blue-200 text-blue-700' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            }
                          `}
                          title="Pronounce example"
                        >
                          <Icon 
                            icon={isSpeaking ? "mdi:volume-high" : "mdi:volume"} 
                            className={`text-sm ${isSpeaking ? 'animate-pulse' : ''}`} 
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleAlreadyKnow}
            isLoading={isUpdating}
            color="success" variant="flat"
            size="lg"
            className="h-14 font-semibold"
            startContent={!isUpdating && <Icon icon="mdi:check-circle" className="text-xl" />}
          >
            {isUpdating ? "Updating..." : "Already Know This"}
          </Button>
          <Button
            onClick={handleContinue}
            isDisabled={!showMeaning || isUpdating}
            color={showMeaning ? "primary" : "default"}
            variant="solid"
            size="lg"
            className="h-14 font-semibold"
            startContent={<Icon icon="mdi:arrow-right" className="text-xl" />}
          >
            Continue
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-6 text-sm text-gray-500">
          {!showMeaning 
            ? "Reveal the meaning first, then choose your action"
            : "Choose 'Already Know This' to mark as learned, or 'Continue' to move on"
          }
        </div>
      </div>
    </div>
  );
}
