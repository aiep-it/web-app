import { NodeData, NodePayload } from "../types/node";
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