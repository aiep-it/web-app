import { TopicData } from "@/services/types/topic";

export type TopicContent = {
    content: string;
    coverImage?: File | string;
    suggestionLevel?: string;
}

export type TopicContentForm = Partial<Pick<TopicData, "id" | "title" | "description">> & TopicContent

export type TopicContentCMS = {
    id: string;
    content: string;
    nodeId: string;
}