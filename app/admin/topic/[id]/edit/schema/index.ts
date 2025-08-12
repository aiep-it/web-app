import * as yup from "yup";
import { TopicContent, TopicContentForm } from "../types";
import { Roadmap } from "@/services/types/roadmap";

export const topicFormSchema: yup.ObjectSchema<TopicContentForm> = yup.object({
  id: yup.string().required("Node ID is required"),

  content: yup
    .string()
    .min(3, "Content must be at least 10 characters")
    .max(5000, "Content must be at most 5000 characters")
    .required("Content is required"),

  coverImage: yup.mixed<string | File>().optional(),

  title: yup
    .string()
    .min(1, "Title must be at least 1 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),

  description: yup
    .string()
    .min(3, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),

    suggestionLevel: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .optional(),
});
