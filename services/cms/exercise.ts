import { cms, COLLECTIONS } from '@/config/cms';
import { createItem, updateItem, readItems, uploadFiles } from '@directus/sdk';

export interface DirectusExercise {
  exerciseId: string;
  exerciseImage?: string;
  audio?: string;
  type: string;
}

export interface ExerciseCreatePayload {
  exerciseId: string;
  exerciseImage?: string;
  audio?: string;
  type: 'image' | 'audio';
}

export interface ExerciseUpdatePayload extends ExerciseCreatePayload {
  // Use exerciseId to identify the record to update
}

export const uploadFileToDirectus = async (file: File, folder?: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await cms.request(uploadFiles(formData));
    return response.id;
  } catch (error) {
    console.error('Error uploading file to Directus:', error);
    return null;
  }
};

export const createExerciseInDirectus = async (payload: ExerciseCreatePayload): Promise<DirectusExercise | null> => {
  try {
    const result = await cms.request(
      createItem(COLLECTIONS.Exercise, payload)
    );
    return result as DirectusExercise;
  } catch (error) {
    console.error('Error creating exercise in Directus:', error);
    return null;
  }
};

export const updateExerciseInDirectus = async (payload: ExerciseUpdatePayload): Promise<DirectusExercise | null> => {
  try {
    const result = await cms.request(
      createItem(COLLECTIONS.Exercise, payload)
    );
    return result as DirectusExercise;
  } catch (error) {
    console.error('Error updating exercise in Directus:', error);
    return null;
  }
};

export const getExercisesFromDirectus = async (): Promise<DirectusExercise[]> => {
  try {
    const result = await cms.request(
      readItems(COLLECTIONS.Exercise, {
        fields: ['exerciseId', 'exerciseImage', 'audio', 'type'],
      })
    );
    return result as DirectusExercise[];
  } catch (error) {
    console.error('Error fetching exercises from Directus:', error);
    return [];
  }
};
