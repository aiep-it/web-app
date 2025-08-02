'use client';

import React from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ExerciseData } from '@/services/types/exercise';

interface TypeAnswerListProps {
  exercises: ExerciseData[];
  loading?: boolean;
  error?: string | null;
  onExerciseSelect: (exercise: ExerciseData) => void;
  onExerciseEdit: (exercise: ExerciseData) => void;
  selectedExerciseId?: string;
}

export function TypeAnswerList({ 
  exercises, 
  loading = false, 
  error, 
  onExerciseSelect, 
  onExerciseEdit,
  selectedExerciseId 
}: TypeAnswerListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return 'mdi:image';
      case 'audio': return 'mdi:volume-high';
      default: return 'mdi:help-circle';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'text-purple-600';
      case 'audio': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-500">Loading exercises...</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="text-center py-12">
            <Icon icon="mdi:alert-circle" className="text-red-500 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Exercises</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button color="primary" variant="light">
              Try Again
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 pb-3">
        <Icon icon="mdi:format-list-bulleted" className="text-purple-500 text-2xl" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Type Answer Exercises</h2>
          <p className="text-sm text-gray-500">{exercises.length} exercises available</p>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        {exercises.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Icon icon="mdi:image-plus" className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Type Answer Exercises</h3>
            <p className="text-gray-500 mb-4">
              Create your first image or audio exercise to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedExerciseId === exercise.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                }`}
                onClick={() => onExerciseSelect(exercise)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon 
                        icon={getTypeIcon(exercise.type)} 
                        className={`text-lg ${getTypeColor(exercise.type)}`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Exercise #{index + 1}
                      </span>
                      {exercise.difficulty && (
                        <Chip
                          color={getDifficultyColor(exercise.difficulty)}
                          size="sm"
                          variant="flat"
                        >
                          {exercise.difficulty}
                        </Chip>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {exercise.content || 'No content provided'}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon icon="mdi:check-circle" className="text-green-500" />
                      <span>Answer: {exercise.correctAnswer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={(e) => {
                        (e as any).stopPropagation();
                        onExerciseEdit(exercise);
                      }}
                      className="text-gray-400 hover:text-purple-600"
                    >
                      <Icon icon="mdi:pencil" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
