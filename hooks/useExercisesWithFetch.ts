"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useExercises, useExercisesByTopic } from '@/hooks/useExercises';

/**
 * Custom hook that ensures exercises are fetched before returning them
 * This solves the issue where useExercisesByTopic returns empty data
 * if exercises haven't been fetched yet from the API
 */
export function useExercisesWithFetch(topicId: string) {
  const { getAllExercises } = useExercises();
  const { exercises, isLoading: isStoreLoading, error } = useExercisesByTopic(topicId);
  const { isLoaded, isSignedIn, getToken } = useAuth();
  
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and fetch exercises
  useEffect(() => {
    if (!topicId) {
      setAuthError("No topic ID provided");
      return;
    }
    
    const loadExerciseData = async () => {
      // Only fetch exercises if Clerk is loaded and user is signed in
      if (isClient && isLoaded && isSignedIn && !hasTriedFetch) {
        setHasTriedFetch(true);
        setIsFetching(true);
        
        try {
          
          
          // Get token from Clerk and set it for axios
          const token = await getToken();        
          if (token) {
           
            
            // Import and set the token for axios
            const { setAuthToken } = await import('@/lib/axios');
            setAuthToken(token);
            
            // Now fetch exercises with the token set
            await getAllExercises();
           
            setAuthError(null);
          } else {
          
            setAuthError("Authentication failed. Please log in again.");
          }
          
        } catch (error) {
          console.error('Error loading exercises:', error);
          if (error && typeof error === 'object') {
            const errorDetails = {
              message: (error as any).message,
              status: (error as any).response?.status,
              statusText: (error as any).response?.statusText,
              data: (error as any).response?.data
            };
            console.error('Error details:', errorDetails);
            
            if ((error as any).response?.status === 403) {
              setAuthError("Authentication failed. Please log in again.");
            } else {
              setAuthError("Failed to load exercises. Please try again.");
            }
          }
        } finally {
          setIsFetching(false);
        }
      } else {
     
      }
    };

    loadExerciseData();
  }, [isClient, isLoaded, isSignedIn, hasTriedFetch, topicId, getAllExercises, getToken]);

  // Check authentication status
  useEffect(() => {
    if (isClient && isLoaded) {
      if (!isSignedIn) {
        setAuthError("Please log in to access exercises");
      } else {
        setAuthError(null);
      }
    }
  }, [isClient, isLoaded, isSignedIn]);

  return {
    exercises,
    isLoading: isStoreLoading || isFetching || !isClient || !isLoaded,
    error: authError || error,
    isAuthenticated: isClient && isLoaded && isSignedIn,
  };
}
