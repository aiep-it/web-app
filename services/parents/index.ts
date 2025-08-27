import axiosInstance from '@/lib/axios';
import { FeedbackData, StudentData, TeacherFeedback } from '../types/user';
import { ENDPOINTS } from '@/constant/api';

export async function getMyChildrens(): Promise<StudentData[] | []> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PARENT.GET_CHILDREN);
    if (response.status === 200) {
      return response.data; 
    }
    return []; 
  } catch (error) {
    console.error('Error fetching children:', error);
    return [];
  }
}
export async function getChildReport(childId: string): Promise<any | null> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.PARENT.GET_CHILD_REPORT(childId));
    if (response.status === 200) {
      return response.data; 
    }
    return null; 
  } catch (error) {
    console.error('Error fetching child report:', error);
    return null;
  }
}

export async function getFeedback(childId: string): Promise<FeedbackData[] | null> {
    try {
        const response = await axiosInstance.get(ENDPOINTS.PARENT.GET_FEEDBACK(childId));
        if (response.status === 200) {
          return response.data; 
        }
        return []; 
      } catch (error) {
        console.error('Error fetching child report:', error);
        return [];
      }
}

export async function teacherGetFeedback(stdId: string, classId: string): Promise<TeacherFeedback[] | null> {
    try {
        const response = await axiosInstance.get(ENDPOINTS.CLASS.GET_FEEDBACK(stdId, classId));
        if (response.status === 200) {
          return response.data; 
        }
        return []; 
      } catch (error) {
        console.error('Error fetching child report:', error);
        return [];
      }
}
