<<<<<<< HEAD
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { toast } from "react-hot-toast";
import BaseCard from "@/components/card/BaseCard";

const RoadmapListPage = () => {
  const { getToken } = useAuth();
  const { userRole, isSignedIn, isRoleLoading } = useUserRole();
  const router = useRouter();

  type Roadmap = {
    id: string;
    name: string;
    description: string;
  };

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

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
      setRoadmaps(roadmaps.filter((r) => r.id !== id));
    } catch (err) {
      toast.error("Lỗi khi xoá roadmap");
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchRoadmaps();
  }, [isSignedIn]);

  if (isRoleLoading) return <p className="text-center mt-20 text-gray-400">Đang tải quyền người dùng...</p>;
  if (!isSignedIn) return <p className="text-center mt-20 text-red-400">Bạn chưa đăng nhập.</p>;
  if (userRole !== "admin" && userRole !== "staff") return <p className="text-center mt-20 text-yellow-400">Bạn không có quyền truy cập.</p>;

  return (
    <div className="min-h-screen dark:bg-gray-800 text-foreground p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Roadmap List</h1>
        <Link href="/admin/roadmap/addroadmap">
          <Button className="bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 text-white">
            + Add New Roadmap
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {roadmaps.map((r) => (
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
    </div>
  );
};

export default RoadmapListPage;
=======
import { Tab, Tabs } from "@heroui/react";
import React from "react";
import RoadMapClient from "./RoadMapClient";

const RoadMapPage = () => {
  return (
    <div className={"p-8"}>
      <RoadMapClient />
    </div>
  );
};

export default RoadMapPage;
>>>>>>> 9fe4e0c35a50f14a7dfb7c3d5c0cc6c7dca90b55
