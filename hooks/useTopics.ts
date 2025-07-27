import { useCallback } from 'react';
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
  
  // Helper to get topics by roadmap ID
  const getTopicsForRoadmap = (roadmapId: string) => {
    return useSelector((state: RootState) => 
      selectTopicsByRoadmap(state, roadmapId)
    );
  };

  // Helper to get loading state by roadmap ID
  const getLoadingForRoadmap = (roadmapId: string) => {
    return useSelector((state: RootState) => 
      selectTopicLoading(state, roadmapId)
    );
  };
  
  return {
    error,
    getTopicsByRoadmap,
    getTopicsForRoadmap,
    getLoadingForRoadmap,
    selectTopicsByRoadmap,
  };
};

export default useTopics;
