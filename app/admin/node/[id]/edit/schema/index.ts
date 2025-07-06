import * as yup from "yup";
import { NodeContent, NodeContentForm } from "../types";
import { Roadmap } from "@/services/types/roadmap";

export const nodeFormSchema: yup.ObjectSchema<NodeContentForm> = yup.object({
  id: yup.string().required("Node ID is required"),

  content: yup
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be at most 5000 characters")
    .required("Content is required"),

  coverImage: yup.mixed<string | File>().optional(),

  title: yup
    .string()
    .min(1, "Title must be at least 1 characters")
    .max(30, "Title must be at most 30 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),

    suggestionLevel: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
