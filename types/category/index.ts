// types/category.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  type?: string;
  order?: number;
}
export interface CreateCategoryPayload {
  name: string;
  description?: string;
  type: string;
}