"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Category, Topic, VocabularyWord, CategoryProgress, Exercise, ExerciseResult } from "@/types/vocabulary";
import { mockVocabularyData } from "@/data/vocabulary/mockData";
import { generateExercises } from "@/utils/vocabulary/exerciseUtils";

interface VocabularyContextType {
  categories: Category[];
  knownWordIds: string[];
  completedTopicIds: string[];
  exerciseResults: { [topicId: string]: ExerciseResult[] };
  isLoading: boolean;
  error: string | null;
  
  // Word management
  markWordAsKnown: (wordId: string) => void;
  markWordAsUnknown: (wordId: string) => void;
  isWordKnown: (wordId: string) => boolean;
  
  // Topic management
  markAllWordsInTopicAsKnown: (topicId: string) => void;
  markTopicAsCompleted: (topicId: string) => void;
  isTopicCompleted: (topicId: string) => boolean;
  getTopic: (topicId: string) => Topic | undefined;
  getTopicProgress: (topicId: string) => number;
  
  // Exercise management
  getExercisesForTopic: (topicId: string) => Exercise[];
  saveExerciseResult: (topicId: string, result: ExerciseResult) => void;
  getExerciseResults: (topicId: string) => ExerciseResult[];
  
  // Category management
  getCategoryProgress: (categoryId: string) => CategoryProgress;
  unlockNextTopic: (currentTopicId: string) => void;
  
  // Overall progress
  getOverallProgress: () => {
    totalWords: number;
    knownWords: number;
    percentage: number;
  };
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [knownWordIds, setKnownWordIds] = useState<string[]>([]);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [exerciseResults, setExerciseResults] = useState<{ [topicId: string]: ExerciseResult[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    try {
      setIsLoading(true);
      // In real app, this would be an API call
      setTimeout(() => {
        setCategories(mockVocabularyData);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to load vocabulary data");
      setIsLoading(false);
    }
  }, []);

  // Load known words from localStorage
  useEffect(() => {
    const savedKnownWords = localStorage.getItem("knownWordIds");
    if (savedKnownWords) {
      setKnownWordIds(JSON.parse(savedKnownWords));
    }
  }, []);

  // Load completed topics from localStorage
  useEffect(() => {
    const savedCompletedTopics = localStorage.getItem("completedTopicIds");
    if (savedCompletedTopics) {
      setCompletedTopicIds(JSON.parse(savedCompletedTopics));
    }
  }, []);

  // Save known words to localStorage
  useEffect(() => {
    localStorage.setItem("knownWordIds", JSON.stringify(knownWordIds));
  }, [knownWordIds]);

  // Save completed topics to localStorage
  useEffect(() => {
    localStorage.setItem("completedTopicIds", JSON.stringify(completedTopicIds));
  }, [completedTopicIds]);

  const markWordAsKnown = (wordId: string) => {
    setKnownWordIds(prev => {
      if (!prev.includes(wordId)) {
        return [...prev, wordId];
      }
      return prev;
    });
  };

  const markWordAsUnknown = (wordId: string) => {
    setKnownWordIds(prev => prev.filter(id => id !== wordId));
  };

  const isWordKnown = (wordId: string) => {
    return knownWordIds.includes(wordId);
  };

  const markAllWordsInTopicAsKnown = (topicId: string) => {
    const topic = getTopic(topicId);
    if (topic) {
      const wordIds = topic.vocabulary.map(word => word.id);
      setKnownWordIds(prev => {
        const newKnownIds = [...prev];
        wordIds.forEach(wordId => {
          if (!newKnownIds.includes(wordId)) {
            newKnownIds.push(wordId);
          }
        });
        return newKnownIds;
      });
    }
  };

  const getTopic = (topicId: string): Topic | undefined => {
    for (const category of categories) {
      const topic = category.topics.find(t => t.id === topicId);
      if (topic) return topic;
    }
    return undefined;
  };

  const getTopicProgress = (topicId: string): number => {
    const topic = getTopic(topicId);
    if (!topic || topic.vocabulary.length === 0) return 0;
    
    const knownWordsCount = topic.vocabulary.filter(word => 
      knownWordIds.includes(word.id)
    ).length;
    
    return Math.round((knownWordsCount / topic.vocabulary.length) * 100);
  };

  const getCategoryProgress = (categoryId: string): CategoryProgress => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      return {
        categoryId,
        categoryName: "",
        totalTopics: 0,
        completedTopics: 0,
        totalWords: 0,
        knownWords: 0,
        overallProgress: 0
      };
    }

    const totalWords = category.topics.reduce(
      (sum, topic) => sum + topic.vocabulary.length, 0
    );
    
    const knownWords = category.topics.reduce((sum, topic) => {
      return sum + topic.vocabulary.filter(word => knownWordIds.includes(word.id)).length;
    }, 0);

    const completedTopics = category.topics.filter(topic => 
      getTopicProgress(topic.id) === 100
    ).length;

    const overallProgress = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;

    return {
      categoryId: category.id,
      categoryName: category.name,
      totalTopics: category.topics.length,
      completedTopics,
      totalWords,
      knownWords,
      overallProgress
    };
  };

  const unlockNextTopic = (currentTopicId: string) => {
    // Find the current topic and unlock the next one if current is completed
    const progress = getTopicProgress(currentTopicId);
    if (progress === 100) {
      setCategories(prev => {
        return prev.map(category => ({
          ...category,
          topics: category.topics.map(topic => {
            const currentTopicIndex = category.topics.findIndex(t => t.id === currentTopicId);
            const isNextTopic = category.topics.indexOf(topic) === currentTopicIndex + 1;
            
            if (isNextTopic) {
              return { ...topic, isLocked: false };
            }
            return topic;
          })
        }));
      });
    }
  };

  const markTopicAsCompleted = (topicId: string) => {
    setCompletedTopicIds(prev => {
      if (!prev.includes(topicId)) {
        return [...prev, topicId];
      }
      return prev;
    });
  };

  const isTopicCompleted = (topicId: string): boolean => {
    return completedTopicIds.includes(topicId);
  };

  const getExercisesForTopic = (topicId: string): Exercise[] => {
    const topic = getTopic(topicId);
    if (!topic) return [];
    
    return generateExercises(topic.vocabulary, topicId);
  };

  const saveExerciseResult = (topicId: string, result: ExerciseResult) => {
    setExerciseResults(prev => ({
      ...prev,
      [topicId]: [...(prev[topicId] || []), result]
    }));
  };

  const getExerciseResults = (topicId: string): ExerciseResult[] => {
    return exerciseResults[topicId] || [];
  };

  const getOverallProgress = () => {
    const totalWords = categories.reduce(
      (sum, category) => sum + category.topics.reduce(
        (topicSum, topic) => topicSum + topic.vocabulary.length, 0
      ), 0
    );
    
    const knownWords = knownWordIds.length;
    const percentage = totalWords > 0 ? Math.round((knownWords / totalWords) * 100) : 0;
    
    return {
      totalWords,
      knownWords,
      percentage
    };
  };

  const value: VocabularyContextType = {
    categories,
    knownWordIds,
    completedTopicIds,
    exerciseResults,
    isLoading,
    error,
    markWordAsKnown,
    markWordAsUnknown,
    isWordKnown,
    markAllWordsInTopicAsKnown,
    markTopicAsCompleted,
    isTopicCompleted,
    getTopic,
    getTopicProgress,
    getExercisesForTopic,
    saveExerciseResult,
    getExerciseResults,
    getCategoryProgress,
    unlockNextTopic,
    getOverallProgress
  };

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error("useVocabulary must be used within a VocabularyProvider");
  }
  return context;
}
