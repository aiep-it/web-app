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

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    return await axiosInstance
      .get(ENDPOINTS.CATEGORY.GET_BY_ID(id))
      .then((response) => {
        if (response.status === 200) {
          return response.data as Category;
        }
        return null;
      })
      .catch((e) => {
        console.error("Error fetching category by id:", e);
        return null;
      });
  } catch (error) {
    console.error("Error fetching category by id:", error);
    return null; 
  }
}


export async function updateCategory(
  id: string,
  payload: CategoryCreateForm
): Promise<Category | null> {
  try {
    return await axiosInstance
      .put(ENDPOINTS.CATEGORY.UPDATE(id), payload)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return null;
      })
      .catch((e) => {
        console.error("Error updating category:", e);
        return null;
      });
  } catch (error) {
   
    return null;
  }
}
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    return await axiosInstance
      .delete(ENDPOINTS.CATEGORY.DELETE(id))
      .then((response) => {
        // Backend trả 204 No Content hoặc 200 Success đều coi là thành công
        return response.status === 204 || response.status === 200;
      })
      .catch((e) => {
        console.error("Error deleting category:", e);
        return false;
      });
  } catch (error) {
   
    return false;
  }
}