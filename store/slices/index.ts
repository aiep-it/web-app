// Export tất cả slices ở đây
export { default as roadmapSlice } from './roadmapSlice';
export { default as topicSlice } from './topicSlice';
export { default as vocabSlice } from './vocabSlice';
// export { default as authSlice } from './authSlice';
// export { default as userSlice } from './userSlice';

// Export actions from roadmapSlice
export { 
  fetchRoadmaps,
  fetchRoadmapById,
  createNewRoadmap,
  clearError as clearRoadmapError,
  setCurrentRoadmap,
  clearCurrentRoadmap
} from './roadmapSlice';

// Export actions from topicSlice
export {
  fetchTopicsByRoadmap,
  fetchTopicById,
  createNewTopic,
  updateExistingTopic,
  clearError as clearTopicError,
  clearCurrentTopic,
  setCurrentTopic,
  clearTopicsForRoadmap,
  selectTopicsByRoadmap,
  selectCurrentTopic,
  selectTopicLoading,
  selectTopicError,
  selectIsCreating,
  selectIsUpdating
} from './topicSlice';

// Export actions từ vocabSlice
export {
  fetchVocabs,
  clearError as clearVocabError,
  clearVocabs,
  groupVocabsByTopic,
  selectVocabs,
  selectVocabsByTopic,
  selectVocabLoading,
  selectVocabError,
  selectVocabPagination
} from './vocabSlice';

// export * from './authSlice';
// export * from './userSlice';
