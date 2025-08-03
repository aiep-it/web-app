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
  console.log('Merging exercise:', {
    exercise: exercise,
    directusExercise: directusExercise,
    exerciseType: exercise.type,
    hasDirectusAudio: directusExercise?.audio,
    hasDirectusImage: directusExercise?.exerciseImage
  });

  if (!directusExercise) {
    console.log('No directus exercise found for:', exercise.id);
    return exercise;
  }

  // If this is an image type exercise and we have image UUID from Directus
  if (exercise.type === 'image' && directusExercise.exerciseImage) {
    const mergedImageExercise = {
      ...exercise,
      assetId: directusExercise.exerciseImage, // Store the UUID
      imageUrl: getCmsAssetUrl(directusExercise.exerciseImage),
    };
    console.log('Merged image exercise:', mergedImageExercise);
    return mergedImageExercise;
  }

  // If this is an audio type exercise and we have audio UUID from Directus
  if (exercise.type === 'audio' && directusExercise.audio) {
    const mergedAudioExercise = {
      ...exercise,
      assetId: directusExercise.audio, // Store the UUID
      audioUrl: getCmsAssetUrl(directusExercise.audio),
    };
    console.log('Merged audio exercise:', mergedAudioExercise);
    return mergedAudioExercise;
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
  return exercises.map(exercise => {
    const directusExercise = directusExercises.find(
      dx => dx.exerciseId === exercise.id
    );
    
    return mergeExerciseWithDirectusData(exercise, directusExercise);
  });
};
