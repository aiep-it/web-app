"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

import BaseForm from "@/components/form/BaseForm";
import { roadmapSchema } from "../schema";

import { createRoadmap } from "@/services/roadmap";
import { getAllCategories } from "@/services/category";

import { RoadmapPayload } from "@/services/types/roadmap";
import { Category } from "@/services/types/category";

const AddRoadmapPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch {
        toast.error("Không thể tải danh mục");
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    const payload: RoadmapPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      categoryId,
    };

    try {
      await roadmapSchema.validate(payload);
      setIsSubmitting(true);

      const token = (await getToken()) || "";
      await createRoadmap(payload, token);

      toast.success("Tạo roadmap thành công!");
      router.push("/admin/roadmaps");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tạo roadmap.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Add new Roadmap</h1>

      <BaseForm
        fields={[
          {
            id: "name",
            label: "Tên Roadmap",
            type: "text",
            value: name,
            onChange: setName,
            required: true,
          },
          {
            id: "description",
            label: "Mô tả",
            type: "textarea",
            value: description,
            onChange: setDescription,
          },
          {
            id: "categoryId",
            label: "Danh mục",
            type: "select",
            value: categoryId,
            onChange: setCategoryId,
            required: true,
            options: categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            })),
          },
        ]}
        onSubmit={handleAdd}
        isSubmitting={isSubmitting}
        submitLabel="Tạo Roadmap"
      />
    </div>
  );
};

export default AddRoadmapPage;
