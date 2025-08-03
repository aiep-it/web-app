import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { Roadmap, RoadmapPayload } from "../types/roadmap";

export async function getRoadmap() {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ROAD_MAP.GET_ALL);
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    
    // Re-throw the error so Redux can handle it properly
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch roadmaps');
  }
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.ROAD_MAP.GET_BY_ID(id));
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching roadmap by ID ${id}:`, error);
    
    // Re-throw the error so Redux can handle it properly
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Failed to fetch roadmap by ID ${id}`);
  }
}

export async function createRoadmap(payload: RoadmapPayload) {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ROAD_MAP.CREATE, payload);
    
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error creating roadmap:", error);
    
    // Re-throw the error so Redux can handle it properly
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to create roadmap');
  }
}
