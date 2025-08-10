'use client';

import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRoadmaps, clearError } from '@/store/slices/roadmapSlice';

export const useRoadmaps = () => {
  const dispatch = useAppDispatch();
  const { roadmaps, isLoading, error } = useAppSelector((state) => state.roadmap);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const fetchAttempts = useRef<number>(0);
  const maxRetries = 3;
  const minRetryDelay = 5000; // 5 seconds

  const fetchData = useCallback(() => {
    const now = Date.now();
    
    // Rate limiting: prevent too frequent calls
    if (now - lastFetchTime.current < minRetryDelay && fetchAttempts.current > 0) {
      return;
    }

    // Max retries check
    if (fetchAttempts.current >= maxRetries) {
      return;
    }
    fetchAttempts.current += 1;
    lastFetchTime.current = now;
    dispatch(fetchRoadmaps());
  }, [dispatch, maxRetries, minRetryDelay]);

  // Only fetch once when component mounts, unless explicitly refetched
  useEffect(() => {
    if (!hasTriedFetch && roadmaps.length === 0 && !isLoading) {
      setHasTriedFetch(true);
      fetchData();
    }
  }, [hasTriedFetch, roadmaps.length, isLoading, fetchData]);

  // Reset attempts counter when fetch succeeds
  useEffect(() => {
    if (roadmaps.length > 0 && !error) {
      fetchAttempts.current = 0;
    }
  }, [roadmaps.length, error]);

  const refetch = useCallback(() => {
    dispatch(clearError());
    setHasTriedFetch(false); // Reset the flag to allow refetch
    fetchAttempts.current = 0; // Reset attempts counter for manual refetch
    lastFetchTime.current = 0; // Reset rate limiting for manual refetch
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  return useMemo(() => ({
    roadmaps,
    isLoading,
    error,
    refetch,
    fetchData,
  }), [roadmaps, isLoading, error, refetch, fetchData]);
};

export default useRoadmaps;
