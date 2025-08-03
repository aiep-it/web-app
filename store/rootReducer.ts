import { combineReducers, AnyAction } from '@reduxjs/toolkit';
import roadmapReducer from './slices/roadmapSlice';
import topicReducer from './slices/topicSlice';
import vocabReducer from './slices/vocabSlice';
import exerciseReducer from './slices/exerciseSlice';
import userReducer from './slices/userSlice';
// import { authSlice } from './slices/authSlice';

// Root reducer combine all slice reducers
export const rootReducer = combineReducers({
  roadmap: roadmapReducer,
  topic: topicReducer,
  vocab: vocabReducer,
  exercise: exerciseReducer,
  user: userReducer,
  // auth: authSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
