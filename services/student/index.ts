// services/student.api.ts

import axiosInstance from '@/lib/axios';
import { ENDPOINTS } from '@/constant/api';
import { StudentPayload, Student } from '@/services/types/student';

export async function getAllStudents(): Promise<Student[]> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.STUDENT.GET_ALL);
    if (response.status === 200) return response.data;
    return [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function createStudent(payload: StudentPayload) {
  try {
    const response = await axiosInstance.post(ENDPOINTS.STUDENT.CREATE, payload);
    if (response.status === 201 || response.status === 200) return response.data;
    return null;
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
}

export async function updateStudent(id: string, payload: StudentPayload) {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.STUDENT.UPDATE(id), payload);
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    console.error(`Error updating student ${id}:`, error);
    return null;
  }
}

export async function deleteStudent(id: string) {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.STUDENT.DELETE(id));
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    return false;
  }
}

export async function importStudentsExcel(file: File) {
  try {
    const form = new FormData();
    form.append('file', file);

    const response = await axiosInstance.post(ENDPOINTS.STUDENT.IMPORT, form, {
      headers: {
        'Content-Type': 'multipart/form-data', // ✅ Ghi đè
      }
    });

    if (response.status === 200 || response.status === 201) return response.data;
    return null;
  } catch (error) {
    console.error('Error importing students Excel:', error);
    return null;
  }
}

export async function changeStudentPassword(payload: { oldPassword: string; newPassword: string }) {
  try {
    const response = await axiosInstance.patch(ENDPOINTS.STUDENT.CHANGE_MY_PASSWORD, payload);
    if (response.status === 200) return response.data;
    return null;
  } catch (error) {
    console.error('Error changing password:', error);
    return null;
  }
}
