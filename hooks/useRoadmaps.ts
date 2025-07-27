'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRoadmaps, clearError } from '@/store/slices/roadmapSlice';

export const useRoadmaps = () => {
  const dispatch = useAppDispatch();
  const { roadmaps, isLoading, error } = useAppSelector((state) => state.roadmap);

  const fetchData = () => {
    dispatch(fetchRoadmaps());
  };

  useEffect(() => {
    if (roadmaps.length === 0 && !isLoading && !error) {
      fetchData();
    }
  }, [dispatch, roadmaps.length, isLoading, error]);

  const refetch = () => {
    dispatch(clearError());
    dispatch(fetchRoadmaps());
  };

  return {
    roadmaps,
    isLoading,
    error,
    refetch,
    fetchData,
  };
};

export default useRoadmaps;
