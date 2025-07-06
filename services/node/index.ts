import { NodeData, NodePayload, NodeUpdatePayload } from "../types/node";
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";

export async function createNode(payload: NodePayload): Promise<NodeData | null> {
    try{
        const response = await axiosInstance.post<NodeData>(ENDPOINTS.NODE.CREATE, payload);
        if (response.status === 201) {
            return response.data;
        }
        return null;
    } catch (error) {   
        console.error("Error creating node:", error);
        return null;
    }
}

export async function getNodeById(id: string): Promise<NodeData | null> {
    try {
        const response = await axiosInstance.get<NodeData>(ENDPOINTS.NODE.GET_BY_ID(id));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching node by ID:", error);
        return null;
    }
}

export async function getNodesByRoadmapId(roadMapId: string): Promise<NodeData[] | null> {
    try {
        const response = await axiosInstance.get<NodeData[]>(ENDPOINTS.NODE.GET_BY_ROADMAP_ID(roadMapId));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching nodes by roadmap ID:", error);
        return null;
    }
}

export async function updateNode(id: string, payload: NodeUpdatePayload): Promise<NodeData | null> {
    try {
        const response = await axiosInstance.put<NodeData>(ENDPOINTS.NODE.UPDATE(id), payload);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error updating node:", error);
        return null;
    }
}