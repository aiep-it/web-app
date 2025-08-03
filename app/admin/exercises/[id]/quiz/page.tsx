'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useAuth } from '@clerk/nextjs';
import { useExercises, useExercisesByTopic } from '@/hooks/useExercises';
import { useUser } from '@/hooks/useUser';
import { ExerciseList } from '@/components/Exercise/ExerciseList';
import { QuizEditor } from '@/components/Exercise/QuizEditor';
import { QuizDisplay } from '@/components/Exercise/QuizDisplay';
import { ExerciseData } from '@/services/types/exercise';
import AISuggestForm, { AISuggestFormRef } from './AISuggestForm';
import { suggestQuizz } from '@/services/exercise';
import { AI_suggestQuizPayload } from '@/services/types/aiSuggest';
import toast from 'react-hot-toast';
import { set } from 'react-hook-form';

interface QuizExercisePageProps {
  myTopicId?: string;
}
export default function QuizExercisePage({ myTopicId }: QuizExercisePageProps) {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    getAllExercises,
    createNewExercise,
    updateExercise,
    isCreateLoading,
    isUpdateLoading,
  } = useExercises();

  const { currentUser } = useUser();
  const { exercises, isLoading, error } = useExercisesByTopic(topicId);

  // Clerk authentication hooks
  const { isLoaded, isSignedIn } = useAuth();

  // State for client-side hydration and auth
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Debug logging for currentUser
  useEffect(() => {
    console.log('QuizExercisePage - currentUser:', currentUser);
  }, [currentUser]);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication status - wait for Clerk to load
  useEffect(() => {
    if (isClient && isLoaded) {
      if (!isSignedIn) {
        setAuthError('Please log in to access exercise management features');
      } else {
        setAuthError(null);
      }
    }
  }, [isClient, isLoaded, isSignedIn]);

  const [currentView, setCurrentView] = useState<
    'list' | 'create' | 'edit' | 'preview'
  >('list');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(
    null,
  );
  const [previewAnswer, setPreviewAnswer] = useState('');
  const [showPreviewResult, setShowPreviewResult] = useState(false);
  const formRef = useRef<AISuggestFormRef>(null);
  const [aiSuggestData, setAISuggestData] = useState<ExerciseData | null>(null);
  const [aiSuggestLoading, setAISuggestLoading] = useState(false);

  // Filter exercises for this topic that are quiz type (text-based)
  const quizExercises = exercises.filter(
    (exercise) => exercise.type === 'text',
  );

  useEffect(() => {
    if (!topicId) {
      router.push('/admin/exercises');
      return;
    }

    // Only fetch exercises if Clerk is loaded and user is signed in
    if (isClient && isLoaded && isSignedIn) {
      console.log('Fetching exercises - authentication confirmed');
      getAllExercises();
    } else {
      console.log('Not fetching exercises yet - waiting for authentication:', {
        isClient,
        clerkIsLoaded: isLoaded,
        userIsSignedIn: isSignedIn,
      });
    }
  }, [topicId, getAllExercises, router, isClient, isLoaded, isSignedIn]);

  const handleCreateExercise = async (exerciseData: Partial<ExerciseData>) => {
    if (!topicId || !currentUser) {
      console.error('Missing topicId or currentUser:', {
        topicId,
        currentUser,
      });
      addToast({
        title: 'Error',
        description: 'Missing required information to create exercise',
        color: 'danger',
      });
      return;
    }

    // Check if user is still authenticated
    if (!isLoaded || !isSignedIn) {
      console.error('User not authenticated');
      addToast({
        title: 'Authentication Error',
        description: 'Please log in again to create exercises',
        color: 'danger',
      });
      return;
    }

    console.log('Creating exercise with payload:', {
      ...exerciseData,
      topicId: topicId,
      userId: currentUser.id,
      type: 'text',
    });

    try {
      await createNewExercise({
        ...exerciseData,
        topicId: topicId,
        userId: currentUser.id,
        type: 'text',
      } as any);

      addToast({
        title: 'Success',
        description: 'Quiz exercise created successfully!',
        color: 'success',
      });

      setCurrentView('list');
      // Refresh exercises after creation
      getAllExercises();
    } catch (error) {
      console.error('Error creating exercise:', error);

      // Handle specific 403 errors
      if (error && typeof error === 'object') {
        const errorDetails = {
          message: (error as any).message,
          status: (error as any).response?.status,
          statusText: (error as any).response?.statusText,
          data: (error as any).response?.data,
        };
        console.error('Error details:', errorDetails);

        if ((error as any).response?.status === 403) {
          setAuthError('Authentication failed. Please log in again.');
          addToast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please log in again.',
            color: 'danger',
          });
          return;
        }
      }

      addToast({
        title: 'Error',
        description: 'Failed to create quiz exercise. Please try again.',
        color: 'danger',
      });
    }
  };

  const handleUpdateExercise = async (exerciseData: Partial<ExerciseData>) => {
    if (aiSuggestData) {
      await handleCreateExercise(aiSuggestData);

      setAISuggestData(null);
      return;
    }
    if (!selectedExercise || !topicId || !currentUser) {
      console.error('Missing required data for update:', {
        selectedExercise: !!selectedExercise,
        topicId,
        currentUser: !!currentUser,
      });
      addToast({
        title: 'Error',
        description: 'Missing required information to update exercise',
        color: 'danger',
      });
      return;
    }

    // Check if user is still authenticated
    if (!isLoaded || !isSignedIn) {
      console.error('User not authenticated');
      addToast({
        title: 'Authentication Error',
        description: 'Please log in again to update exercises',
        color: 'danger',
      });
      return;
    }

    const updatePayload = {
      ...exerciseData,
      topicId: topicId, // Include topicId in update payload
      userId: currentUser.id, // Include userId in update payload
      type: 'text',
    };

    try {
      await updateExercise(
        selectedExercise.id.toString(),
        updatePayload as any,
      );

      addToast({
        title: 'Success',
        description: 'Quiz exercise updated successfully!',
        color: 'success',
      });

      setCurrentView('list');
      setSelectedExercise(null);
      // Refresh exercises after update
      getAllExercises();
    } catch (error) {
      console.error('Error updating exercise:', error);

      // Handle specific 403 errors
      if (error && typeof error === 'object') {
        const errorDetails = {
          message: (error as any).message,
          status: (error as any).response?.status,
          statusText: (error as any).response?.statusText,
          data: (error as any).response?.data,
        };
        console.error('Error details:', errorDetails);

        if ((error as any).response?.status === 403) {
          setAuthError('Authentication failed. Please log in again.');
          addToast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please log in again.',
            color: 'danger',
          });
          return;
        }
      }

      addToast({
        title: 'Error',
        description: 'Failed to update quiz exercise. Please try again.',
        color: 'danger',
      });
    }
  };

  const handleExerciseSelect = (exercise: ExerciseData) => {
    setSelectedExercise(exercise);
    setCurrentView('preview');
    setPreviewAnswer('');
    setShowPreviewResult(false);
  };

  const handleEditExercise = (exercise: ExerciseData) => {
    setSelectedExercise(exercise);
    setCurrentView('edit');
  };

  const handlePreviewAnswer = (answer: string) => {
    setPreviewAnswer(answer);
    setShowPreviewResult(true);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedExercise(null);
    setPreviewAnswer('');
    setShowPreviewResult(false);
  };

  if (!topicId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleAction = async () => {
    setAISuggestLoading(true);
    const data = formRef.current?.getData();
    if (!data) {
      alert('Please fill in the content');
      return;
    }

    const payload = {
      topicId: topicId,
      difficulty: data.difficulty,
      content: data.content,
    } as AI_suggestQuizPayload;
    const rest = await suggestQuizz(payload);

    if (rest) {
      setAISuggestData(rest);
      setSelectedExercise(rest);
      setCurrentView('edit');
    } else {
      toast.error('Failed to suggest quiz. Please try again.');
    }

    setAISuggestLoading(false);
    // Do something with `data`
    // e.g., call API, close modal, etc.
    onClose();
  };

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
            <Icon
              icon="mdi:account-alert"
              className="text-yellow-500 text-2xl"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">{authError}</p>
          <Button color="primary" onPress={() => router.push('/sign-in')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button isIconOnly variant="light" onPress={() => router.back()}>
                <Icon icon="mdi:arrow-left" className="text-xl" />
              </Button>

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Quiz Exercises
                </h1>
                <p className="text-sm text-gray-500">Topic ID: {topicId}</p>
              </div>
            </div>

            {currentView === 'list' && (
              <div className="space-x-2 flex items-center">
                <Button
                  color="primary"
                  startContent={<Icon icon="mdi:plus" />}
                  onPress={() => setCurrentView('create')}
                >
                  Create Quiz
                </Button>
                <Button
                  color="secondary"
                  startContent={<Icon icon="lucide:bot" />}
                  onPress={onOpen}
                  variant="bordered"
                >
                  AI Suggest Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {currentView === 'list' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Icon
                    icon="mdi:format-list-bulleted"
                    className="text-blue-500 text-2xl"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Exercise Management
                  </h2>
                </div>

                <div className="text-center py-12">
                  <Icon
                    icon="mdi:help-circle-outline"
                    className="text-gray-300 text-6xl mx-auto mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select an exercise to preview
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Choose an exercise from the list on the right to view or
                    edit it, or create a new one.
                  </p>
                  <Button
                    color="primary"
                    variant="light"
                    startContent={<Icon icon="mdi:plus" />}
                    onPress={() => setCurrentView('create')}
                  >
                    Create Your First Quiz
                  </Button>
                </div>
              </div>
            )}

            {currentView === 'create' && (
              <QuizEditor
                onSave={handleCreateExercise}
                onCancel={handleBackToList}
                isLoading={isCreateLoading}
              />
            )}

            {currentView === 'edit' && selectedExercise && (
              <QuizEditor
                exercise={selectedExercise}
                onSave={handleUpdateExercise}
                onCancel={handleBackToList}
                isLoading={isUpdateLoading}
              />
            )}

            {currentView === 'preview' && selectedExercise && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="light"
                    startContent={<Icon icon="mdi:arrow-left" />}
                    onPress={handleBackToList}
                  >
                    Back to List
                  </Button>

                  <Button
                    variant="light"
                    startContent={<Icon icon="mdi:pencil" />}
                    onPress={() => handleEditExercise(selectedExercise)}
                  >
                    Edit Exercise
                  </Button>
                </div>

                <QuizDisplay
                  exercise={selectedExercise}
                  selectedAnswer={previewAnswer}
                  onAnswerSelect={handlePreviewAnswer}
                  showResult={showPreviewResult}
                  isCorrect={previewAnswer === selectedExercise.correctAnswer}
                />

                {showPreviewResult && (
                  <div className="flex justify-center">
                    <Button
                      variant="light"
                      onPress={() => {
                        setPreviewAnswer('');
                        setShowPreviewResult(false);
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Exercise List Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <ExerciseList
              exercises={quizExercises}
              loading={isLoading}
              error={error}
              onExerciseSelect={handleExerciseSelect}
              onExerciseEdit={handleEditExercise}
              selectedExerciseId={selectedExercise?.id}
            />
          </div>
        </div>
      </div>

      {/* AI suggest Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                AI Suggest QUIZZ
              </ModalHeader>
              <ModalBody>
                {aiSuggestLoading ? (
                  <Spinner className="mx-auto" />
                ) : (
                  <AISuggestForm ref={formRef} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isLoading={aiSuggestLoading}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleAction}
                  isLoading={aiSuggestLoading}
                >
                  Suggest
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
