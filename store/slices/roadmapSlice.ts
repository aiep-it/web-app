import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Roadmap } from '@/services/types/roadmap';
import { getRoadmap, getRoadmapById, createRoadmap } from '@/services/roadmap';
import { RoadmapPayload } from '@/services/types/roadmap';

// Async thunks
export const fetchRoadmaps = createAsyncThunk(
  'roadmap/fetchRoadmaps',
  async (_, { rejectWithValue }) => {
    try {
      const roadmaps = await getRoadmap();
      return roadmaps;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch roadmaps');
    }
  }
);

export const fetchRoadmapById = createAsyncThunk(
  'roadmap/fetchRoadmapById',
  async (id: string, { rejectWithValue }) => {
    try {
      const roadmap = await getRoadmapById(id);
      return roadmap;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch roadmap');
    }
  }
);

export const createNewRoadmap = createAsyncThunk(
  'roadmap/createRoadmap',
  async (payload: RoadmapPayload, { rejectWithValue }) => {
    try {
      const roadmap = await createRoadmap(payload);
      return roadmap;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create roadmap');
    }
  }
);

interface RoadmapState {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const initialState: RoadmapState = {
  roadmaps: [],
  currentRoadmap: null,
  isLoading: false,
  isCreating: false,
  error: null,
};

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRoadmap: (state) => {
      state.currentRoadmap = null;
    },
    setCurrentRoadmap: (state, action: PayloadAction<Roadmap>) => {
      state.currentRoadmap = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch roadmaps
    builder
      .addCase(fetchRoadmaps.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoadmaps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roadmaps = action.payload;
      })
      .addCase(fetchRoadmaps.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch roadmap by ID
      .addCase(fetchRoadmapById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoadmapById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRoadmap = action.payload;
      })
      .addCase(fetchRoadmapById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create roadmap
      .addCase(createNewRoadmap.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createNewRoadmap.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload) {
          state.roadmaps.push(action.payload);
        }
      })
      .addCase(createNewRoadmap.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentRoadmap, setCurrentRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;
