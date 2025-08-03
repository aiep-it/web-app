import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VocabData, VocabSearchPayload, VocabListResponse, VocabColumn } from '@/services/types/vocab';
import { getMyVocabs, searchListVocab } from '@/services/vocab';

// Async thunk to fetch vocabularies
export const fetchVocabs = createAsyncThunk(
  'vocab/fetchVocabs',
  async (payload: VocabSearchPayload | undefined = undefined, { rejectWithValue }) => {
    try {
      // const defaultPayload: VocabSearchPayload = {
      //   page: 1,
      //   size: 50,
      //   sort: [
      //     {
      //       field: VocabColumn.created_at,
      //       order: "desc",
      //     }
      //   ],
      //   ...(payload || {})
      // };
      
      const res = await getMyVocabs();
      
      if (res && typeof res === "object" && "content" in res) {
        return res as VocabListResponse;
      } else {
        return undefined;
      }
    } catch (error: any) {
      console.error('Error in fetchVocabs:', error);
      throw error;
    }
  }
);

interface VocabState {
  vocabs: VocabData[];
  vocabsByTopic: Record<string, VocabData[]>; // topicId -> vocabs[]
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  } | null;
}

const initialState: VocabState = {
  vocabs: [],
  vocabsByTopic: {},
  loading: false,
  error: null,
  pagination: null,
};

const vocabSlice = createSlice({
  name: 'vocab',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVocabs: (state) => {
      state.vocabs = [];
      state.vocabsByTopic = {};
    },
    updateVocabInStore: (state, action) => {
      const { id, updates } = action.payload;
      
      // Update in main vocabs array
      const vocabIndex = state.vocabs.findIndex(vocab => vocab.id === id);
      if (vocabIndex !== -1) {
        state.vocabs[vocabIndex] = { ...state.vocabs[vocabIndex], ...updates };
        
        // Re-group vocabs by topic to update vocabsByTopic
        state.vocabsByTopic = state.vocabs.reduce((acc, vocab) => {
          const topicId = vocab.topicId;
          if (!acc[topicId]) {
            acc[topicId] = [];
          }
          acc[topicId].push(vocab);
          return acc;
        }, {} as Record<string, VocabData[]>);
      }
    },
    groupVocabsByTopic: (state) => {
      // Group vocabs by topicId (changed from nodeId)
      state.vocabsByTopic = state.vocabs.reduce((acc, vocab) => {
        const topicId = vocab.topicId;
        if (!acc[topicId]) {
          acc[topicId] = [];
        }
        acc[topicId].push(vocab);
        return acc;
      }, {} as Record<string, VocabData[]>);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vocabs
      .addCase(fetchVocabs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVocabs.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && typeof action.payload === "object" && "content" in action.payload) {
          const response = action.payload as VocabListResponse;
          state.vocabs = response.content || [];
          state.pagination = {
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            first: response.first,
            last: response.last,
            empty: response.empty,
          };
        } else {
          state.vocabs = [];
          state.pagination = null;
        }
        
        // Auto-group vocabs by topic after fetching
        state.vocabsByTopic = state.vocabs.reduce((acc, vocab) => {
          const topicId = vocab.topicId; // Changed from nodeId to topicId
          if (!acc[topicId]) {
            acc[topicId] = [];
          }
          acc[topicId].push(vocab);
          return acc;
        }, {} as Record<string, VocabData[]>);
      })
      .addCase(fetchVocabs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearVocabs, updateVocabInStore, groupVocabsByTopic } = vocabSlice.actions;

// Selectors
export const selectVocabs = (state: { vocab: VocabState }) => state.vocab.vocabs;
export const selectVocabsByTopic = (state: { vocab: VocabState }, topicId: string) => 
  state.vocab.vocabsByTopic[topicId] || [];
export const selectVocabLoading = (state: { vocab: VocabState }) => state.vocab.loading;
export const selectVocabError = (state: { vocab: VocabState }) => state.vocab.error;
export const selectVocabPagination = (state: { vocab: VocabState }) => state.vocab.pagination;

export default vocabSlice.reducer;
