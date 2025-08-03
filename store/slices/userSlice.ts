import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '@/services/types/user';
import { getUserByClerkId } from '@/services/user';

// State interface
interface UserState {
  currentUser: UserData | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean; // To track if user has been loaded for the first time
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// Async thunks
export const fetchUserByClerkId = createAsyncThunk(
  'user/fetchUserByClerkId',
  async (clerkId: string, { rejectWithValue }) => {
    try {
      const user = await getUserByClerkId(clerkId);
      if (!user) {
        return rejectWithValue('User not found');
      }
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear current user (logout)
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isInitialized = false;
      state.error = null;
    },
    
    // Set current user manually
    setCurrentUser: (state, action: PayloadAction<UserData>) => {
      state.currentUser = action.payload;
      state.isInitialized = true;
    },
    
    // Update user data
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    
    // Set initialized flag
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    
    // Reset all state
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch user by Clerk ID
    builder
      .addCase(fetchUserByClerkId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByClerkId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(fetchUserByClerkId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isInitialized = true; // Still set true to avoid continuous retries
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentUser,
  setCurrentUser,
  updateUserData,
  setInitialized,
  resetUserState,
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserInitialized = (state: { user: UserState }) => state.user.isInitialized;

// Computed selectors
export const selectUserId = (state: { user: UserState }) => state.user.currentUser?.id;
export const selectUserRole = (state: { user: UserState }) => state.user.currentUser?.role;
export const selectUserEmail = (state: { user: UserState }) => state.user.currentUser?.email;
export const selectUserFullName = (state: { user: UserState }) => {
  const user = state.user.currentUser;
  return user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
};

// Export reducer
export default userSlice.reducer;
