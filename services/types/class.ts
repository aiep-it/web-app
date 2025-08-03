import { Student } from "./student";

export enum ClassLevel {
  STARTERS = 'STARTERS',
  MOVERS = 'MOVERS',
  FLYERS = 'FLYERS'
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

export interface ClassResponse {
  id: string;
  name: string;
  code: string;
  level: ClassLevel;
  description?: string;
  teachers: {
    id: string;
    fullName: string;
    email?: string;
  }[];
  roadmaps: {
    id: string;
    name: string;
  }[];
   students?: Student[];
}
