//web-app\lib\axios.ts
import { getApiUrl } from "@/utils";
import { handleExpection } from "@/utils/expections";
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error", error.status)
    handleExpection({status: error?.status || 400});
    return Promise.reject(error);
  }
);

export default axiosInstance;
