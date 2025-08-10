'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Spinner, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useExercisesWithFetch } from '@/hooks/useExercisesWithFetch';
import { useDirectusExercise } from '@/hooks/useDirectusExercise';
import { mergeExercisesWithDirectusData } from '@/utils/exerciseHelper';
import { DoTypeAnswerExercise, DoTypeAnswerState } from './types';
import { CustomButton } from '@/shared/components';

// Exercise Card Component
const DoTypeAnswerExerciseCard: React.FC<{
  exercise: DoTypeAnswerExercise;
  userAnswer: string;
  showResult: boolean;
  isCorrect: boolean | null;
  onAnswerSubmit: (answer: string) => void;
  onNext: () => void;
  isLastExercise: boolean;
}> = ({
  exercise,
  userAnswer,
  showResult,
  isCorrect,
  onAnswerSubmit,
  onNext,
  isLastExercise,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = () => {
    if (currentAnswer.trim()) {
      onAnswerSubmit(currentAnswer.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult && currentAnswer.trim()) {
      handleSubmit();
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    setCurrentAnswer('');
    onNext();
  };

  return (
    <Card className="w-full shadow-xl">
      <CardBody className="p-8">
        <div className="space-y-6">
          {/* Exercise Type Badge */}
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              exercise.type === 'image' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              <Icon 
                icon={exercise.type === 'image' ? 'mdi:image' : 'mdi:volume-high'} 
                className="text-lg" 
              />
              <span>{exercise.type === 'image' ? 'Image' : 'Audio'} Exercise</span>
            </div>
          </div>

          {/* Content */}
          {exercise.content && (
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">{exercise.content}</p>
            </div>
          )}

          {/* Media Display */}
          <div className="flex justify-center">
            {exercise.type === 'image' && exercise.imageUrl ? (
              <div className="relative">
                <img
                  src={exercise.imageUrl}
                  alt="Exercise"
                  className="max-w-full max-h-64 rounded-lg shadow-lg object-contain"
                />
              </div>
            ) : exercise.type === 'audio' && exercise.audioUrl ? (
              <div className="text-center">
                <audio ref={audioRef} preload="auto">
                  <source src={exercise.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-8 border border-blue-200">
                  <Icon icon="mdi:volume-high" className="text-6xl text-blue-600 mx-auto mb-4" />
                  <CustomButton
                    preset="primary"
                    icon="mdi:play"
                    onPress={playAudio}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Play Audio
                  </CustomButton>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <Icon 
                  icon={exercise.type === 'image' ? 'mdi:image-off' : 'mdi:volume-off'} 
                  className="text-6xl text-gray-400 mx-auto mb-4" 
                />
                <p className="text-gray-500">
                  {exercise.type === 'image' ? 'No image available' : 'No audio available'}
                </p>
              </div>
            )}
          </div>

          {/* Answer Input */}
          {!showResult ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Type your answer in English
                </p>
              </div>
              
              <div className="flex gap-3">
                <Input
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  size="md"
                />
                <CustomButton
                  preset="primary"
                  onPress={handleSubmit}
                  disabled={!currentAnswer.trim()}
                  className="px-8"
                >
                  Check answer
                </CustomButton>
              </div>
            </div>
          ) : (
            /* Result Display */
            <div className="space-y-4">
              <div className={`text-center p-6 rounded-xl ${
                isCorrect 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Icon 
                    icon={isCorrect ? 'mdi:check-circle' : 'mdi:close-circle'} 
                    className={`text-3xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                  />
                  <span className={`text-xl font-semibold ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Your answer:</div>
                  <div className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {userAnswer}
                  </div>
                  
                  {!isCorrect && (
                    <>
                      <div className="text-sm text-gray-600 mt-3">Correct answer:</div>
                      <div className="font-medium text-green-700">
                        {exercise.correctAnswer}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="text-center">
                <CustomButton
                  preset="primary"
                  onPress={handleNext}
                  icon={isLastExercise ? 'mdi:flag-checkered' : 'mdi:arrow-right'}
                  className="px-8"
                >
                  {isLastExercise ? 'Finish' : 'Next Exercise'}
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

// Result Component
const DoTypeAnswerResult: React.FC<{
  score: number;
  total: number;
  onRestart: () => void;
  onBackToTopics: () => void;
}> = ({
  score,
  total,
  onRestart,
  onBackToTopics,
}) => {
  const percentage = Math.round((score / total) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 90) return { message: "Excellent work!", icon: "🎉", color: "text-green-600" };
    if (percentage >= 70) return { message: "Great job!", icon: "👏", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good effort!", icon: "👍", color: "text-orange-600" };
    return { message: "Keep practicing!", icon: "💪", color: "text-red-600" };
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl">
        <CardBody className="p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="text-6xl mb-4">{result.icon}</div>
            
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Exercise Complete!
              </h2>
              <p className={`text-lg font-semibold ${result.color}`}>
                {result.message}
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {score}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                
                <div className="text-2xl text-gray-400">/</div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
              
              {/* Percentage */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{
                  color: percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    percentage >= 70 
                      ? 'bg-gradient-to-r from-green-400 to-green-500' 
                      : percentage >= 50 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                        : 'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <Icon icon="mdi:check-circle" className="text-green-500 text-2xl mx-auto mb-1" />
                <div className="font-semibold text-green-700">{score} Correct</div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <Icon icon="mdi:close-circle" className="text-red-500 text-2xl mx-auto mb-1" />
                <div className="font-semibold text-red-700">{total - score} Wrong</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <CustomButton
                preset="primary"
                onPress={onRestart}
                className="w-full"
                icon="mdi:refresh"
              >
                Try Again
              </CustomButton>
              
              <CustomButton
                preset="outline"
                onPress={onBackToTopics}
                className="w-full"
                icon="mdi:arrow-left"
              >
                Back to Topics
              </CustomButton>
            </div>

            {/* Motivational Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Icon icon="mdi:lightbulb" className="text-blue-500 text-xl mx-auto mb-2" />
              <p className="text-sm text-blue-700 text-center">
                {percentage >= 70 
                  ? "You're mastering these exercises! Keep up the great work."
                  : "Practice makes perfect! Try the exercises again to improve your score."
                }
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Main Container Component
interface DoTypeAnswerContainerProps {
  topicId: string;
  isWorkspace?: boolean;
}

export const DoTypeAnswerContainer: React.FC<DoTypeAnswerContainerProps> = ({
  topicId,
  isWorkspace = false,
}) => {
  const router = useRouter();
  const { exercises, isLoading, error } = useExercisesWithFetch(topicId);
  const { getExercises: getDirectusExercises } = useDirectusExercise();
  
  const [typeAnswerExercises, setTypeAnswerExercises] = useState<DoTypeAnswerExercise[]>([]);
  const [state, setState] = useState<DoTypeAnswerState>({
    currentIndex: 0,
    userAnswer: '',
    isCorrect: null,
    showResult: false,
    isCompleted: false,
    score: 0,
  });
  const [isLoadingDirectus, setIsLoadingDirectus] = useState(false);

  // Load and merge exercises with Directus data
  useEffect(() => {
    const loadExercisesWithDirectusData = async () => {
      if (exercises && exercises.length > 0) {
        setIsLoadingDirectus(true);
        try {
          // Get Directus exercises
          const directusExercises = await getDirectusExercises();
          
          // Merge and filter for image/audio types only
          const merged = mergeExercisesWithDirectusData(exercises, directusExercises);
          const typeAnswerOnly = merged
            .filter(ex => ex.type === 'image' || ex.type === 'audio')
            .map(ex => ({
              id: ex.id,
              content: ex.content || '',
              correctAnswer: ex.correctAnswer || '',
              type: ex.type as 'image' | 'audio',
              topicId: ex.topicId,
              imageUrl: ex.imageUrl,
              audioUrl: ex.audioUrl,
            }));
          
          setTypeAnswerExercises(typeAnswerOnly);
        } catch (error) {
          console.error('Error loading Directus data:', error);
          // Fallback to exercises without Directus data
          const fallback = exercises
            .filter(ex => ex.type === 'image' || ex.type === 'audio')
            .map(ex => ({
              id: ex.id,
              content: ex.content || '',
              correctAnswer: ex.correctAnswer || '',
              type: ex.type as 'image' | 'audio',
              topicId: ex.topicId,
            }));
          setTypeAnswerExercises(fallback);
        } finally {
          setIsLoadingDirectus(false);
        }
      }
    };

    loadExercisesWithDirectusData();
  }, [exercises, getDirectusExercises]);

  const handleAnswerSubmit = (answer: string) => {
    const currentExercise = typeAnswerExercises[state.currentIndex];
    const isCorrect = answer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    
    setState(prev => ({
      ...prev,
      userAnswer: answer,
      isCorrect,
      showResult: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNext = () => {
    const isLastExercise = state.currentIndex >= typeAnswerExercises.length - 1;
    
    if (isLastExercise) {
      setState(prev => ({ ...prev, isCompleted: true }));
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        userAnswer: '',
        isCorrect: null,
        showResult: false,
      }));
    }
  };

  const handleRestart = () => {
    setState({
      currentIndex: 0,
      userAnswer: '',
      isCorrect: null,
      showResult: false,
      isCompleted: false,
      score: 0,
    });
  };

  const handleBackToTopics = () => {
    if (isWorkspace) {
      router.push('/my-workspace');
    } else {
      router.push('/learn-vocabulary');
    }
  };

  if (isLoading || isLoadingDirectus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody>
            <div className="flex flex-col items-center py-8">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading type answer exercises...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <Icon icon="mdi:alert-circle" className="text-red-500 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exercises</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <CustomButton preset="outline" onPress={handleBackToTopics}>
                Back to Topics
              </CustomButton>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (typeAnswerExercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody>
            <div className="text-center py-8">
              <Icon icon="mdi:image-plus" className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Type Answer Exercises</h3>
              <p className="text-gray-500 mb-4">
                There are no image or audio exercises available for this topic yet.
              </p>
              <CustomButton preset="outline" onPress={handleBackToTopics}>
                Back to Topics
              </CustomButton>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (state.isCompleted) {
    return (
      <DoTypeAnswerResult
        score={state.score}
        total={typeAnswerExercises.length}
        onRestart={handleRestart}
        onBackToTopics={handleBackToTopics}
      />
    );
  }

  const currentExercise = typeAnswerExercises[state.currentIndex];
  const progress = ((state.currentIndex + 1) / typeAnswerExercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CustomButton
                isIconOnly
                preset="ghost"
                icon="mdi:arrow-left"
                onPress={handleBackToTopics}
              >
                <span className="sr-only">Back</span>
              </CustomButton>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Type Answer Exercise</h1>
                <p className="text-sm text-gray-500">
                  Exercise {state.currentIndex + 1} of {typeAnswerExercises.length}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-semibold text-gray-900">{Math.round(progress)}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <DoTypeAnswerExerciseCard
          exercise={currentExercise}
          userAnswer={state.userAnswer}
          showResult={state.showResult}
          isCorrect={state.isCorrect}
          onAnswerSubmit={handleAnswerSubmit}
          onNext={handleNext}
          isLastExercise={state.currentIndex >= typeAnswerExercises.length - 1}
        />
      </div>
    </div>
  );
};
