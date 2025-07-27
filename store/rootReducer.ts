import { combineReducers, AnyAction } from '@reduxjs/toolkit';
import roadmapReducer from './slices/roadmapSlice';
import topicReducer from './slices/topicSlice';
import vocabReducer from './slices/vocabSlice';
// import { exampleSlice } from './slices/exampleSlice';
// import { authSlice } from './slices/authSlice';

// Root reducer combine all slice reducers
export const rootReducer = combineReducers({
  roadmap: roadmapReducer,
  topic: topicReducer,
  vocab: vocabReducer,
  // auth: authSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
