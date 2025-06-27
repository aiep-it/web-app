// hooks/useRoadmap.ts
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { getAllRoadmaps, deleteRoadmapById } from "@/services/roadmap/index";
import { getAllCategories } from "@/services/category/index";
import { Roadmap } from "@/types/roadmap/index";
import { Category } from "@/types/category/index";

export const useRoadmap = () => {
  const { getToken } = useAuth();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Không thể xác thực người dùng");
        return;
      }
      const [roadmapRes, categoryRes] = await Promise.all([
        getAllRoadmaps(token),
        getAllCategories(),
      ]);
      setRoadmaps(roadmapRes);
      setCategories(categoryRes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (err) {
      toast.error("Không thể tải dữ liệu");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Không thể xác thực người dùng");
        return;
      }
      await deleteRoadmapById(id, token);
      toast.success("Đã xoá roadmap");
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Lỗi khi xoá roadmap");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { roadmaps, categories, handleDelete };
};
