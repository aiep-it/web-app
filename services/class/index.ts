// services/class.api.ts
import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/constant/api';
import {
  ClassPayload,
  ClassResponse,
  AddTeacherPayload,
  AddStudentsPayload,
  UserClass,
} from '../types/class';

export async function getAllClasses(query?: { teacherId?: string; search?: string }): Promise<ClassResponse[]> {
  try {
    const res = await axiosInstance.get(ENDPOINTS.CLASS.GET_ALL, { params: query });
    return res.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

export async function getClassById(id: string): Promise<ClassResponse | null> {
  try {
    const res = await axiosInstance.get(ENDPOINTS.CLASS.GET_BY_ID(id));
    return res.data;
  } catch (error) {
    console.error('Error fetching class by id:', error);
    return null;
  }
}

export async function createClass(payload: ClassPayload): Promise<boolean> {
  try {
    const res = await axiosInstance.post(ENDPOINTS.CLASS.CREATE, payload);
    return res.status === 201;
  } catch (error) {
    console.error('Error creating class:', error);
    return false;
  }
}

export async function updateClass(id: string, payload: Partial<ClassPayload>): Promise<boolean> {
  try {
    const res = await axiosInstance.put(ENDPOINTS.CLASS.UPDATE(id), payload);
    return res.status === 200;
  } catch (error) {
    console.error('Error updating class:', error);
    return false;
  }
}

export async function deleteClass(id: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete(ENDPOINTS.CLASS.DELETE(id));
    return res.status === 204;
  } catch (error) {
    console.error('Error deleting class:', error);
    return false;
  }
}

export async function addTeacherToClass(id: string, payload: AddTeacherPayload): Promise<boolean> {
  try {
    const res = await axiosInstance.patch(ENDPOINTS.CLASS.ADD_TEACHER(id), payload);
    return res.status === 200;
  } catch (error) {
    console.error('Error adding teacher:', error);
    return false;
  }
}

export async function removeTeacherFromClass(id: string, payload: AddTeacherPayload): Promise<boolean> {
  try {
    const res = await axiosInstance.patch(ENDPOINTS.CLASS.REMOVE_TEACHER(id), payload);
    return res.status === 200;
  } catch (error) {
    console.error('Error removing teacher:', error);
    return false;
  }
}

export async function addStudentsToClass(id: string, payload: AddStudentsPayload): Promise<boolean> {
  try {
    const res = await axiosInstance.patch(ENDPOINTS.CLASS.ADD_STUDENTS(id), payload);
    return res.status === 200;
  } catch (error) {
    console.error('Error adding students:', error);
    return false;
  }
}
export async function addRoadmapToClass(id: string, roadmapId: string): Promise<boolean> {
  try {
    const res = await axiosInstance.post(ENDPOINTS.CLASS.ADD_ROADMAP(id), { roadmapId });
    return res.status === 200 || res.status === 201;
  } catch (error) {
    console.error('Error adding roadmap:', error);
    return false;
  }
}

export async function removeStudentFromClass(id: string, studentId: string): Promise<boolean> {
  try {
    const res = await axiosInstance.delete(ENDPOINTS.CLASS.REMOVE_STUDENT(id, studentId));
    return res.status === 200;
  } catch (error) {
    console.error('Error removing student:', error);
    return false;
  }
}

export async function removeRoadmapFromClass(id: string, roadmapId: string): Promise<boolean> {
  try {
    const res = await axiosInstance.patch(ENDPOINTS.CLASS.REMOVE_ROADMAP(id), { roadmapId });
    return res.status === 200;
  } catch (error) {
    console.error('Error removing roadmap:', error);
    return false;
  }
}

export async function getMyClass(classId: string): Promise<ClassResponse | null> {
  try {
    const res = await axiosInstance.get(ENDPOINTS.CLASS.MY_CLASS(classId));
    return res.data;
  } catch (error) {
    console.error('Error fetching my classes:', error);
    return null;
  }
}

export async function getMyClasses(): Promise<UserClass[] | null> {
  try {
    const res = await axiosInstance.get(ENDPOINTS.CLASS.ALL_MY_CLASSES);
    return res.data;
  } catch (error) {
    console.error('Error fetching my classes:', error);
    return null;
  }
}

export async function joinClassByCode(classCode: string){
  try {
    const res = await axiosInstance.post(ENDPOINTS.CLASS.JOIN_BY_CODE, { classCode });
    return res.status === 200 || res.status === 201;
  } catch (error) {
    console.error('Error joining class by code:', error);
    return false;
  }
}

