import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { useAppDispatch } from '@/store/hooks';
import { 
  fetchTopicsByRoadmap, 
  selectTopicsByRoadmap,
  selectTopicError,
  selectTopicLoading
} from '@/store/slices/topicSlice';

export const useTopics = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const error = useSelector((state: RootState) => selectTopicError(state));
  
  // Actions - use useCallback to prevent recreation on every render
  const getTopicsByRoadmap = useCallback((roadmapId: string) => {
    return dispatch(fetchTopicsByRoadmap(roadmapId));
  }, [dispatch]);
  
  // Helper functions - memoized to prevent recreation
  const getTopicsForRoadmap = useCallback((roadmapId: string) => {
    return useSelector((state: RootState) => 
      selectTopicsByRoadmap(state, roadmapId)
    );
  }, []);

  const getLoadingForRoadmap = useCallback((roadmapId: string) => {
    return useSelector((state: RootState) => 
      selectTopicLoading(state, roadmapId)
    );
  }, []);
  
  return useMemo(() => ({
    error,
    getTopicsByRoadmap,
    getTopicsForRoadmap,
    getLoadingForRoadmap,
    selectTopicsByRoadmap,
  }), [error, getTopicsByRoadmap, getTopicsForRoadmap, getLoadingForRoadmap]);
};

export default useTopics;
