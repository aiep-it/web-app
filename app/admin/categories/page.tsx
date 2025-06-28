"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { toast } from "react-hot-toast";
import BaseCard from "@/components/card/BaseCard";

const CategoryListPage = () => {
  const { getToken } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const router = useRouter();

  type Category = {
    id: string;
    name: string;
    description: string;
    type?: string;
    order?: number;
  };

  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      toast.error("Không thể tải danh mục");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Xoá thất bại");

      toast.success("Đã xoá category");
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      toast.error("Lỗi khi xoá category");
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchCategories();
  }, [isSignedIn]);

  if (isRoleLoading) return <p className="text-center mt-20 text-gray-400">Đang tải quyền người dùng...</p>;
  // if (!isSignedIn) return <p className="text-center mt-20 text-red-400">Bạn chưa đăng nhập.</p>;
  // if (userRole !== "admin" && userRole !== "staff") return <p className="text-center mt-20 text-yellow-400">Bạn không có quyền truy cập.</p>;

  return (
    <div className="min-h-screen dark:bg-black text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories List</h1>
        <Link href="/admin/categories/addcategories">
          <Button className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white">
            + Thêm Category
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <BaseCard
            key={cat.id}
            id={cat.id}
            name={cat.name}
            description={cat.description}
            onDelete={handleDelete}
            editUrl={`categories/${cat.id}/edit`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
