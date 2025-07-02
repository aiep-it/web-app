//web-app\services\types\roadmap.ts
import { Category } from "./category";

export interface Roadmap {
  id: string;
  name: string;
  description?: string;
  isBookmarked: boolean;
  is_deleted?: boolean;
  progressPercentage: number;
  createdAt?: string;   
  updatedAt?: string;
  categoryId: string; 
  category?: Category;
}

export interface RoadmapPayload { 
    name: string;
    description?: string;
    categoryId: string;
}
