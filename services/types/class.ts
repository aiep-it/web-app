import { Student } from './student';

export enum ClassLevel {
  STARTERS = 'STARTERS',
  MOVERS = 'MOVERS',
  FLYERS = 'FLYERS',
}

export interface ClassPayload {
  name: string;
  code: string;
  level: ClassLevel;
  description?: string;
}

export interface AddTeacherPayload {
  teacherId: string;
}

export interface AddStudentsPayload {
  studentIds: string[];
}

export interface ClassTopic {
  id: string;
  title: string;
  image: string;
  description?: string;
  progress?: {
    learnedVocabs?: null | number; // null if not calculated
    totalVocabs?: number | null; // null if not calculated
  };
}
export interface ClassRoadmap {
  id: string;
  name: string;
  topics?: ClassTopic[];
  category?: string; // Optional category for the roadmap
}
export interface ClassTeacher {
  id: string;
  fullName: string;
  email?: string;
}
export interface ClassResponse {
  id: string;
  name: string;
  code: string;
  level: ClassLevel;
  description?: string;
  teachers: ClassTeacher[];
  roadmaps: ClassRoadmap[];
  students?: Student[];
}

export interface UserClass {
  code: string;
  description?: string;
  id?: string;
  level?: 'FLYERS';
  name?: string;
  role?: 'TEACHER' | 'STUDENT';
}
