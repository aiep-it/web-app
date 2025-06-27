// 📁 app/admin/roadmaps/page.tsx
"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { useRoadmap } from "@/hooks/useRoadmap";
import RoadmapSection from "./components/RoadmapSection";

const RoadmapListPage = () => {
  const router = useRouter();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const { categories, roadmaps, handleDelete } = useRoadmap();

  if (isRoleLoading) return <p className="text-center mt-20 text-gray-400">Đang tải quyền người dùng...</p>;
  // if (!isSignedIn) return <p className="text-center mt-20 text-red-400">Bạn chưa đăng nhập.</p>;
  // if (userRole !== "admin" && userRole !== "staff") return <p className="text-center mt-20 text-yellow-400">Bạn không có quyền truy cập.</p>;

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
  <>
      {roadmaps.some((r) => !r.categoryId || !categories.find((c) => c.id === r.categoryId)) && (
      <RoadmapSection
        category={{ id: "unassigned", name: "Pending", description: "Các lộ trình chưa được phân loại", order: 999 }}
        roadmaps={roadmaps.filter(
          (r) =>
            (!r.categoryId || !categories.find((c) => c.id === r.categoryId)) &&
            !r.is_deleted
        )}
        onDelete={handleDelete}
      />
    )}
    {categories.map((category) => {
      const filtered = roadmaps.filter(
        (r) => r.categoryId === category.id && !r.is_deleted
      );
      return (
        <RoadmapSection
          key={category.id}
          category={category}
          roadmaps={filtered}
          onDelete={handleDelete}
        />
      );
    })}

   

  </>
) : (
  <p className="text-white text-center py-8 text-xl">
    Chưa có danh mục lộ trình nào được tạo.
  </p>
)} 

    </div>
  );
};

export default RoadmapListPage;
