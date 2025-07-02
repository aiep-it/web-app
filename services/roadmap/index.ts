// services/roadmap.ts

import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { Roadmap, RoadmapPayload } from "../types/roadmap";

// Lấy tất cả roadmap

export const getAllRoadmaps = async (token: string): Promise<Roadmap[]> => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ROAD_MAP.GET_ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
       console.log("✅ getAllRoadmaps response:", response.status, response.data);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return [];
  }
};

// Lấy roadmap theo ID – CÓ TOKEN
export const getRoadmapById = async (id: string, token: string): Promise<Roadmap | null> => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ROAD_MAP.GET_BY_ID(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching roadmap by ID ${id}:`, error);
    return null;
  }
};

// Tạo roadmap mới
export const createRoadmap = async (
  payload: RoadmapPayload,
  token: string
): Promise<Roadmap | null> => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ROAD_MAP.CREATE, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error creating roadmap:", error);
    return null;
  }
};

// Xoá roadmap theo ID
export const deleteRoadmapById = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    await axiosInstance.delete(ENDPOINTS.ROAD_MAP.GET_BY_ID(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting roadmap ID ${id}:`, error);
    throw new Error("Xoá roadmap thất bại");
  }
};

// Toggle bookmark roadmap (bookmark hoặc bỏ bookmark)
export const toggleBookmark = async (
  roadmapId: string,
  bookmark: boolean,
  token: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.ROAD_MAP.BOOKMARK(roadmapId),
      { bookmark },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error(`Error toggling bookmark for roadmap ${roadmapId}:`, error);
    throw error;
  }
};
