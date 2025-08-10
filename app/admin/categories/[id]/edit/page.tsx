"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import BaseForm from "../../../../../components/form/BaseForm";

const EditCategoryPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userRole, isRoleLoading, isSignedIn } = useUserRole();
  const { getToken } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Không tìm thấy danh mục.");

        const data = await res.json();
        setName(data.name || "");
        setType(data.type || "");
        setDescription(data.description || "");
      } catch (error: any) {
        toast.error(error.message || "Lỗi khi tải danh mục.");
        router.push("/admin/categories");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, getToken, router]);

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type, description }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }

      toast.success("Cập nhật danh mục thành công!");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật danh mục.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isRoleLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <p className="text-lg">Đang tải...</p>
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
          isSubmitting={submitting}
          submitLabel="Cập nhật Category"
        />
      </div>
    </div>
  );
};

export default EditCategoryPage;
