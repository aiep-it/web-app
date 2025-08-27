// services/types/stats.ts
export type RangeKey = "7d" | "30d" | "90d" | "365d";

export type SeriesPoint = { label: string; value: number };

export type StudentsRes = {
  total: number;
  activate?: number;
  deactivate?: number;
  series: SeriesPoint[];
};

export type TeachersRes = {
  total: number;
  series: SeriesPoint[];
};

export type ClassRecent = {
  id: string;
  name: string;
  code?: string;
  level?: string;
  description?: string;
  createdAt: string;
  teacherNames?: string[];
  studentCount?: number;
  roadmapCount?: number;
};

export type ClassesRes = {
  total: number;
  series: SeriesPoint[];
  recent: ClassRecent[];
};

export type RoleItem = { name: string; value: number; percent?: number };
export type RoleDistResp = { total: number; data: RoleItem[]; generatedAt?: string };
