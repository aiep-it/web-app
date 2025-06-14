
import { ENDPOINTS } from "@/constant/api";
import axiosInstance from "@/lib/axios";
import { UpdateRoleRequest } from "../types/user";

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
