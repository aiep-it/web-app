import * as yup from "yup";
import { CategoryCreateForm } from "../types";

export const categorySchema: yup.ObjectSchema<CategoryCreateForm> = yup.object({
  name: yup.string().required("Require"),
  description: yup.string().optional(),
});
