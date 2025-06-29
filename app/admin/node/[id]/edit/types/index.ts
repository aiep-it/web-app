import { NodeData } from "@/services/types/node";

export type NodeContent = {
    content: string;
    coverImage?: File | string;
    suggestionLevel?: string;
}

export type NodeContentForm = Partial<Pick<NodeData, "id" | "title" | "description">> & NodeContent