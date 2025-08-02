import { useState } from 'react';
import { 
  createExerciseInDirectus, 
  updateExerciseInDirectus, 
  uploadFileToDirectus,
  getExercisesFromDirectus,
  ExerciseCreatePayload,
  ExerciseUpdatePayload,
  DirectusExercise
} from '@/services/cms/exercise';

export interface UseDirectusExerciseResult {
  createExercise: (payload: ExerciseCreatePayload, imageFile?: File) => Promise<DirectusExercise | null>;
  updateExercise: (payload: ExerciseUpdatePayload, imageFile?: File) => Promise<DirectusExercise | null>;
  getExercises: () => Promise<DirectusExercise[]>;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
}

export const useDirectusExercise = (): UseDirectusExerciseResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const createExercise = async (
    payload: ExerciseCreatePayload,
    imageFile?: File
  ): Promise<DirectusExercise | null> => {
    setIsCreating(true);
    try {
      let finalPayload = { ...payload };

      if (imageFile) {
        const imageUuid = await uploadFileToDirectus(imageFile);
        if (imageUuid) {
          finalPayload.exerciseImage = imageUuid;
        }
      }

      return await createExerciseInDirectus(finalPayload);
    } catch (error) {
      console.error('Error creating exercise:', error);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const updateExercise = async (
    payload: ExerciseUpdatePayload,
    imageFile?: File
  ): Promise<DirectusExercise | null> => {
    setIsUpdating(true);
    try {
      let finalPayload = { ...payload };

      if (imageFile) {
        const imageUuid = await uploadFileToDirectus(imageFile);
        if (imageUuid) {
          finalPayload.exerciseImage = imageUuid;
        }
      }

      return await updateExerciseInDirectus(finalPayload);
    } catch (error) {
      console.error('Error updating exercise:', error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const getExercises = async (): Promise<DirectusExercise[]> => {
    setIsFetching(true);
    try {
      return await getExercisesFromDirectus();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    } finally {
      setIsFetching(false);
    }
  };

  return {
    createExercise,
    updateExercise,
    getExercises,
    isCreating,
    isUpdating,
    isFetching,
  };
};
