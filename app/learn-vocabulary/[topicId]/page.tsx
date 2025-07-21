"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { useVocabulary } from "@/components/vocabulary/VocabularyContext";

interface LearningPageProps {
  params: {
    topicId: string;
  };
}

export default function LearningPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    getTopic, 
    isLoading, 
    markWordAsKnown, 
    isWordKnown, 
    markTopicAsCompleted,
    getTopicProgress
  } = useVocabulary();
  
  const topicId = params?.topicId as string;
  const topic = getTopic(topicId);
  
  // Learning state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text-to-Speech function
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Your browser does not support text-to-speech feature.');
    }
  };

  useEffect(() => {
    // If topic not found and data is loaded, redirect to main vocabulary page
    if (!topic && !isLoading) {
      router.push("/learn-vocabulary");
    }
  }, [topic, isLoading, router]);

  useEffect(() => {
    // Check if all words are completed
    if (topic && currentWordIndex >= topic.vocabulary.length) {
      setIsComplete(true);
    }
  }, [currentWordIndex, topic]);

  // Auto-mark topic as completed when progress reaches 100%
  useEffect(() => {
    if (topic && topicId) {
      const progress = getTopicProgress(topicId);
      if (progress === 100) {
        markTopicAsCompleted(topicId);
      }
    }
  }, [topic, topicId, getTopicProgress, markTopicAsCompleted]);

  useEffect(() => {
    // Cleanup speech synthesis when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading topic...</h2>
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
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  const currentWord = topic.vocabulary[currentWordIndex];
  const totalWords = topic.vocabulary.length;
  const progress = Math.round(((currentWordIndex) / totalWords) * 100);

  const handleContinue = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleAlreadyKnow = () => {
    if (currentWord) {
      markWordAsKnown(currentWord.id);
    }
    handleContinue();
  };

  const handleRevealMeaning = () => {
    setShowMeaning(true);
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setShowMeaning(false);
    setIsComplete(false);
  };

  // Completion Screen
  if (isComplete) {
    const knownWordsCount = topic.vocabulary.filter(word => isWordKnown(word.id)).length;
    const completionRate = Math.round((knownWordsCount / totalWords) * 100);

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
              Great job completing "{topic.name}"
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
              Back to Categories
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
            {progress}% Complete - {topic.name}
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
              {currentWord?.pronunciation && (
                <p className="text-lg text-gray-500 mb-4">
                  {currentWord.pronunciation}
                </p>
              )}
              
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
            color="success" variant="flat"
            size="lg"
            className="h-14 font-semibold"
            startContent={<Icon icon="mdi:check-circle" className="text-xl" />}
          >
            Already Know This
          </Button>
          <Button
            onClick={handleContinue}
            isDisabled={!showMeaning}
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
