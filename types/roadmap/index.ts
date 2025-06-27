// types/roadmap.ts
export interface Roadmap {
  id: string;
  name: string;
  categoryId: string;
  type: string; // Vẫn giữ type vì nó có trong DB và dữ liệu của bạn, nhưng không dùng để lọc hiển thị
  is_deleted?: boolean;
  isNew?: boolean;
  progressPercentage: number;
  isBookmarked: boolean;
}

export interface CreateRoadmapPayload {
  name: string;
  description?: string | null;
}
