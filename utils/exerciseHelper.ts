import { ExerciseData } from '@/services/types/exercise';
import { DirectusExercise } from '@/services/cms/exercise';
import { getCmsAssetUrl } from '@/utils';

/**
 * Merge exercise data from API with Directus data to get image URLs
 */
export const mergeExerciseWithDirectusData = (
  exercise: ExerciseData,
  directusExercise?: DirectusExercise | null
): ExerciseData => {
  if (!directusExercise) {
    return exercise;
  }

  // If this is an image type exercise and we have image UUID from Directus
  if (exercise.type === 'image' && directusExercise.exerciseImage) {
    return {
      ...exercise,
      assetId: directusExercise.exerciseImage, // Store the UUID
      imageUrl: getCmsAssetUrl(directusExercise.exerciseImage),
    };
  }

  // If this is an audio type exercise and we have audio UUID from Directus
  if (exercise.type === 'audio' && directusExercise.audio) {
    return {
      ...exercise,
      assetId: directusExercise.audio, // Store the UUID
      audioUrl: getCmsAssetUrl(directusExercise.audio),
    };
  }

  return exercise;
};

/**
 * Merge an array of exercises with their corresponding Directus data
 */
export const mergeExercisesWithDirectusData = (
  exercises: ExerciseData[],
  directusExercises: DirectusExercise[]
): ExerciseData[] => {
  if (!exercises.length) return [];
  
  const directusMap = new Map<number | string, DirectusExercise>();
  directusExercises.forEach(dx => {
    if (dx.exerciseId) {
      directusMap.set(dx.exerciseId, dx);
    }
  });

  return exercises.map(exercise => {
    const directusExercise = directusMap.get(exercise.id);
    return mergeExerciseWithDirectusData(exercise, directusExercise);
  });
};
