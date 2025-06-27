// services/category/index.ts
import { Category,CreateCategoryPayload } from "@/types/category/index";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Lỗi khi tải danh mục");

  const data = await res.json();
  return data.sort((a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0));
};
export const deleteCategoryById = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Xoá thất bại");
};
export const createCategory = async (
  payload: CreateCategoryPayload,
  token: string
): Promise<void> => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
  const res = await fetch(`${backendUrl}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi khi tạo danh mục");
  }
};