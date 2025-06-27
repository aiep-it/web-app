// 📁 app/admin/categories/addcategories/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import BaseForm from "@/components/form/BaseForm";
import { createCategory } from "@/services/category";

const AddCategoryPage = () => {
  const router = useRouter();
  const { getToken } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !type) {
      toast.error("Vui lòng nhập đầy đủ Tên và Loại");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      await createCategory({ name, type, description }, token || "");
      toast.success("Tạo danh mục thành công!");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tạo danh mục.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8 flex justify-center items-start">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-400">Add New Category</h1>
        <BaseForm
          fields={[
            {
              id: "name",
              label: "Tên Category",
              type: "text",
              value: name,
              onChange: setName,
              required: true,
            },
            {
              id: "type",
              label: "Loại Category",
              type: "select",
              value: type,
              onChange: setType,
              required: true,
              options: [
                { label: "Role Based", value: "role" },
                { label: "Skill Based", value: "skill" },
              ],
            },
            {
              id: "description",
              label: "Mô tả",
              type: "textarea",
              value: description,
              onChange: setDescription,
            },
          ]}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Tạo Category"
        />
      </div>
    </div>
  );
};

export default AddCategoryPage;
