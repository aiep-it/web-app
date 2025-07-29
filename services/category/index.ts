import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { Category } from "../types/category";
import { CategoryCreateForm } from "@/app/admin/roadmaps/categories/types";

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

export async function addNewCategory(payload: CategoryCreateForm): Promise<Category | null> {
  try {
    return await axiosInstance
      .post(ENDPOINTS.CATEGORY.CREATE, payload)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        }
        return null;
      })
      .catch((e) => {
        console.error("Error fetching categories:", e);
        return null;
      });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
}

