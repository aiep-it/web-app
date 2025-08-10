'use client';

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button, Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { RootState } from '@/store';
import { selectVocabsByTopic, updateVocabInStore, setVocabsForTopic } from '@/store/slices/vocabSlice';
import { updateVocab, fetchVocabsByTopicId, markDone } from '@/services/vocab';
import { getTopicId } from '@/services/topic';
import { VocabSearchPayload, VocabColumn } from '@/services/types/vocab';
import type { AppDispatch } from '@/store';

export default function LearnWorkspaceVocab() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const topicId = params?.topicId as string;
  
  // Get vocab data from Redux
  const vocabState = useSelector((state: RootState) => state.vocab);
  const topicVocabs = useSelector((state: RootState) => 
    selectVocabsByTopic(state, topicId)
  );
  
  // Topic state
  const [topic, setTopic] = useState<any>(null);
  const [isLoadingTopic, setIsLoadingTopic] = useState(true);
  
  // Learning state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Text-to-Speech function
  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
      if (isClient) {
        alert('Your browser does not support text-to-speech feature.');
      }
    }
  };

  // Load topic and vocabs
  useEffect(() => {
    if (topicId) {
      const loadData = async () => {
        setIsLoadingTopic(true);
        try {
          // Load topic data
          const topicData = await getTopicId(topicId);
          if (topicData) {
            setTopic(topicData);
          }

          // Load vocabularies
          const payload: VocabSearchPayload = {
            page: 1,
            size: 100, // Load all vocabs for the topic
            sort: [{ field: VocabColumn.created_at, order: 'desc' }]
          };

          const response = await fetchVocabsByTopicId(topicId, payload);
          
          if (response && !Array.isArray(response) && 'content' in response) {
            // Response is VocabListResponse
            dispatch(setVocabsForTopic({
              topicId: topicId,
              vocabs: response.content
            }));
          } else if (response && Array.isArray(response)) {
            // Response is direct array (fallback case)
            dispatch(setVocabsForTopic({
              topicId: topicId,
              vocabs: response
            }));
          }
        } catch (error) {
          console.error('Error loading data:', error);
          toast.error('Failed to load topic data');
        } finally {
          setIsLoadingTopic(false);
        }
      };

      loadData();
    }
  }, [topicId, dispatch]);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Check if all words are completed
    if (topicVocabs.length > 0 && currentWordIndex >= topicVocabs.length) {
      setIsComplete(true);
    }
  }, [currentWordIndex, topicVocabs.length]);

  useEffect(() => {
    // Cleanup speech synthesis when component unmounts
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (isLoadingTopic || !topicVocabs.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading workspace vocabulary...</h2>
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
            onClick={() => router.push("/my-workspace")}
            color="primary"
            startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
          >
            Back to My Workspace
          </Button>
        </div>
      </div>
    );
  }

  const currentWord = topicVocabs[currentWordIndex];
  const totalWords = topicVocabs.length;
  const progress = Math.round(((currentWordIndex) / totalWords) * 100);

  const handleContinue = () => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleAlreadyKnow = async () => {
    if (currentWord) {
      setIsUpdating(true);
      try {
        // Update via API
        // await updateVocab(currentWord.id, {
        //   word: currentWord.word,
        //   meaning: currentWord.meaning,
        //   example: currentWord.example,
        //   imageUrl: currentWord.imageUrl,
        //   audioUrl: currentWord.audioUrl,
        //   is_learned: true,
        //   topicId: currentWord.topicId,
        // });
        
        // // Update Redux store
        // dispatch(updateVocabInStore({
        //   ...currentWord,
        //   is_learned: true
        // }));
        await markDone(currentWord.id);
        
        // Show success feedback
        toast.success("Marked as known!");
      } catch (error) {
        console.error('Error updating vocab:', error);
        toast.error("Failed to update. Please try again.");
      } finally {
        setIsUpdating(false);
      }
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
    const knownWordsCount = topicVocabs.filter(word => word.is_learned).length;
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
              Workspace Topic Completed!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Great job completing "{topic?.title || 'this topic'}" from your workspace
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
                onClick={() => router.push(`/my-workspace/${topicId}`)}
                color="default"
                variant="flat"
                size="lg"
                className="w-full max-w-md mx-auto h-12 font-semibold"
                startContent={<Icon icon="mdi:arrow-left" className="text-xl" />}
              >
                Back to Topic Detail
              </Button>
              <Button
                onClick={() => router.push("/my-workspace")}
                color="default"
                variant="light"
                size="lg"
                className="w-full max-w-md mx-auto h-12 font-semibold"
                startContent={<Icon icon="mdi:home" className="text-xl" />}
              >
                Back to My Workspace
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
              onClick={() => router.push(`/my-workspace/${topicId}`)}
              color="primary"
              variant="light"
              size="sm"
              startContent={<Icon icon="mdi:arrow-left" className="text-lg" />}
            >
              Back to Topic Detail
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
            {progress}% Complete - {topic?.title} (My Workspace)
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
