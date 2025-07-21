"use client";

import { useState, useEffect } from "react";
import { Exercise, ExerciseResult } from "@/types/vocabulary";
import { useVocabulary } from "@/components/vocabulary/VocabularyContext";

export function useExercise(topicId: string) {
  const { 
    getExercisesForTopic, 
    saveExerciseResult, 
    markTopicAsCompleted, 
    markAllWordsInTopicAsKnown 
  } = useVocabulary();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentExercise = exercises[currentExerciseIndex];
  const progress = Math.round(((currentExerciseIndex + 1) / exercises.length) * 100);

  // Initialize exercises
  useEffect(() => {
    const exerciseList = getExercisesForTopic(topicId);
    setExercises(exerciseList);
  }, [topicId, getExercisesForTopic]);

  // Reset start time when moving to next exercise
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentExerciseIndex]);

  const handleSubmitAnswer = () => {
    if (!currentExercise) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const correct = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase();
    
    setIsCorrect(correct);
    setShowResult(true);

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentExercise.correctAnswer,
      isCorrect: correct,
      timeSpent
    };

    setResults(prev => [...prev, result]);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setUserAnswer("");
      setShowResult(false);
    } else {
      // Save all results including the current one and mark topic as completed
      const finalResults = [...results];
      finalResults.forEach(result => {
        saveExerciseResult(topicId, result);
      });
      
      // Mark all words in the topic as known and mark topic as completed
      markAllWordsInTopicAsKnown(topicId);
      markTopicAsCompleted(topicId);
      setIsComplete(true);
    }
  };

  const handleRetry = () => {
    setUserAnswer("");
    setShowResult(false);
    setStartTime(Date.now());
  };

  const resetExercise = () => {
    setCurrentExerciseIndex(0);
    setResults([]);
    setIsComplete(false);
    setUserAnswer("");
    setShowResult(false);
  };

  return {
    // State
    exercises,
    currentExercise,
    currentExerciseIndex,
    userAnswer,
    showResult,
    isCorrect,
    results,
    isComplete,
    progress,
    
    // Actions
    setUserAnswer,
    handleSubmitAnswer,
    handleNextExercise,
    handleRetry,
    resetExercise
  };
}
