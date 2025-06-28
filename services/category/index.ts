import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { Category } from "../types/category";

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await axiosInstance
      .get(ENDPOINTS.CATEGORY.GET_ALL)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return [];
      })
      .catch((e) => {
        console.error("Error fetching categories:", e);
        return [];
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
