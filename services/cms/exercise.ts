import { cms, COLLECTIONS } from '@/config/cms';
import { createItem, updateItem, readItems, uploadFiles, deleteItem, deleteItems } from '@directus/sdk';

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
    console.log('Starting update in Directus with payload:', payload);
    
    // First, delete any existing records with the same exerciseId
    console.log('Deleting existing records for exerciseId:', payload.exerciseId);
    await cms.request(
      deleteItems(COLLECTIONS.Exercise, {
        filter: {
          exerciseId: {
            _eq: payload.exerciseId
          }
        }
      })
    );
    
    // Then create a new record with the updated data
    console.log('Creating new record with data:', payload);
    const result = await cms.request(
      createItem(COLLECTIONS.Exercise, payload)
    );
    
    console.log('Successfully updated exercise in Directus:', result);
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

export const getExerciseByIdFromDirectus = async (exerciseId: string): Promise<DirectusExercise | null> => {
  try {
    const result = await cms.request(
      readItems(COLLECTIONS.Exercise, {
        fields: ['exerciseId', 'exerciseImage', 'audio', 'type'],
        filter: {
          exerciseId: {
            _eq: exerciseId
          }
        }
      })
    );
    
    if (result && result.length > 0) {
      return result[0] as DirectusExercise;
    }
    return null;
  } catch (error) {
    console.error('Error fetching exercise by ID from Directus:', error);
    return null;
  }
};

export const getAudioByExerciseId = async (exerciseId: string): Promise<string | null> => {
  try {
    const exercise = await getExerciseByIdFromDirectus(exerciseId);
    return exercise?.audio || null;
  } catch (error) {
    console.error('Error fetching audio by exercise ID:', error);
    return null;
  }
};

export const deleteExerciseFromDirectus = async (exerciseId: string): Promise<boolean> => {
  try {
    await cms.request(
      deleteItems(COLLECTIONS.Exercise, {
        filter: {
          exerciseId: {
            _eq: exerciseId
          }
        }
      })
    );
    console.log('Deleted exercise from Directus:', exerciseId);
    return true;
  } catch (error) {
    console.error('Error deleting exercise from Directus:', error);
    return false;
  }
};
