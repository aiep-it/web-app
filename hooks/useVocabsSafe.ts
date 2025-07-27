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

export const useVocabsSafe = () => {
  const dispatch = useAppDispatch();
  
  // Selectors with fallback
  const vocabs = useSelector((state: RootState) => {
    try {
      return selectVocabs(state);
    } catch (error) {
      console.error('Error selecting vocabs:', error);
      return [];
    }
  });
  
  const loading = useSelector((state: RootState) => {
    try {
      return selectVocabLoading(state);
    } catch (error) {
      return false;
    }
  });
  
  const error = useSelector((state: RootState) => {
    try {
      return selectVocabError(state);
    } catch (error) {
      return null;
    }
  });
  
  const pagination = useSelector((state: RootState) => {
    try {
      return selectVocabPagination(state);
    } catch (error) {
      return null;
    }
  });
  
  // Actions with error handling like VocabularyListPage
  const getVocabs = useCallback(async (payload?: VocabSearchPayload) => {
    try {
      const result = await dispatch(fetchVocabs(payload));
      
      if (fetchVocabs.fulfilled.match(result)) {
        return result.payload;
      } else if (fetchVocabs.rejected.match(result)) {
        // Log error but don't throw, similar to VocabularyListPage
        console.error('Failed to fetch vocabs:', result.error);
        return undefined;
      }
    } catch (error) {
      console.error('Error in getVocabs:', error);
      // Return undefined instead of throwing error, similar to VocabularyListPage
      return undefined;
    }
  }, [dispatch]);

  // Helper to get vocabs by topic ID with fallback
  const getVocabsForTopic = useCallback((topicId: string) => {
    try {
      return useSelector((state: RootState) => 
        selectVocabsByTopic(state, topicId)
      );
    } catch (error) {
      console.error('Error getting vocabs for topic:', topicId, error);
      return [];
    }
  }, []);
  
  return {
    vocabs,
    loading,
    error,
    pagination,
    getVocabs,
    getVocabsForTopic,
    selectVocabsByTopic,
  };
};

export default useVocabsSafe;
