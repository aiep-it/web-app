import * as yup from "yup";
import type { CreateCategoryPayload } from "@/services/types/category";

export const categorySchema: yup.ObjectSchema<CreateCategoryPayload> = yup.object({
  name: yup
    .string()
    .min(3, "Tên phải có ít nhất 3 ký tự")
    .max(50, "Tên tối đa 50 ký tự")
    .required("Tên không được bỏ trống"),

  type: yup
    .string()
    .oneOf(["role", "skill"], "Loại không hợp lệ (phải là role hoặc skill)")
    .required("Loại danh mục là bắt buộc"),

  description: yup
    .string()
    .max(300, "Mô tả tối đa 300 ký tự")
    .optional()
});
