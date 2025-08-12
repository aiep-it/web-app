'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Spinner } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useAuth } from '@clerk/nextjs';
import { useExercises, useExercisesByTopic } from '@/hooks/useExercises';
import { useUser } from '@/hooks/useUser';
import { ExerciseData } from '@/services/types/exercise';
import { QuizCard, QuizProgress, QuizResults, QuizLoading, QuizError } from '@/components/DoExercise';
import { postExcerciseResult } from '@/services/userExcerciseResult';

export default function LearnQuizExercisePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  
  const { getAllExercises } = useExercises();
  const { currentUser } = useUser();
  const { exercises, isLoading, error } = useExercisesByTopic(topicId);
  
  // Clerk authentication hooks
  const { isLoaded, isSignedIn, getToken } = useAuth();
  
  // State for client-side hydration and auth
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  
  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check authentication status - wait for Clerk to load
  useEffect(() => {
    if (isClient && isLoaded) {
      if (!isSignedIn) {
        setAuthError("Please log in to access quiz features");
      } else {
        setAuthError(null);
      }
    }
  }, [isClient, isLoaded, isSignedIn]);
  
  // Filter exercises for this topic that are quiz type (text-based)
  const quizExercises = exercises.filter(exercise => exercise.type === 'text');
  
  // Initialize answered questions array
  useEffect(() => {
    if (quizExercises.length > 0) {
      setAnsweredQuestions(new Array(quizExercises.length).fill(false));
    }
  }, [quizExercises.length]);
  
  useEffect(() => {
    if (!topicId) {
      router.push('/learn-vocabulary');
      return;
    }
    
    const loadExerciseData = async () => {
      // Only fetch exercises if Clerk is loaded and user is signed in
      if (isClient && isLoaded && isSignedIn) {
        try {
         
          // Get token from Clerk and set it for axios
          const token = await getToken();        
          if (token) {
           
            
            // Import and set the token for axios
            const { setAuthToken } = await import('@/lib/axios');
            setAuthToken(token);
            
            // Now fetch exercises with the token set
            await getAllExercises();
          
          } else {
           
            setAuthError("Authentication failed. Please log in again.");
          }
          
        } catch (error) {
          console.error('Error loading exercises:', error);
          if (error && typeof error === 'object') {
            const errorDetails = {
              message: (error as any).message,
              status: (error as any).response?.status,
              statusText: (error as any).response?.statusText,
              data: (error as any).response?.data
            };
            console.error('Error details:', errorDetails);
            
            if ((error as any).response?.status === 403) {
              setAuthError("Authentication failed. Please log in again.");
            }
          }
        }
      } else {
      }
    };

    loadExerciseData();
  }, [topicId, getAllExercises, router, isClient, isLoaded, isSignedIn, getToken]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const updateExcerciseResult = async (exercise: ExerciseData, answer: string, isCorrect: boolean) => {
    try {
      const userExerciseResultPayload = {
        exerciseId: exercise.id,
        answer,
        isCorrect
      };
      
      const result = await postExcerciseResult(userExerciseResultPayload);
     
    } catch (error) {
      console.error('Error submitting exercise result:', error);
    }
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      addToast({
        title: "Please select an answer",
        description: "You must choose an option before continuing",
        color: "warning",
      });
      return;
    }

    const currentQuestion = quizExercises[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    
    
    if (isCorrect) {
      setScore(score + 1);
    }
     // Show result
   
    const res = await updateExcerciseResult(currentQuestion, selectedAnswer, isCorrect);
    
    // Mark question as answered
    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(newAnsweredQuestions);
  
    setShowResult(true);
    
    addToast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect ? "Well done!" : `The correct answer is: ${currentQuestion.correctAnswer}`,
      color: isCorrect ? "success" : "danger",
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizExercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Quiz completed
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions(new Array(quizExercises.length).fill(false));
    setIsQuizCompleted(false);
  };

  const handleBackToLearning = () => {
    router.push('/learn-vocabulary');
  };

  if (!topicId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Show loading while Clerk is initializing
  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // Show authentication error if user is not signed in
  if (authError && !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="mdi:account-alert" className="text-yellow-500 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <Button
            color="primary"
            onPress={() => router.push('/sign-in')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <QuizLoading message="Loading quiz questions..." />;
  }

  if (error) {
    return (
      <QuizError
        title="Error Loading Quiz"
        message={error}
        onRetry={() => getAllExercises()}
        onBackToLearning={handleBackToLearning}
      />
    );
  }

  if (quizExercises.length === 0) {
    return (
      <QuizError
        title="No Quiz Available"
        message="There are no quiz exercises available for this topic yet."
        onBackToLearning={handleBackToLearning}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={handleBackToLearning}
              >
                <Icon icon="mdi:arrow-left" className="text-xl" />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Vocabulary Quiz</h1>
                <p className="text-sm text-gray-500">Topic Exercise</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizExercises.length}
              </div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:star" className="text-yellow-500" />
                <span className="text-sm font-medium">{score}/{quizExercises.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {!isQuizCompleted ? (
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <QuizProgress 
              currentQuestion={currentQuestionIndex}
              totalQuestions={quizExercises.length}
              score={score}
            />

            {/* Question Card */}
            <QuizCard
              exercise={quizExercises[currentQuestionIndex]}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              onAnswerSelect={handleAnswerSelect}
              onSubmitAnswer={handleSubmitAnswer}
              onNextQuestion={handleNextQuestion}
              isLastQuestion={currentQuestionIndex === quizExercises.length - 1}
            />
          </div>
        ) : (
          /* Quiz Completed */
          <QuizResults
            score={score}
            totalQuestions={quizExercises.length}
            onRestartQuiz={handleRestartQuiz}
            onBackToLearning={handleBackToLearning}
          />
        )}
      </div>
    </div>
  );
}
