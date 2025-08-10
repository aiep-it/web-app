'use client';

import React, { useState, memo, useCallback } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ExerciseData } from '@/services/types/exercise';
import { CustomButton } from '@/shared/components';

interface TypeAnswerListProps {
  exercises: ExerciseData[];
  loading?: boolean;
  error?: string | null;
  onExerciseSelect: (exercise: ExerciseData) => void;
  onExerciseEdit: (exercise: ExerciseData) => void;
  onExerciseDelete?: (exercise: ExerciseData) => void;
  selectedExerciseId?: string;
}

// Memoized Exercise Item Component to prevent unnecessary re-renders
const ExerciseItem = memo(({ 
  exercise, 
  index, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete 
}: {
  exercise: ExerciseData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}) => {
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'image': return 'mdi:image';
      case 'audio': return 'mdi:volume-high';
      default: return 'mdi:help-circle';
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'image': return 'text-purple-600';
      case 'audio': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }, []);

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        isSelected ? 'bg-purple-50 border-r-4 border-purple-500' : ''
      }`}
      onClick={onSelect}
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

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <CustomButton
            isIconOnly
            size="sm"
            preset="ghost"
            icon="mdi:pencil"
            iconSize={16}
            onPress={onEdit}
            className="text-gray-400 hover:text-purple-600 min-w-8 h-8"
          >
            <span className="sr-only">Edit</span>
          </CustomButton>
          
          {onDelete && (
            <CustomButton
              isIconOnly
              size="sm"
              preset="ghost"
              icon="mdi:delete"
              iconSize={16}
              onPress={onDelete}
              className="text-gray-400 hover:text-red-600 min-w-8 h-8"
            >
              <span className="sr-only">Delete</span>
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
});

ExerciseItem.displayName = 'ExerciseItem';

export const TypeAnswerList = memo(({ 
  exercises, 
  loading = false, 
  error, 
  onExerciseSelect, 
  onExerciseEdit,
  onExerciseDelete,
  selectedExerciseId 
}: TypeAnswerListProps) => {
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Memoized handlers to prevent unnecessary re-renders
  const handleDeleteClick = useCallback((exercise: ExerciseData) => {
    setExerciseToDelete(exercise);
    onOpen();
  }, [onOpen]);

  const handleEditClick = useCallback((exercise: ExerciseData) => {
    onExerciseEdit(exercise);
  }, [onExerciseEdit]);

  const handleExerciseSelect = useCallback((exercise: ExerciseData) => {
    onExerciseSelect(exercise);
  }, [onExerciseSelect]);

  const handleConfirmDelete = useCallback(async () => {
    if (!exerciseToDelete || !onExerciseDelete) return;
    
    setIsDeleting(true);
    try {
      await onExerciseDelete(exerciseToDelete);
      onOpenChange();
      setExerciseToDelete(null);
    } catch (error) {
      console.error('Error deleting exercise:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [exerciseToDelete, onExerciseDelete, onOpenChange]);
  
  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'image': return 'mdi:image';
      case 'audio': return 'mdi:volume-high';
      default: return 'mdi:help-circle';
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'image': return 'text-purple-600';
      case 'audio': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }, []);

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
            <CustomButton preset="outline">
              Try Again
            </CustomButton>
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

      <CardBody className="p-0 h-[calc(75vh-100px)] overflow-y-auto">
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
              <ExerciseItem
                key={`${exercise.id}-${exercise.content}-${exercise.correctAnswer}`} // More stable key
                exercise={exercise}
                index={index}
                isSelected={selectedExerciseId === exercise.id}
                onSelect={() => handleExerciseSelect(exercise)}
                onEdit={() => handleEditClick(exercise)}
                onDelete={onExerciseDelete ? () => handleDeleteClick(exercise) : undefined}
              />
            ))}
          </div>
        )}
      </CardBody>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:delete" className="text-red-500 text-xl" />
                  <span>Delete Exercise</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  Are you sure you want to delete this exercise? This action cannot be undone.
                </p>
                {exerciseToDelete && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon 
                        icon={getTypeIcon(exerciseToDelete.type)} 
                        className={`text-lg ${getTypeColor(exerciseToDelete.type)}`}
                      />
                      <span className="font-medium">
                        {exerciseToDelete.content || 'No content'}
                      </span>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  preset="ghost"
                  onPress={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  preset="danger"
                  loading={isDeleting}
                  loadingText="Deleting..."
                  onPress={handleConfirmDelete}
                >
                  Delete
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
});

TypeAnswerList.displayName = 'TypeAnswerList';
