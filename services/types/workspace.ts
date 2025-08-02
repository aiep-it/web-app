import { Topic } from "@/types/vocabulary";
import { TopicData } from "./topic";

export type WorkspaceCreateTopicPayload = {
  title: string;
  description: string;
};


export interface Workspace {  
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    categoryId?: string;
    topics?: TopicData[];
}