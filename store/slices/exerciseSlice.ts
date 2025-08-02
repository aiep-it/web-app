import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExerciseData, ExercisePayload } from '@/services/types/exercise';
import { createQuiz, getAllExercises, getExerciseById, updateExercise, deleteExercise } from '@/services/exercise';

// State interface
interface ExerciseState {
  exercises: ExerciseData[];
  exercisesByTopic: Record<string, ExerciseData[]>;
  currentExercise: ExerciseData | null;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

// Initial state
const initialState: ExerciseState = {
  exercises: [],
  exercisesByTopic: {},
  currentExercise: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

// Async thunks
export const fetchAllExercises = createAsyncThunk(
  'exercise/fetchAllExercises',
  async (_, { rejectWithValue }) => {
    try {
      const exercises = await getAllExercises();
      return exercises;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exercises');
    }
  }
);

export const fetchExerciseById = createAsyncThunk(
  'exercise/fetchExerciseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const exercise = await getExerciseById(id);
      if (!exercise) {
        return rejectWithValue('Exercise not found');
      }
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exercise');
    }
  }
);

export const createExercise = createAsyncThunk(
  'exercise/createExercise',
  async (payload: ExercisePayload, { rejectWithValue }) => {
    try {
      const exercise = await createQuiz(payload);
      if (!exercise) {
        return rejectWithValue('Failed to create exercise');
      }
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create exercise');
    }
  }
);

export const updateExerciseById = createAsyncThunk(
  'exercise/updateExercise',
  async ({ id, payload }: { id: string; payload: ExercisePayload }, { rejectWithValue }) => {
    try {
      const exercise = await updateExercise(id, payload);
      if (!exercise) {
        return rejectWithValue('Failed to update exercise');
      }
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update exercise');
    }
  }
);

export const deleteExerciseById = createAsyncThunk(
  'exercise/deleteExercise',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await deleteExercise(id);
      if (!success) {
        return rejectWithValue('Failed to delete exercise');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete exercise');
    }
  }
);

// Exercise slice
const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current exercise
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    },
    
    // Set current exercise
    setCurrentExercise: (state, action: PayloadAction<ExerciseData>) => {
      state.currentExercise = action.payload;
    },
    
    // Clear exercises by topic
    clearExercisesByTopic: (state, action: PayloadAction<string>) => {
      delete state.exercisesByTopic[action.payload];
    },
    
    // Reset all state
    resetExerciseState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all exercises
    builder
      .addCase(fetchAllExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
        
        // Group exercises by topicId
        const exercisesByTopic: Record<string, ExerciseData[]> = {};
        action.payload.forEach((exercise) => {
          if (!exercisesByTopic[exercise.topicId]) {
            exercisesByTopic[exercise.topicId] = [];
          }
          exercisesByTopic[exercise.topicId].push(exercise);
        });
        state.exercisesByTopic = exercisesByTopic;
      })
      .addCase(fetchAllExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch exercise by ID
    builder
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExercise = action.payload;
        
        // Update exercises array if exercise exists
        const existingIndex = state.exercises.findIndex(ex => ex.id === action.payload.id);
        if (existingIndex >= 0) {
          state.exercises[existingIndex] = action.payload;
        } else {
          state.exercises.push(action.payload);
        }
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create exercise
    builder
      .addCase(createExercise.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.createLoading = false;
        
        // Add to exercises array
        state.exercises.push(action.payload);
        
        // Add to exercisesByTopic
        const topicId = action.payload.topicId;
        if (!state.exercisesByTopic[topicId]) {
          state.exercisesByTopic[topicId] = [];
        }
        state.exercisesByTopic[topicId].push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // Update exercise
    builder
      .addCase(updateExerciseById.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateExerciseById.fulfilled, (state, action) => {
        state.updateLoading = false;
        
        // Update in exercises array
        const exerciseIndex = state.exercises.findIndex(ex => ex.id === action.payload.id);
        if (exerciseIndex >= 0) {
          state.exercises[exerciseIndex] = action.payload;
        }
        
        // Update in exercisesByTopic
        const topicId = action.payload.topicId;
        if (state.exercisesByTopic[topicId]) {
          const topicExerciseIndex = state.exercisesByTopic[topicId].findIndex(ex => ex.id === action.payload.id);
          if (topicExerciseIndex >= 0) {
            state.exercisesByTopic[topicId][topicExerciseIndex] = action.payload;
          }
        }
        
        // Update current exercise if it's the same
        if (state.currentExercise?.id === action.payload.id) {
          state.currentExercise = action.payload;
        }
      })
      .addCase(updateExerciseById.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // Delete exercise
    builder
      .addCase(deleteExerciseById.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteExerciseById.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload;
        
        // Remove from exercises array
        state.exercises = state.exercises.filter(ex => ex.id !== deletedId);
        
        // Remove from exercisesByTopic
        Object.keys(state.exercisesByTopic).forEach(topicId => {
          state.exercisesByTopic[topicId] = state.exercisesByTopic[topicId].filter(ex => ex.id !== deletedId);
        });
        
        // Clear current exercise if it's the deleted one
        if (state.currentExercise?.id === deletedId) {
          state.currentExercise = null;
        }
      })
      .addCase(deleteExerciseById.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentExercise,
  setCurrentExercise,
  clearExercisesByTopic,
  resetExerciseState,
} = exerciseSlice.actions;

// Selectors
export const selectAllExercises = (state: { exercise: ExerciseState }) => state.exercise.exercises;
export const selectExercisesByTopic = (state: { exercise: ExerciseState }, topicId: string) => 
  state.exercise.exercisesByTopic[topicId] || [];
export const selectCurrentExercise = (state: { exercise: ExerciseState }) => state.exercise.currentExercise;
export const selectExerciseLoading = (state: { exercise: ExerciseState }) => state.exercise.loading;
export const selectExerciseError = (state: { exercise: ExerciseState }) => state.exercise.error;
export const selectExerciseCreateLoading = (state: { exercise: ExerciseState }) => state.exercise.createLoading;
export const selectExerciseUpdateLoading = (state: { exercise: ExerciseState }) => state.exercise.updateLoading;
export const selectExerciseDeleteLoading = (state: { exercise: ExerciseState }) => state.exercise.deleteLoading;

// Export reducer
export default exerciseSlice.reducer;
