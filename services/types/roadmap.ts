import { Category } from "./category";

export interface Roadmap {  
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    category: Category;
    categoryId?: string;
}

export interface RoadmapPayload { 
    name: string;
    description?: string;
    categoryId: string;
}