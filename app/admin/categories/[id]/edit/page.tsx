"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "react-hot-toast";
import BaseForm from "@/components/form/BaseForm";
import { getCategoryById, updateCategoryById } from "@/services/category";
import { CreateCategoryPayload } from "@/services/types/category";

const EditCategoryPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { isSignedIn, userRole, isRoleLoading } = useUserRole();
  const { getToken } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = await getCategoryById(id as string);
        if (!category) throw new Error("Không tìm thấy danh mục");

        setName(category.name || "");
        setType(category.type || "");
        setDescription(category.description || "");
      } catch (error: any) {
        toast.error(error.message || "Lỗi khi tải danh mục.");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!name || !type) {
      toast.error("Vui lòng nhập đầy đủ Tên và Loại");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getToken() || "";

      const payload: Partial<CreateCategoryPayload> = {
        name,
        type,
        description,
      };

      await updateCategoryById(id as string, payload, token);
      toast.success("Cập nhật danh mục thành công!");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật danh mục.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!isSignedIn || (userRole !== "admin" && userRole !== "staff")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p>Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8 flex justify-center items-start">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-400">Chỉnh sửa Category</h1>

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
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          submitLabel="Cập nhật Category"
        />
      </div>
    </div>
  );
};

export default EditCategoryPage;
