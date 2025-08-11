import { useAuth } from "@clerk/nextjs";
import { useEffect, useCallback } from "react";
import { setAuthToken, clearAuthToken } from "@/lib/axios";

export const useAxiosAuth = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  
  const parseJwt = (token: string) => {
    try {
      if (typeof window === 'undefined') return null;
      
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error parsing JWT:", error);
      return null;
    }
  };
  
  const updateToken = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    if (!isLoaded) return;
    
    if (isSignedIn) {
      try {
        const token = await getToken();
        
        if (token) {
          const parsed = parseJwt(token);
          
          const expiresIn = parsed?.exp 
            ? parsed.exp - Math.floor(Date.now() / 1000) 
            : 3600; 
          
          setAuthToken(token, expiresIn);
        } else {
          clearAuthToken();
        }
      } catch (error) {
        console.error("Error getting Clerk token:", error);
        clearAuthToken();
      }
    } else {
      clearAuthToken();
    }
  }, [isLoaded, isSignedIn, getToken]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    updateToken();
    
    const intervalId = setInterval(updateToken, 5 * 60 * 1000);
    
    const handleTokenExpired = () => {
     
      updateToken();
    };
    
    window.addEventListener("auth:tokenExpired", handleTokenExpired);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("auth:tokenExpired", handleTokenExpired);
    };
  }, [updateToken]);
  
  return null;
};

export default useAxiosAuth;
