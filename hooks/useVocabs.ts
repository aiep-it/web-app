import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/rootReducer';
import { useAppDispatch } from '@/store/hooks';
import {
  fetchVocabs,
  selectVocabs,
  selectVocabsByTopic,
  selectVocabLoading,
  selectVocabError,
  selectVocabPagination
} from '@/store/slices/vocabSlice';
import { VocabSearchPayload } from '@/services/types/vocab';
import { getByTopicId } from '@/services/vocab';

export const useVocabs = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const vocabs = useSelector((state: RootState) => selectVocabs(state));
  const loading = useSelector((state: RootState) => selectVocabLoading(state));
  const error = useSelector((state: RootState) => selectVocabError(state));
  const pagination = useSelector((state: RootState) => selectVocabPagination(state));
  
  // Actions
  const getVocabs = useCallback((payload?: VocabSearchPayload) => {
    return dispatch(fetchVocabs(payload));
  }, [dispatch]);
  
  // Helper to get vocabs by topic ID from Redux
  const getVocabsForTopic = (topicId: string) => {
    return useSelector((state: RootState) => 
      selectVocabsByTopic(state, topicId)
    );
  };

  // Helper to fetch vocabs directly from API by topic ID
  const fetchVocabsByTopicId = useCallback(async (topicId: string) => {
    try {
      const vocabsData = await getByTopicId(topicId);
      
      if (vocabsData && Array.isArray(vocabsData)) {
        return vocabsData;
      } else if (vocabsData && vocabsData.content && Array.isArray(vocabsData.content)) {
        return vocabsData.content;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching vocabs by topic:', error);
      return [];
    }
  }, []);
  
  // Helper to count vocabularies by topic ID
  const getVocabCountForTopic = useCallback((topicId: string, currentState: RootState) => {
    const topicVocabs = selectVocabsByTopic(currentState, topicId);
    return topicVocabs?.length || 0;
  }, []);
  
  return {
    vocabs,
    loading,
    error,
    pagination,
    getVocabs,
    getVocabsForTopic,
    fetchVocabsByTopicId, // New method for direct API fetch
    getVocabCountForTopic,
    selectVocabsByTopic, // Export selector to use in components
  };
};

export default useVocabs;
