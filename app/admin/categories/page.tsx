"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { toast } from "react-hot-toast";

type Category = {
  id: string;
  name: string;
  type: string;
  description: string;
  order: number;
  created_at: string;
};

const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();
  const { userRole, isRoleLoading, isSignedIn } = useUserRole();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirm) return;

    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Xóa không thành công");

      toast.success("Đã xóa danh mục!");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xóa");
    }
  };

  useEffect(() => {
    if (isSignedIn && (userRole === "admin" || userRole === "staff")) {
      fetchCategories();
    }
  }, [userRole, isSignedIn]);

  if (isRoleLoading) return <p>Đang tải vai trò người dùng...</p>;
  if (!isSignedIn) return <p>Vui lòng đăng nhập</p>;
  if (userRole !== "admin" && userRole !== "staff") return <p>Bạn không có quyền</p>;

  return (
    <div className="p-6 text-white min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-primary-400">Danh sách Category</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <p className="text-sm text-gray-400">Loại: {cat.type}</p>
                <p className="text-sm text-gray-400">Mô tả: {cat.description}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="border text-blue-400"
                  onClick={() => router.push(`/admin/categories/${cat.id}/edit`)}
                >
                  Sửa
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => handleDelete(cat.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;
