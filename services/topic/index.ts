import { TopicData, TopicPayload, TopicUpdatePayload } from "../types/topic";
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";

export async function createTopic(payload: TopicPayload): Promise<TopicData | null> {
    try{
        const response = await axiosInstance.post<TopicData>(ENDPOINTS.TOPIC.CREATE, payload);
        if (response.status === 201) {
            return response.data;
        }
        return null;
    } catch (error) {   
        console.error("Error creating node:", error);
        return null;
    }
}

export async function getTopicId(id: string): Promise<TopicData | null> {
    try {
        const response = await axiosInstance.get<TopicData>(ENDPOINTS.TOPIC.GET_BY_ID(id));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching node by ID:", error);
        return null;
    }
}

export async function getTopicsByRoadmapId(roadMapId: string): Promise<TopicData[] | null> {
    try {
        const response = await axiosInstance.get<TopicData[]>(ENDPOINTS.TOPIC.GET_BY_ROADMAP_ID(roadMapId));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching nodes by roadmap ID:", error);
        return null;
    }
}

export async function updateTopic(id: string, payload: TopicUpdatePayload): Promise<TopicData | null> {
    try {
        const response = await axiosInstance.put<TopicData>(ENDPOINTS.TOPIC.UPDATE(id), payload);
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error updating node:", error);
        return null;
    }
}