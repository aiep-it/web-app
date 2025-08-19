// app/admin/categories/[id]/edit/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BaseForm from "../../../../../components/form/BaseForm";
import { useUserRole } from "@/hooks/useUserRole";
import { CategoryCreateForm } from "@/app/admin/roadmaps/categories/types";
import {
  getCategoryById,
  updateCategory,
} from "@/services/category";

const EditCategoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isRoleLoading } = useUserRole();

  const id = useMemo(() => {
    const raw = (params as Record<string, string | string[]>)?.id;
    return Array.isArray(raw) ? raw[0] : (raw as string);
  }, [params]);

  const [form, setForm] = useState<CategoryCreateForm>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        const data = await getCategoryById(id);
        if (!mounted) return;

        if (!data) {
          toast.error("Không tìm thấy danh mục.");
          router.push("/admin/categories");
          return;
        }

        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
        });
      } catch (e) {
        toast.error("Lỗi khi tải danh mục.");
        router.push("/admin/categories");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      const updated = await updateCategory(id, form);
      if (!updated) {
        toast.error("Cập nhật thất bại.");
        return;
      }
      toast.success("Cập nhật danh mục thành công!");
      router.push("/admin/categories");
    } catch {
      toast.error("Lỗi khi cập nhật danh mục.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100  text-black p-6 md:p-8 flex justify-center items-start">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-400">
          Chỉnh sửa Category
        </h1>

        <BaseForm
          fields={[
            {
              id: "name",
              label: "Tên Category",
              type: "text",
              value: form.name,
              onChange: (v: string) => setForm((s) => ({ ...s, name: v })),
              required: true,
            },
         
            {
              id: "description",
              label: "Mô tả",
              type: "textarea",
              value: form.description || "",
              onChange: (v: string) =>
                setForm((s) => ({ ...s, description: v })),
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
