// 📁 app/admin/roadmaps/addroadmap/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { createRoadmap } from "@/services/roadmap";
import BaseForm from "@/components/form/BaseForm";

const AddRoadmapPage = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Tên là bắt buộc.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = (await getToken()) || "";
      await createRoadmap({ name, description: description.trim() || "" }, token);
      toast.success("Tạo roadmap thành công!");
      router.push("/admin/roadmaps");
    } catch (err) {
      toast.error("Lỗi khi tạo roadmap.");
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
        ]}
        onSubmit={handleAdd}
        isSubmitting={isSubmitting}
        submitLabel="Tạo Roadmap"
      />
    </div>
  );
};

export default AddRoadmapPage;
