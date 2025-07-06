'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/nextjs";
import { getApiUrl } from "@/utils";
import axiosInstance from "@/lib/axios";

interface AuthContextType {
  axios: AxiosInstance | null;
}

const AuthContext = createContext<AuthContextType>({
  axios: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const initAxios = async () => {
      const token = await getToken();
      if(token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
     
      
    };

    initAxios();
  }, [getToken]);

  return (
    <AuthContext.Provider value={{ axios: axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
