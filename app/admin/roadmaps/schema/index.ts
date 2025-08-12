import * as yup from "yup";
import { RoadmapPayload } from "@/services/types/roadmap";

export const roadmapSchema: yup.ObjectSchema<RoadmapPayload> = yup.object({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name must be at most 40 characters")
    .required("Name is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),

  categoryId: yup
    .string()
    .required("Category is required"),
});
