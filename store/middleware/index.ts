import { Middleware, AnyAction } from '@reduxjs/toolkit';

// Logger middleware - Only works in development
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  const typedAction = action as AnyAction;
  
  if (process.env.NODE_ENV === 'development') {
    console.group(typedAction.type);
    console.info('dispatching', typedAction);
   
  }
  
  const result = next(action);
  
  if (process.env.NODE_ENV === 'development') {
   
    console.groupEnd();
  }
  
  return result;
};

// Error handling middleware
const errorMiddleware: Middleware = () => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux error:', error);
    // Có thể thêm error reporting service ở đây
    throw error;
  }
};

// Analytics middleware - để track user actions
const analyticsMiddleware: Middleware = () => (next) => (action) => {
  // Thêm analytics tracking ở đây nếu cần
  // const typedAction = action as AnyAction;
  // analytics.track(typedAction.type, typedAction.payload);
  
  return next(action);
};

// Export tất cả middleware
export const customMiddleware = [
  process.env.NODE_ENV === 'development' ? loggerMiddleware : null,
  errorMiddleware,
  analyticsMiddleware,
].filter(Boolean) as Middleware[];
