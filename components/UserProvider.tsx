'use client';

import React from 'react';
import { useUser } from '@/hooks/useUser';

interface UserProviderProps {
  children: React.ReactNode;
}

/**
 * UserProvider component - Automatically fetch user data when accessing the website
 * Should wrap in root level of the app to auto-load user for all components
 */
export function UserProvider({ children }: UserProviderProps) {
  const { 
    currentUser, 
    isLoading, 
    error, 
    isInitialized,
    isSignedIn,
    isLoaded 
  } = useUser();

  // Log user status for debugging
  // React.useEffect(() => {
  //   if (isLoaded) {
  //     console.log('User Status:', {
  //       isSignedIn,
  //       isInitialized,
  //       hasUser: !!currentUser,
  //       userId: currentUser?.id,
  //       userRole: currentUser?.role,
  //       error
  //     });
  //   }
  // }, [isLoaded, isSignedIn, isInitialized, currentUser, error]);

  return (
    <>
      {children}
    </>
  );
}

export function useAutoUser() {
  const { 
    currentUser, 
    userId, 
    userRole, 
    isLoading, 
    error,
    isInitialized,
    isSignedIn 
  } = useUser();

  const isReady = isInitialized && !isLoading;
  const hasUser = !!currentUser && isSignedIn;

  return {
    // User data
    user: currentUser,
    userId,           
    userRole,
    
    // Status
    isReady,          
    hasUser,          
    isLoading,
    error,
    isSignedIn,
    
    // Computed
    isAdmin: userRole === 'admin',
    isRegularUser: userRole === 'user',
  };
}
