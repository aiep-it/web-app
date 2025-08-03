"use client";

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import {
  fetchUserByClerkId,
  clearError,
  clearCurrentUser,
  setCurrentUser,
  updateUserData,
  resetUserState,
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUserInitialized,
  selectUserId,
  selectUserRole,
  selectUserEmail,
  selectUserFullName,
} from '@/store/slices/userSlice';
import { UserData } from '@/services/types/user';

export function useUser() {
  const dispatch = useAppDispatch();
  const { userId: clerkUserId, isLoaded, isSignedIn } = useAuth();
  
  // Selectors
  const currentUser = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const isInitialized = useAppSelector(selectUserInitialized);
  const userId = useAppSelector(selectUserId);
  const userRole = useAppSelector(selectUserRole);
  const userEmail = useAppSelector(selectUserEmail);
  const userFullName = useAppSelector(selectUserFullName);

  useEffect(() => {
    const autoFetchUser = async () => {
      if (isLoaded && isSignedIn && clerkUserId && (!isInitialized || !currentUser)) {
        try {
          await dispatch(fetchUserByClerkId(clerkUserId)).unwrap();
        } catch (error) {
          console.error('Error auto-fetching user:', error);
        }
      }

      // If user is not signed in then clear user data
      if (isLoaded && !isSignedIn && currentUser) {
        dispatch(clearCurrentUser());
      }
    };

    autoFetchUser();
  }, [isLoaded, isSignedIn, clerkUserId, isInitialized, currentUser, dispatch]);

  // Actions
  const fetchUser = useCallback(async (clerkId: string) => {
    try {
      const result = await dispatch(fetchUserByClerkId(clerkId)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(clearCurrentUser());
  }, [dispatch]);

  const setUser = useCallback((user: UserData) => {
    dispatch(setCurrentUser(user));
  }, [dispatch]);

  const updateUser = useCallback((updates: Partial<UserData>) => {
    dispatch(updateUserData(updates));
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetUserState());
  }, [dispatch]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (clerkUserId) {
      return await fetchUser(clerkUserId);
    }
  }, [clerkUserId, fetchUser]);

  return {
    // Data
    currentUser,
    userId,          
    userRole,
    userEmail,
    userFullName,
    clerkUserId,    
    
    // States
    isLoading,
    error,
    isInitialized,
    isSignedIn,
    isLoaded,
    
    // Actions
    fetchUser,
    refreshUser,
    clearUserError,
    logout,
    setUser,
    updateUser,
    resetState,
  };
}

// Hook đơn giản để chỉ lấy user ID
export function useUserId() {
  const userId = useAppSelector(selectUserId);
  const isLoading = useAppSelector(selectUserLoading);
  const isInitialized = useAppSelector(selectUserInitialized);
  
  return {
    userId,
    isLoading,
    isReady: isInitialized && !isLoading,
  };
}

// Hook to check role
export function useUserRole() {
  const userRole = useAppSelector(selectUserRole);
  const isLoading = useAppSelector(selectUserLoading);
  const isInitialized = useAppSelector(selectUserInitialized);
  
  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';
  
  return {
    userRole,
    isAdmin,
    isUser,
    isLoading,
    isReady: isInitialized && !isLoading,
  };
}
