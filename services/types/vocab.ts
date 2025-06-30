export enum VocabColumn {
  created_at = "created_at",
}

export type VocabSortOrder = "asc" | "desc";

export type VocabFilters = Record<string, any>;

export interface VocabSort {
  field: VocabColumn;
  order: VocabSortOrder;
}

export interface VocabSearchPayload {
  page: number;
  size: number;
  searchKey?: string;
  sort?: VocabSort[];
  filters?: VocabFilters;
}

export interface VocabPayload {
  word?: string;
  meaning?: string;
  example?: string;
  imageUrl?: string;
  audioUrl?: string;
  is_know?: boolean;
  nodeId?: string;
}

export interface VocabData {
  id: string;
  nodeId: string;
  word: string;
  meaning: string;
  example: string;
  imageUrl: string;
  audioUrl: string;
  is_know: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface VocabListResponse {
  content: VocabData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
