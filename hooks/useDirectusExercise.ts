import { useState, useCallback } from 'react';
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
  createExercise: (payload: ExerciseCreatePayload, file?: File) => Promise<DirectusExercise | null>;
  updateExercise: (payload: ExerciseUpdatePayload, file?: File) => Promise<DirectusExercise | null>;
  getExercises: () => Promise<DirectusExercise[]>;
  isCreating: boolean;
  isUpdating: boolean;
  isFetching: boolean;
}

export const useDirectusExercise = (): UseDirectusExerciseResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const createExercise = useCallback(async (
    payload: ExerciseCreatePayload,
    file?: File
  ): Promise<DirectusExercise | null> => {
    setIsCreating(true);
    try {
      let finalPayload = { ...payload };

      if (file) {
        // Determine folder based on file type
        const folder = file.type.startsWith('image/') ? 'images' : 'audio';
        const fileUuid = await uploadFileToDirectus(file, folder);
        
        if (fileUuid) {
          // Set the appropriate field based on exercise type
          if (payload.type === 'image') {
            finalPayload.exerciseImage = fileUuid;
          } else if (payload.type === 'audio') {
            finalPayload.audio = fileUuid;
          }
        }
      }

      return await createExerciseInDirectus(finalPayload);
    } catch (error) {
      console.error('Error creating exercise:', error);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateExercise = useCallback(async (
    payload: ExerciseUpdatePayload,
    file?: File
  ): Promise<DirectusExercise | null> => {
    setIsUpdating(true);
    try {
      let finalPayload = { ...payload };

      if (file) {
        // Determine folder based on file type
        const folder = file.type.startsWith('image/') ? 'images' : 'audio';
        const fileUuid = await uploadFileToDirectus(file, folder);
        
        if (fileUuid) {
          // Set the appropriate field based on exercise type
          if (payload.type === 'image') {
            finalPayload.exerciseImage = fileUuid;
          } else if (payload.type === 'audio') {
            finalPayload.audio = fileUuid;
          }
        }
      }

      return await updateExerciseInDirectus(finalPayload);
    } catch (error) {
      console.error('Error updating exercise:', error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const getExercises = useCallback(async (): Promise<DirectusExercise[]> => {
    setIsFetching(true);
    try {
      return await getExercisesFromDirectus();
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    createExercise,
    updateExercise,
    getExercises,
    isCreating,
    isUpdating,
    isFetching,
  };
};
