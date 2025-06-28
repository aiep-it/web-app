import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { Roadmap, RoadmapPayload } from "../types/roadmap";

export async function getRoadmap() {
  try {
    return await axiosInstance
      .get(ENDPOINTS.ROAD_MAP.GET_ALL)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return [];
      })
      .catch((e) => {
        console.error("Error fetching roadmaps:", e);
        return [];
      });
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    return [];
  }
}

export async function getRoadmapById(id: string):  Promise<Roadmap | null> {
  try {
    return await axiosInstance
      .get(ENDPOINTS.ROAD_MAP.GET_BY_ID(id))
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return null;
      })
      .catch((e) => {
        console.error(`Error fetching roadmap by ID ${id}:`, e);
        return null;
      });
  } catch (error) {
    console.error(`Error fetching roadmap by ID ${id}:`, error);
    return null;
  }
}

export async function createRoadmap(payload: RoadmapPayload) {
  try {
    return await axiosInstance
      .post(ENDPOINTS.ROAD_MAP.CREATE, payload)
      .then((response) => {
        if (response.status === 201) {
          return response.data;
        }
        return null;
      })
      .catch((e) => {
        console.error("Error creating roadmap:", e);
        return null;
      });
  } catch (error) {
    console.error("Error creating roadmap:", error);
    return null;
  }
}
