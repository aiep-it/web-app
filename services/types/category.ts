export interface Category {  
    id: string;
    name: string;
    description?: string;
    type: string;
    
}
export interface CreateCategoryPayload {
  name: string;
  description?: string;
  type: string;
}