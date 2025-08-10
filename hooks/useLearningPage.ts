import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { RootState } from '@/store';
import { getTopicId } from '@/services/topic';
import { markDone } from '@/services/vocab';
import { TopicData } from '@/services/types/topic';
import { VocabData } from '@/services/types/vocab';
import { useVocabs } from './useVocabs';

export const useLearningPage = (topicId: string) => {
  // Use vocabs hook
  const { fetchVocabsByTopicId } = useVocabs();
  
  // State management
  const [currentTopic, setCurrentTopic] = useState<TopicData | null>(null);
  const [isLoadingTopic, setIsLoadingTopic] = useState(true);
  const [topicVocabs, setTopicVocabs] = useState<VocabData[]>([]);
  const [isLoadingVocabs, setIsLoadingVocabs] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Redux selectors
  const topicState = useSelector((state: RootState) => state.topic);

  // Derived values
  const topic = useMemo(() => {
    // First try to get from Redux state
    const allTopics = Object.values(topicState.topicsByRoadmap).flat();
    const reduxTopic = allTopics.find(t => t.id === topicId);
    
    // If not found in Redux, use the one fetched from API
    return reduxTopic || currentTopic;
  }, [topicState.topicsByRoadmap, topicId, currentTopic]);

  const currentWord = topicVocabs[currentWordIndex];
  const totalWords = topicVocabs.length;
  const progress = Math.round(((currentWordIndex) / totalWords) * 100);

  // Fetch topic by ID
  const fetchTopic = useCallback(async () => {
    if (!topicId) return;
    
    // Check if topic exists in Redux first
    const allTopics = Object.values(topicState.topicsByRoadmap).flat();
    const reduxTopic = allTopics.find(t => t.id === topicId);
    
    if (reduxTopic) {
      setCurrentTopic(reduxTopic);
      setIsLoadingTopic(false);
      return;
    }
    
    // If not in Redux, fetch from API
    try {
      setIsLoadingTopic(true);
      const topicData = await getTopicId(topicId);
      if (topicData) {
        setCurrentTopic(topicData);
      } else {
        console.error('Topic not found');
        toast.error('Topic not found');
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Failed to load topic');
    } finally {
      setIsLoadingTopic(false);
    }
  }, [topicId, topicState.topicsByRoadmap]);

  // Fetch vocabs by topicId using the vocabs hook
  const fetchVocabsByTopic = useCallback(async () => {
    if (!topicId) return;
    
    try {
      setIsLoadingVocabs(true);
      const vocabsData = await fetchVocabsByTopicId(topicId);
      setTopicVocabs(vocabsData);
      
      if (vocabsData.length === 0) {
        console.log('No vocabs found for topic:', topicId);
      }
    } catch (error) {
      console.error('Error fetching vocabs by topic:', error);
      toast.error('Failed to load vocabulary');
      setTopicVocabs([]);
    } finally {
      setIsLoadingVocabs(false);
    }
  }, [topicId, fetchVocabsByTopicId]);

  // Text-to-Speech function
  const speakWord = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
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
  }, [isClient]);

  // Navigation handlers
  const handleContinue = useCallback(() => {
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowMeaning(false);
    } else {
      setIsComplete(true);
    }
  }, [currentWordIndex, totalWords]);

  const handleAlreadyKnow = useCallback(async () => {
    if (currentWord) {
      setIsUpdating(true);
      try {
        await markDone(currentWord.id);
        
        // Update local state to mark as learned
        setTopicVocabs(prevVocabs => 
          prevVocabs.map(vocab => 
            vocab.id === currentWord.id 
              ? { ...vocab, is_learned: true }
              : vocab
          )
        );
        
        toast.success("Marked as known!");
      } catch (error) {
        console.error('Error updating vocab:', error);
        toast.error("Failed to update. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    }
    handleContinue();
  }, [currentWord, handleContinue]);

  const handleRevealMeaning = useCallback(() => {
    setShowMeaning(true);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentWordIndex(0);
    setShowMeaning(false);
    setIsComplete(false);
  }, []);

  // Effects
  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  useEffect(() => {
    fetchVocabsByTopic();
  }, [fetchVocabsByTopic]);

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

  // Stats for completion screen
  const knownWordsCount = topicVocabs.filter(word => word.is_learned).length;
  const completionRate = Math.round((knownWordsCount / totalWords) * 100);

  return {
    // State
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
    
    // Actions
    speakWord,
    handleContinue,
    handleAlreadyKnow,
    handleRevealMeaning,
    handleRestart,
    
    // Utils
    fetchTopic,
    fetchVocabsByTopic,
  };
};

export default useLearningPage;
