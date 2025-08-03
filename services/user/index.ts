
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { UpdateRoleRequest, Teacher } from "../types/user";

export async function updateRole(payload: UpdateRoleRequest)  {
  try {
    return await axiosInstance
      .post(ENDPOINTS.AUTHEN.ROLE, payload)
      .then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        return null;
      })
      .catch((e) => console.log(e));
  } catch {
    return null
  }
}
export async function getAllTeachers(): Promise<Teacher[]> {
  try {
    const response = await axiosInstance.get(ENDPOINTS.USER.TEACHER);
    if (response.status === 200) return response.data;
    return [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
}