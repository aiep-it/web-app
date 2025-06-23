"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

const EditCategoryPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { userRole, isRoleLoading, isSignedIn } = useUserRole();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không tìm thấy danh mục");

        const data = await res.json();
        setName(data.name);
        setType(data.type);
        setDescription(data.description || "");
        setOrder(data.order || 0);
      } catch (err: any) {
        toast.error(err.message || "Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn && (userRole === "admin" || userRole === "staff")) {
      fetchCategory();
    }
  }, [id, getToken, userRole, isSignedIn]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !type.trim()) {
      setFormError("Tên và loại là bắt buộc");
      toast.error("Tên và loại là bắt buộc");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/categories/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, type, description, order }),
        }
      );

      if (!res.ok) throw new Error("Cập nhật thất bại");

      toast.success("Đã cập nhật danh mục");
      router.push("/admin/categories");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (isRoleLoading) return <p className="text-white p-6">Đang tải...</p>;
  if (!isSignedIn) return <p className="text-white p-6">Vui lòng đăng nhập</p>;
  if (userRole !== "admin" && userRole !== "staff") return <p className="text-white p-6">Bạn không có quyền</p>;
  if (loading) return <p className="text-white p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8 flex justify-center items-start">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-400">Chỉnh sửa Category</h1>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-1 text-gray-300">Tên Category *</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm mb-1 text-gray-300">Loại Category *</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-primary-500"
              required
            >
              <option value="">Chọn loại</option>
              <option value="role">Role Based</option>
              <option value="skill">Skill Based</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm mb-1 text-gray-300">Mô tả</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm mb-1 text-gray-300">Thứ tự</label>
            <Input
              id="order"
              type="number"
              value={order.toString()}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="border border-gray-500 text-gray-300"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={saving}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {saving ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryPage;
