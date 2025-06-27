// services/roadmap.ts
import { Roadmap } from "@/types/roadmap/index";
import { CreateRoadmapPayload } from "@/types/roadmap";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export const getAllRoadmaps = async (token: string): Promise<Roadmap[]> => {
  const res = await fetch(`${BASE_URL}/roadmaps`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Lỗi khi tải roadmap");
  return await res.json();
};

export const deleteRoadmapById = async (id: string, token: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/roadmaps/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Xoá thất bại");
};

export const createRoadmap = async (payload: CreateRoadmapPayload, token: string) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
  const res = await fetch(`${backendUrl}/roadmaps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Tạo roadmap thất bại");
  return await res.json();
};