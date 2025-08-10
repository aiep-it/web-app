"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { ExerciseData } from '@/services/types/exercise';
import { DirectusExercise } from '@/services/cms/exercise';
import { mergeExercisesWithDirectusData } from '@/utils/exerciseHelper';

interface UseMergedExercisesOptions {
  exercises: ExerciseData[];
  getDirectusExercises: () => Promise<DirectusExercise[]>;
  enabled?: boolean;
  debounceMs?: number;
}

export function useMergedExercises({
  exercises,
  getDirectusExercises,
  enabled = true,
  debounceMs = 500
}: UseMergedExercisesOptions) {
  const [mergedExercises, setMergedExercises] = useState<ExerciseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to track the latest exercises to prevent stale closure
  const exercisesRef = useRef(exercises);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Update exercises ref
  useEffect(() => {
    exercisesRef.current = exercises;
  }, [exercises]);

  const mergeExercisesData = useCallback(async () => {
    if (!enabled || !exercisesRef.current || exercisesRef.current.length === 0) {
      setMergedExercises((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const directusExercises = await getDirectusExercises();
      const merged = mergeExercisesWithDirectusData(exercisesRef.current, directusExercises);

      setMergedExercises((prev) => {
        // Deep comparison to prevent unnecessary updates
        if (prev.length !== merged.length) {
          return merged;
        }

        // Check if any exercise content has changed
        const hasChanges = merged.some((mergedEx, index) => {
          const prevEx = prev[index];
          return !prevEx || 
            prevEx.id !== mergedEx.id ||
            prevEx.content !== mergedEx.content ||
            prevEx.correctAnswer !== mergedEx.correctAnswer ||
            prevEx.assetId !== mergedEx.assetId ||
            prevEx.imageUrl !== mergedEx.imageUrl ||
            prevEx.audioUrl !== mergedEx.audioUrl;
        });

        return hasChanges ? merged : prev;
      });
    } catch (err) {
      console.error('Error merging exercises with Directus data:', err);
      setError(err instanceof Error ? err.message : 'Failed to merge exercises');
      
      // Fallback to original exercises
      setMergedExercises((prev) => {
        if (prev.length === 0 || Math.abs(prev.length - exercisesRef.current.length) > 5) {
          return exercisesRef.current;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [enabled, getDirectusExercises]);

  // Debounced merge function
  const debouncedMerge = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      mergeExercisesData();
    }, debounceMs);
  }, [mergeExercisesData, debounceMs]);

  // Effect to trigger merge when exercises change
  useEffect(() => {
    debouncedMerge();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedMerge, exercises]);

  // Manual refresh function
  const refresh = useCallback(() => {
    mergeExercisesData();
  }, [mergeExercisesData]);

  return {
    mergedExercises,
    isLoading,
    error,
    refresh
  };
}
