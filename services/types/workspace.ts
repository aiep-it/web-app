import { Topic } from "@/types/vocabulary";
import { TopicData } from "./topic";
import { VocabData } from "./vocab";

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

export interface PersonalLearning {
  id?: string,
  title: string,
  description?: string,
  image?: string,
  topicId?: string,
  vocabs?: VocabData[];
}

export interface PersonalLearningCreatePayload {
  title: string,
  description?: string,
  image?: string,
  topicId: string,
  vocabs?: VocabData[];
}