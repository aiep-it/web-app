"use client";

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback } from 'react';
import {
  fetchAllExercises,
  fetchExerciseById,
  createExercise,
  updateExerciseById,
  clearError,
  clearCurrentExercise,
  setCurrentExercise,
  clearExercisesByTopic,
  resetExerciseState,
  selectAllExercises,
  selectExercisesByTopic,
  selectCurrentExercise,
  selectExerciseLoading,
  selectExerciseError,
  selectExerciseCreateLoading,
  selectExerciseUpdateLoading,
} from '@/store/slices/exerciseSlice';
import { ExercisePayload } from '@/services/types/exercise';

export function useExercises() {
  const dispatch = useAppDispatch();
  
  // Selectors
  const exercises = useAppSelector(selectAllExercises);
  const currentExercise = useAppSelector(selectCurrentExercise);
  const isLoading = useAppSelector(selectExerciseLoading);
  const error = useAppSelector(selectExerciseError);
  const isCreateLoading = useAppSelector(selectExerciseCreateLoading);
  const isUpdateLoading = useAppSelector(selectExerciseUpdateLoading);

  // Actions
  const getAllExercises = useCallback(async () => {
    try {
      const result = await dispatch(fetchAllExercises()).unwrap();
      return result;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  }, [dispatch]);

  const getExerciseById = useCallback(async (id: string) => {
    try {
      const result = await dispatch(fetchExerciseById(id)).unwrap();
      return result;
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw error;
    }
  }, [dispatch]);

  const createNewExercise = useCallback(async (payload: ExercisePayload) => {
    try {
      const result = await dispatch(createExercise(payload)).unwrap();
      return result;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  }, [dispatch]);

  const updateExercise = useCallback(async (id: string, payload: ExercisePayload) => {
    try {
      const result = await dispatch(updateExerciseById({ id, payload })).unwrap();
      return result;
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  }, [dispatch]);

  const getExercisesByTopic = useCallback((topicId: string) => {
    return useAppSelector(state => selectExercisesByTopic(state, topicId));
  }, []);

  const clearExerciseError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentExercise());
  }, [dispatch]);

  const setCurrent = useCallback((exercise: any) => {
    dispatch(setCurrentExercise(exercise));
  }, [dispatch]);

  const clearTopicExercises = useCallback((topicId: string) => {
    dispatch(clearExercisesByTopic(topicId));
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetExerciseState());
  }, [dispatch]);

  return {
    // Data
    exercises,
    currentExercise,
    
    // Loading states
    isLoading,
    isCreateLoading,
    isUpdateLoading,
    
    // Error
    error,
    
    // Actions
    getAllExercises,
    getExerciseById,
    createNewExercise,
    updateExercise,
    getExercisesByTopic,
    
    // Utility actions
    clearExerciseError,
    clearCurrent,
    setCurrent,
    clearTopicExercises,
    resetState,
  };
}

// Hook riêng để lấy exercises theo topic ID
export function useExercisesByTopic(topicId: string) {
  const exercises = useAppSelector(state => selectExercisesByTopic(state, topicId));
  const isLoading = useAppSelector(selectExerciseLoading);
  const error = useAppSelector(selectExerciseError);

  return {
    exercises,
    isLoading,
    error,
  };
}
