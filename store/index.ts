import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';
import { rootReducer } from './rootReducer';
import { customMiddleware } from './middleware';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [], // Add slice names you want to persist here
  blacklist: [], // Add slice names you don't want to persist here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(customMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
};

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Store instance for client-side
export const store = makeStore();
export const persistor = persistStore(store);

// Wrapper for Next.js
export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV === 'development',
});
