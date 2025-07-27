import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TopicData } from '@/services/types/topic';
import { getTopicsByRoadmapId, getTopicId, createTopic, updateTopic } from '@/services/topic';
import { TopicPayload, TopicUpdatePayload } from '@/services/types/topic';

// Async thunks
export const fetchTopicsByRoadmap = createAsyncThunk(
  'topic/fetchTopicsByRoadmap',
  async (roadmapId: string, { rejectWithValue }) => {
    try {
      const topics = await getTopicsByRoadmapId(roadmapId);
      return { roadmapId, topics: topics || [] };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch topics');
    }
  }
);

export const fetchTopicById = createAsyncThunk(
  'topic/fetchTopicById',
  async (id: string, { rejectWithValue }) => {
    try {
      const topic = await getTopicId(id);
      return topic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch topic');
    }
  }
);

export const createNewTopic = createAsyncThunk(
  'topic/createTopic',
  async (payload: TopicPayload, { rejectWithValue }) => {
    try {
      const topic = await createTopic(payload);
      return topic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create topic');
    }
  }
);

export const updateExistingTopic = createAsyncThunk(
  'topic/updateTopic',
  async ({ id, payload }: { id: string; payload: TopicUpdatePayload }, { rejectWithValue }) => {
    try {
      const topic = await updateTopic(id, payload);
      return topic;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update topic');
    }
  }
);

interface TopicState {
  topicsByRoadmap: Record<string, TopicData[]>; // roadmapId -> topics[]
  currentTopic: TopicData | null;
  loadingStates: Record<string, boolean>; // roadmapId -> loading state
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: TopicState = {
  topicsByRoadmap: {},
  currentTopic: null,
  loadingStates: {},
  isCreating: false,
  isUpdating: false,
  error: null,
};

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTopic: (state) => {
      state.currentTopic = null;
    },
    setCurrentTopic: (state, action: PayloadAction<TopicData>) => {
      state.currentTopic = action.payload;
    },
    clearTopicsForRoadmap: (state, action: PayloadAction<string>) => {
      const roadmapId = action.payload;
      delete state.topicsByRoadmap[roadmapId];
      delete state.loadingStates[roadmapId];
    },
  },
  extraReducers: (builder) => {
    // Fetch topics by roadmap
    builder
      .addCase(fetchTopicsByRoadmap.pending, (state, action) => {
        const roadmapId = action.meta.arg;
        state.loadingStates[roadmapId] = true;
        state.error = null;
      })
      .addCase(fetchTopicsByRoadmap.fulfilled, (state, action) => {
        const { roadmapId, topics } = action.payload;
        state.loadingStates[roadmapId] = false;
        state.topicsByRoadmap[roadmapId] = topics;
      })
      .addCase(fetchTopicsByRoadmap.rejected, (state, action) => {
        const roadmapId = action.meta.arg;
        state.loadingStates[roadmapId] = false;
        state.error = action.payload as string;
      })
      // Fetch topic by ID
      .addCase(fetchTopicById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchTopicById.fulfilled, (state, action) => {
        state.currentTopic = action.payload;
      })
      .addCase(fetchTopicById.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create topic
      .addCase(createNewTopic.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewTopic.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload && action.payload.roadmap) {
          const roadmapId = action.payload.roadmap.id;
          if (!state.topicsByRoadmap[roadmapId]) {
            state.topicsByRoadmap[roadmapId] = [];
          }
          state.topicsByRoadmap[roadmapId].push(action.payload);
        }
      })
      .addCase(createNewTopic.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Update topic
      .addCase(updateExistingTopic.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateExistingTopic.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload && action.payload.roadmap) {
          const roadmapId = action.payload.roadmap.id;
          const topicIndex = state.topicsByRoadmap[roadmapId]?.findIndex(
            topic => topic.id === action.payload!.id
          );
          if (topicIndex !== undefined && topicIndex >= 0) {
            state.topicsByRoadmap[roadmapId][topicIndex] = action.payload;
          }
        }
        if (state.currentTopic?.id === action.payload?.id) {
          state.currentTopic = action.payload;
        }
      })
      .addCase(updateExistingTopic.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearCurrentTopic, 
  setCurrentTopic, 
  clearTopicsForRoadmap 
} = topicSlice.actions;

// Selectors
export const selectTopicsByRoadmap = (state: { topic: TopicState }, roadmapId: string) =>
  state.topic.topicsByRoadmap[roadmapId] || [];

export const selectCurrentTopic = (state: { topic: TopicState }) =>
  state.topic.currentTopic;

export const selectTopicLoading = (state: { topic: TopicState }, roadmapId: string) =>
  state.topic.loadingStates[roadmapId] || false;

export const selectTopicError = (state: { topic: TopicState }) =>
  state.topic.error;

export const selectIsCreating = (state: { topic: TopicState }) =>
  state.topic.isCreating;

export const selectIsUpdating = (state: { topic: TopicState }) =>
  state.topic.isUpdating;

export default topicSlice.reducer;
