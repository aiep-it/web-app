'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/rootReducer';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import { useTopics } from '@/hooks/useTopics';
import { useExercises } from '@/hooks/useExercises';
import { Roadmap } from '@/services/types/roadmap';
import { TopicData } from '@/services/types/topic';
import { Icon } from '@iconify/react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { CustomButton } from '@/shared/components/button/CustomButton';

interface ExerciseRoadmapSectionProps {
  roadmap: Roadmap;
  topics: TopicData[];
  isLoading?: boolean;
}

function ExerciseRoadmapSection({ roadmap, topics, isLoading }: ExerciseRoadmapSectionProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const router = useRouter();
  
  // Get all exercises from Redux
  const allExercises = useSelector((state: RootState) => state.exercise.exercises);
  
  // Function to count exercises by topic and type
  const getExerciseCount = (topicId: string, exerciseType: string) => {
    return allExercises.filter(exercise => 
      exercise.topicId === topicId && exercise.type === exerciseType
    ).length;
  };

  const columns = [
    { name: "Topic", uid: "topic" },
    { name: "Quiz", uid: "quiz" },
    { name: "Type Answer", uid: "typeAnswer" },
    { name: "Actions", uid: "actions" },
  ];

  const handleAddExercise = (topic: TopicData) => {
    setSelectedTopic(topic);
    onOpen();
  };

  const handleExerciseTypeSelect = (type: 'quiz' | 'type-answer') => {
    if (!selectedTopic) {
      console.error('No topic selected');
      return;
    }
    
    onOpenChange(); // Close modal first
    
    // Navigate to appropriate exercise page with topicId
    if (type === 'quiz') {
      const route = `/admin/exercises/${selectedTopic.id}/quiz`;
      router.push(route);
    } else if (type === 'type-answer') {
      const route = `/admin/exercises/${selectedTopic.id}/type-answer`;
      router.push(route);
    }
  };

  const renderCell = (topic: TopicData, columnKey: React.Key): React.ReactNode => {
    const quizCount = getExerciseCount(topic.id, 'text');
    const typeAnswerCount = getExerciseCount(topic.id, 'type-answer');
    
    switch (columnKey) {
      case "topic":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900">{topic.title}</p>
            <p className="text-xs text-gray-500">0 words</p>
          </div>
        );
      case "quiz":
        return (
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{quizCount}</p>
            <p className="text-xs text-gray-500 tracking-wider">Exercises</p>
          </div>
        );
      case "typeAnswer":
        return (
          <div className="text-center">
            <p className="text-lg font-bold text-purple-600">{typeAnswerCount}</p>
            <p className="text-xs text-gray-500 tracking-wider">Exercises</p>
          </div>
        );
      case "actions":
        return (
          <CustomButton
            preset="primary"
            size="sm"
            icon="lucide:circle-plus"
            iconSize={16}
            onPress={() => handleAddExercise(topic)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm"
          >
            Add Exercise
          </CustomButton>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      {/* Roadmap Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
          <Icon
            icon="material-symbols:folder"
            className="text-blue-500 w-5 h-5"
          />
          {roadmap.name}
        </h2>
        {roadmap.description && (
          <p className="text-gray-600 mt-1 text-sm">
            {roadmap.description}
          </p>
        )}
      </div>

      {/* HeroUI Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading topics...</p>
          </div>
        ) : topics?.length > 0 ? (
          <Table
            aria-label={`Topics in ${roadmap.name}`}
            selectionMode="none"
            classNames={{
              wrapper: "shadow-none border-none rounded-none",
              th: "bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider border-b border-gray-200 py-3 px-6 first:text-left [&:nth-child(2)]:text-center [&:nth-child(3)]:text-center [&:nth-child(4)]:text-center",
              td: "py-4 px-6 border-b border-gray-100 align-top",
              tr: "hover:bg-gray-50"
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn 
                  key={column.uid} 
                  className={
                    column.uid === "topic" ? "text-left" : 
                    column.uid === "actions" ? "text-center" : 
                    "text-center"
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  {columns.map((column) => (
                    <TableCell 
                      key={column.uid}
                      className={
                        column.uid === "topic" ? "text-left" : 
                        column.uid === "actions" ? "text-center" : 
                        "text-center"
                      }
                    >
                      {renderCell(topic, column.uid)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center">
            <Icon
              icon="material-symbols:quiz-outline"
              className="text-gray-300 text-4xl mb-3 mx-auto"
            />
            <p className="text-gray-500 text-sm">
              No topics available in this roadmap
            </p>
          </div>
        )}
      </div>

      {/* Exercise Type Selection Modal */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        classNames={{
          base: "border border-gray-200",
          header: "border-b border-gray-200",
          body: "py-6",
          closeButton: "hover:bg-gray-100"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-900">Choose Exercise Type</h2>
                <p className="text-sm text-gray-600">Select the type of exercise you want to create for "{selectedTopic?.title}"</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quiz Option */}
                  <div className="group cursor-pointer" onClick={() => {
                    handleExerciseTypeSelect('quiz');
                  }}>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                          <Icon icon="mdi:help-circle-outline" className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz</h3>
                        <p className="text-sm text-gray-600 mb-4">Select from predefined options to test comprehension.</p>
                        <CustomButton
                          preset="danger"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white font-medium"
                          onPress={() => {
                            handleExerciseTypeSelect('quiz');
                          }}
                        >
                          Setup Quiz
                        </CustomButton>
                      </div>
                    </div>
                  </div>

                  {/* Type Answer Option */}
                  <div className="group cursor-pointer" onClick={() => {
                    handleExerciseTypeSelect('type-answer');
                  }}>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                          <Icon icon="mdi:format-text" className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Answer</h3>
                        <p className="text-sm text-gray-600 mb-4">Provide missing words to complete sentences.</p>
                        <CustomButton
                          preset="primary"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white font-medium"
                          onPress={() => {
                            handleExerciseTypeSelect('type-answer');
                          }}
                        >
                          Setup Type Answer
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function ExercisesPage() {
  const { roadmaps, isLoading, error, refetch } = useRoadmaps();
  const { getTopicsByRoadmap } = useTopics();
  const { getAllExercises } = useExercises();
  const [loadingTopics, setLoadingTopics] = useState<Record<string, boolean>>({});

  // Get all topics from Redux
  const allTopicsByRoadmap = useSelector((state: RootState) => state.topic.topicsByRoadmap);

  // Memoize roadmap IDs to avoid unnecessary re-computation
  const roadmapIds = useMemo(() => roadmaps.map(r => r.id), [roadmaps]);

  // Load exercises on component mount
  useEffect(() => {
    getAllExercises();
  }, [getAllExercises]);

  // Load topics for all roadmaps
  useEffect(() => {
    const loadAllTopics = async () => {
      if (roadmaps.length > 0) {
        // Set loading state for topics
        const newLoadingState: Record<string, boolean> = {};
        roadmaps.forEach((roadmap) => {
          newLoadingState[roadmap.id] = true;
        });
        setLoadingTopics(newLoadingState);

        try {
          // Fetch topics for all roadmaps
          const topicsPromises = roadmaps.map(async (roadmap) => {
            await getTopicsByRoadmap(roadmap.id);
            return roadmap.id;
          });

          await Promise.all(topicsPromises);
        } catch (error) {
          console.error('Error loading topics:', error);
        } finally {
          // Clear loading states
          const newLoadingState: Record<string, boolean> = {};
          roadmaps.forEach((roadmap) => {
            newLoadingState[roadmap.id] = false;
          });
          setLoadingTopics(newLoadingState);
        }
      }
    };

    loadAllTopics();
  }, [roadmapIds, getTopicsByRoadmap]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-gray-700">
            Loading exercises data...
          </h2>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to load exercises data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="space-y-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Manage Exercises
            </h2>
            <p className="text-gray-600 mb-4">
              View and manage exercises for each topic across all roadmaps.
            </p>
          </div>

          {/* Roadmaps and Topics */}
          <div className="space-y-8">
            {roadmaps.map((roadmap) => {
              // Get topics for this roadmap from the pre-fetched data
              const roadmapTopics = allTopicsByRoadmap[roadmap.id] || [];

              return (
                <ExerciseRoadmapSection 
                  key={roadmap.id} 
                  roadmap={roadmap} 
                  topics={roadmapTopics}
                  isLoading={loadingTopics[roadmap.id]}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {roadmaps.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No roadmaps available yet
              </h3>
              <p className="text-gray-500">
                Create roadmaps to start managing exercises.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}