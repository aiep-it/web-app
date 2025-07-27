import { createAsyncThunk } from '@reduxjs/toolkit';

// Generic async thunk creator
export const createAsyncThunkWithErrorHandling = <T, U>(
  typePrefix: string,
  payloadCreator: (arg: U) => Promise<T>
) => {
  return createAsyncThunk<T, U, { rejectValue: string }>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await payloadCreator(arg);
      } catch (error) {
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
      }
    }
  );
};

// Helper function to create loading state
export const createLoadingState = () => ({
  loading: false,
  error: null as string | null,
});

// Helper function to handle async states
export const handleAsyncStates = {
  pending: (state: { loading: boolean; error: string | null }) => {
    state.loading = true;
    state.error = null;
  },
  fulfilled: (state: { loading: boolean; error: string | null }) => {
    state.loading = false;
  },
  rejected: (state: { loading: boolean; error: string | null }, action: { payload?: string }) => {
    state.loading = false;
    state.error = action.payload || 'An error occurred';
  },
};
