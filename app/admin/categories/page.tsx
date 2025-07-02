// app/admin/categories/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { toast } from "react-hot-toast";
import BaseCard from "@/components/card/BaseCard";
import { getAllCategories, deleteCategoryById } from "@/services/category";
import type { Category } from "@/services/types/category";

const CategoryListPage = () => {
  const { getToken } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const data = await getAllCategories();
      setCategories(data);
      // router.push("/admin/categories");
    } catch (err) {
      toast.error("Không thể tải danh mục");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Không tìm thấy token xác thực");
        return;
      }
      await deleteCategoryById(id, token);
      toast.success("Đã xoá category");
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      toast.error("Lỗi khi xoá category");
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchCategories();
  }, [isSignedIn]);

  if (isRoleLoading)
    return <p className="text-center mt-20 text-gray-400">Đang tải quyền người dùng...</p>;

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
            description={cat.description || ""}
            onDelete={handleDelete}
            editUrl={`categories/${cat.id}/edit`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
