
// services/category/index.ts
import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/constant/api";
import { Category, CreateCategoryPayload } from "../types/category";

// Lấy tất cả danh mục

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORY.GET_ALL);
    return response.status === 200 ? response.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Xoá danh mục theo ID
export const deleteCategoryById = async (id: string, token: string): Promise<void> => {
  try {
    await axiosInstance.delete(ENDPOINTS.CATEGORY.DELETE(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Xoá thất bại");
  }
};

// Tạo danh mục mới
export const createCategory = async (
  payload: CreateCategoryPayload,
  token: string
): Promise<void> => {
  try {
    await axiosInstance.post(ENDPOINTS.CATEGORY.CREATE, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    const message = error?.response?.data?.message || "Lỗi khi tạo danh mục";
    console.error("Error creating category:", error);
    throw new Error(message);
  }
};

// Cập nhật danh mục
export const updateCategoryById = async (
  id: string,
  payload: Partial<CreateCategoryPayload>,
  token: string
): Promise<void> => {
  try {
    await axiosInstance.put(ENDPOINTS.CATEGORY.UPDATE(id), payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    const message = error?.response?.data?.message || "Lỗi khi cập nhật danh mục";
    console.error("Error updating category:", error);
    throw new Error(message);
  }
};

// Lấy danh mục theo ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORY.GET_BY_ID(id));
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
};
