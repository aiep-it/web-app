'use client';

import React from 'react';
import { ExerciseData } from '@/services/types/exercise';
import { Card, CardBody, CardHeader, Button, Spinner, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ExerciseListProps {
  exercises: ExerciseData[];
  loading: boolean;
  error: string | null;
  onExerciseSelect: (exercise: ExerciseData) => void;
  onExerciseEdit?: (exercise: ExerciseData) => void;
  selectedExerciseId?: string | number;
}

export function ExerciseList({ 
  exercises, 
  loading, 
  error, 
  onExerciseSelect, 
  onExerciseEdit,
  selectedExerciseId 
}: ExerciseListProps) {
  
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:format-list-bulleted" className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Exercise List</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" />
            <p className="text-gray-500 mt-4">Loading exercises...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:format-list-bulleted" className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Exercise List</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="text-center py-8">
            <Icon icon="mdi:alert-circle" className="text-red-500 text-4xl mx-auto mb-3" />
            <p className="text-red-600 font-medium mb-2">Error loading exercises</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(100vh-12rem)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:format-list-bulleted" className="text-blue-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900">Exercise List</h3>
          </div>
          <Chip size="sm" variant="flat" color="primary">
            {exercises.length} exercises
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {exercises.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="mdi:help-circle-outline" className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-2">No exercises yet</p>
            <p className="text-gray-400 text-sm">Create your first exercise to get started</p>
          </div>
        ) : (
          <div className="space-y-3 h-full overflow-y-auto pr-2">
            {exercises.map((exercise, index) => {
              const isSelected = selectedExerciseId === exercise.id;
              const difficultyColors: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
                beginner: 'success',
                intermediate: 'warning',
                advanced: 'danger'
              } as const;
              
              return (
                <div
                  key={exercise.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => onExerciseSelect(exercise)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color={difficultyColors[exercise.difficulty] || 'default'}
                      >
                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                      </Chip>
                    </div>
                    
                    {onExerciseEdit && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExerciseEdit(exercise);
                        }}
                      >
                        <Icon icon="mdi:pencil" className="text-gray-500" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <p className={`text-sm font-medium line-clamp-2 ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {exercise.content}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:help-circle-outline" />
                      <span>{exercise.type}</span>
                    </div>
                    {exercise.options && (
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:format-list-checks" />
                        <span>{exercise.options.length} options</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
