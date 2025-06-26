"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { toast } from "react-hot-toast";
import BaseCard from "@/components/card/BaseCard";

interface Roadmap {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  is_deleted?: boolean;
}

interface Category {
  id: string;
  name: string;
  order: number;
}

const RoadmapListPage = () => {
  const { getToken } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const router = useRouter();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchRoadmaps = async () => {
    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
      const res = await fetch(`${backendUrl}/roadmaps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRoadmaps(data);
    } catch (err) {
      toast.error("Không thể tải roadmap");
    }
  };

  const fetchCategories = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
      const res = await fetch(`${backendUrl}/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setCategories(data.sort((a: Category, b: Category) => a.order - b.order));
    } catch (err) {
      toast.error("Không thể tải danh mục");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
      const res = await fetch(`${backendUrl}/roadmaps/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Xoá thất bại");

      toast.success("Đã xoá roadmap");
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error("Lỗi khi xoá roadmap");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchRoadmaps();
      fetchCategories();
    }
  }, [isSignedIn]);

  if (isRoleLoading) return <p className="text-center mt-20 text-gray-400">Đang tải quyền người dùng...</p>;
  if (!isSignedIn) return <p className="text-center mt-20 text-red-400">Bạn chưa đăng nhập.</p>;
  if (userRole !== "admin" && userRole !== "staff") return <p className="text-center mt-20 text-yellow-400">Bạn không có quyền truy cập.</p>;

  return (
    <div className="min-h-screen dark:bg-black-10 text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Roadmap List</h1>
        <Link href="/admin/roadmap/addroadmap">
          <Button className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white">
            + Add New Roadmap
          </Button>
        </Link>
      </div>

      {categories.length > 0 ? (
        categories.map((category) => {
          const filteredRoadmaps = roadmaps.filter(
            (r) => r.categoryId === category.id && !r.is_deleted
          );

          return (
            <div key={category.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                {category.name}
              </h3>
              {filteredRoadmaps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredRoadmaps.map((r) => (
                    <BaseCard
                      key={r.id}
                      id={r.id}
                      name={r.name}
                      description={r.description}
                      onDelete={handleDelete}
                      editUrl={`roadmaps/${r.id}/edit`}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">Không có roadmap trong danh mục này.</p>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-white text-center py-8 text-xl">Chưa có danh mục lộ trình nào được tạo.</p>
      )}
    </div>
  );
};

export default RoadmapListPage;