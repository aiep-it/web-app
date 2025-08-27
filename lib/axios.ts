import { getApiUrl } from "@/utils";
import { handleExpection } from "@/utils/expections";
import axios from "axios";

const secureTokenStorage = (() => {
  let authToken: string | null = null;
  let tokenExpiry: number | null = null;
  
  const tokenMap = new WeakMap<object, string>();
  const tokenKey = Object.freeze({});
  
  return {
    setToken: (token: string | null, expiresIn?: number): void => {
      if (token) {
        tokenMap.set(tokenKey, token);
        authToken = token;
        tokenExpiry = expiresIn ? Date.now() + expiresIn * 1000 : null;
      } else {
        tokenMap.delete(tokenKey);
        authToken = null;
        tokenExpiry = null;
      }
    },
    
    getToken: (): string | null => {
      if (tokenExpiry && Date.now() > tokenExpiry) {
        tokenMap.delete(tokenKey);
        authToken = null;
        tokenExpiry = null;
        return null;
      }
      
      const storedToken = tokenMap.get(tokenKey);
      if (storedToken !== authToken) {
        tokenMap.delete(tokenKey);
        authToken = null;
        tokenExpiry = null;
        return null;
      }
      
      return authToken;
    },
    
    clearToken: (): void => {
      tokenMap.delete(tokenKey);
      authToken = null;
      tokenExpiry = null;
    },
    
    isTokenExpired: (): boolean => {
      return !!(tokenExpiry && Date.now() > tokenExpiry);
    }
  };
})();

// Public functions to interact with the secure token storage
export const setAuthToken = (token: string | null, expiresIn?: number): void => {
  secureTokenStorage.setToken(token, expiresIn);
};

export const getAuthToken = (): string | null => {
  return secureTokenStorage.getToken();
};

export const clearAuthToken = (): void => {
  secureTokenStorage.clearToken();
};

export const isTokenExpired = (): boolean => {
  return secureTokenStorage.isTokenExpired();
};

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  timeout: 60000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const secureToken = getAuthToken();
    
    if (secureToken) {
      config.headers.Authorization = `Bearer ${secureToken}`;
    }
    else if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
        setAuthToken(localToken);
      }
    }
    
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() 
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


let isRefreshingToken = false;
const pendingRequests: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];


const processPendingRequests = (token: string | null): void => {
  pendingRequests.forEach(request => {
    if (token) {
      request.config.headers.Authorization = `Bearer ${token}`;
      request.resolve(axios(request.config));
    } else {
      request.reject({ message: 'Unable to refresh authentication token' });
    }
  });
  pendingRequests.length = 0;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (axios.isCancel(error) || error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
      return Promise.reject(error);
    }


    const originalConfig = error.config;
    
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        
        if (!isRefreshingToken) {
          isRefreshingToken = true;
          
          try {
            clearAuthToken();
            
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              
              const tokenExpiredEvent = new CustomEvent("auth:tokenExpired");
              window.dispatchEvent(tokenExpiredEvent);
            }
            
            isRefreshingToken = false;
            
            processPendingRequests(null);
            
            if (typeof window !== "undefined") {
            }
          } catch (refreshError) {
            isRefreshingToken = false;
            processPendingRequests(null);
            return Promise.reject(refreshError);
          }
        }
        
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve,
            reject,
            config: originalConfig
          });
        });
      }
      
      if (status === 403) {
        console.error("Access denied:", error.response.data);
      }
      
      if (status === 500) {
        console.error("Server error:", error.response.data);
      }
    }
    
    handleExpection({status: error.response?.status || 400});
    return Promise.reject(error);
  }
);

export const applyAuthTokenToRequest = (config: any): any => {
  const token = getAuthToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
};

export default axiosInstance;
