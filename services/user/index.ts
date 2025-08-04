
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";

import { UpdateRoleRequest, Teacher, UserData} from "../types/user";


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


export async function getUserByClerkId(id: string): Promise<UserData | null> {
    try {
        const response = await axiosInstance.get<UserData>(ENDPOINTS.AUTHEN.GET_USER_BY_CLERK_ID(id));
        if (response.status === 200) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by clerk ID:", error);
        return null;
    }
}
