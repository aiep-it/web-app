
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { UpdateRoleRequest, UserMetrics  } from "../types/user";

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



export const getUserMetrics = async (token: string): Promise<UserMetrics> => {
  try {
    const response = await axiosInstance.get("/users/me/metrics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to fetch user metrics.";
    throw new Error(message);
  }
};
