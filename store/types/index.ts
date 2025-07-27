// Store types
export interface RootState {
  // Auto generate rootReducer
  // Temporarily left empty to avoid circular dependency
}

// Action types
export interface BaseAction {
  type: string;
  payload?: unknown;
}

// Async thunk types
export interface AsyncThunkState {
  loading: boolean;
  error: string | null;
}

// Common state patterns
export interface EntityState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
}

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}
